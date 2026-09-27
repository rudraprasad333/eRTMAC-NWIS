import math
import random
from datetime import datetime, timedelta
import json
from sqlalchemy.orm import Session
from app.models.entities import Well, DrillingParameter, HistoricalEvent, Formation, Document, RiskPrediction
from app.config import DATA_DIR, UPLOADS_DIR

# Seed for reproducibility while ensuring realistic diversity
random.seed(42)

FORMATIONS_DATA = [
    {
        "formation_name": "Quaternary Alluvium",
        "top_depth": 0.0,
        "bottom_depth": 350.0,
        "lithology": "Unconsolidated Sand & Gravel",
        "pressure_regime": "Normal (8.6 ppg)",
        "risk_characteristics": "Surface hole washout, lost circulation in gravel beds",
        "color_code": "#D97706"
    },
    {
        "formation_name": "Thumbli Claystone",
        "top_depth": 350.0,
        "bottom_depth": 1150.0,
        "lithology": "Lignitic Claystone & Siltstone",
        "pressure_regime": "Normal (8.9 ppg)",
        "risk_characteristics": "Bit balling, reactive clay swelling",
        "color_code": "#059669"
    },
    {
        "formation_name": "Dharvi Dungar Siltstone",
        "top_depth": 1150.0,
        "bottom_depth": 1950.0,
        "lithology": "Interbedded Sandstone & Claystone",
        "pressure_regime": "Normal (9.2 ppg)",
        "risk_characteristics": "Mild tight hole on trips, abrasive sand streaks",
        "color_code": "#0284C7"
    },
    {
        "formation_name": "Barmer Hill Shale",
        "top_depth": 1950.0,
        "bottom_depth": 2650.0,
        "lithology": "Siliceous Porcelanite & Organic Shale",
        "pressure_regime": "Slight Overpressure (9.8 ppg)",
        "risk_characteristics": "Brittle shale caving, wellbore sloughing, torque spikes",
        "color_code": "#4F46E5"
    },
    {
        "formation_name": "Fatehgarh Upper",
        "top_depth": 2650.0,
        "bottom_depth": 2700.0,
        "lithology": "Fluvial Coarse Sandstone",
        "pressure_regime": "Transitional (10.2 ppg)",
        "risk_characteristics": "Seepage losses, differential sticking in porous intervals",
        "color_code": "#7C3AED"
    },
    {
        "formation_name": "Fatehgarh Lower",
        "top_depth": 2700.0,
        "bottom_depth": 2850.0,
        "lithology": "Glauconitic Sandstone & Fractured Shale",
        "pressure_regime": "Overpressured Reservoir (10.8 ppg)",
        "risk_characteristics": "CRITICAL RISK: Differential sticking, severe lost circulation, gas influx/kick, excessive drag",
        "color_code": "#E11D48"
    },
    {
        "formation_name": "Nagana Volcanics / Basement",
        "top_depth": 2850.0,
        "bottom_depth": 3600.0,
        "lithology": "Basalt & Fractured Rhyolite",
        "pressure_regime": "Sub-normal to Depleted (9.4 ppg)",
        "risk_characteristics": "High vibration, severe drill bit wear, lost circulation in fracture corridors",
        "color_code": "#475569"
    }
]

# Baseline coordinates: Barmer Basin block center (25.7512 N, 71.3850 E)
BASE_LAT = 25.7512
BASE_LON = 71.3850

WELL_SPECS = [
    # Active Well
    {
        "well_id": "OIL-W102",
        "lat_offset": 0.0,
        "lon_offset": 0.0,
        "total_depth": 3450.0,
        "formation": "Fatehgarh Lower",
        "lithology": "Glauconitic Sandstone / Shale",
        "status": "Drilling",
        "spud_date": "2026-08-14",
        "well_type": "Deviated",
        "trajectory_type": "S-Type",
        "pressure": 3450.0,
        "temperature": 118.0
    },
    # Top Analogue 1: Very close, highly similar
    {
        "well_id": "OIL-W087",
        "lat_offset": 0.0082,
        "lon_offset": 0.0075,
        "total_depth": 3420.0,
        "formation": "Fatehgarh Lower",
        "lithology": "Glauconitic Sandstone / Shale",
        "status": "Completed",
        "spud_date": "2025-03-10",
        "well_type": "Deviated",
        "trajectory_type": "S-Type",
        "pressure": 3480.0,
        "temperature": 119.5
    },
    # Top Analogue 2: Close, high torque history
    {
        "well_id": "OIL-W091",
        "lat_offset": -0.0145,
        "lon_offset": 0.0160,
        "total_depth": 3390.0,
        "formation": "Fatehgarh Lower",
        "lithology": "Glauconitic Sandstone / Shale",
        "status": "Completed",
        "spud_date": "2025-06-22",
        "well_type": "Deviated",
        "trajectory_type": "J-Type",
        "pressure": 3420.0,
        "temperature": 117.0
    },
    # Top Analogue 3: Close, differential sticking history
    {
        "well_id": "OIL-W074",
        "lat_offset": 0.0220,
        "lon_offset": -0.0210,
        "total_depth": 3500.0,
        "formation": "Fatehgarh Lower",
        "lithology": "Glauconitic Sandstone / Fractured Shale",
        "status": "Completed",
        "spud_date": "2024-11-05",
        "well_type": "Deviated",
        "trajectory_type": "S-Type",
        "pressure": 3510.0,
        "temperature": 121.0
    },
    # Additional 28 offset wells across the block
    {"well_id": "OIL-W062", "lat_offset": 0.035, "lon_offset": 0.012, "total_depth": 3280.0, "formation": "Fatehgarh Upper", "lithology": "Fluvial Sandstone", "status": "Completed", "spud_date": "2024-04-12", "well_type": "Vertical", "trajectory_type": "Vertical", "pressure": 3200.0, "temperature": 105.0},
    {"well_id": "OIL-W065", "lat_offset": -0.028, "lon_offset": -0.018, "total_depth": 3410.0, "formation": "Fatehgarh Lower", "lithology": "Glauconitic Sandstone", "status": "Completed", "spud_date": "2024-07-19", "well_type": "Deviated", "trajectory_type": "S-Type", "pressure": 3460.0, "temperature": 118.0},
    {"well_id": "OIL-W068", "lat_offset": 0.015, "lon_offset": 0.042, "total_depth": 3550.0, "formation": "Nagana Volcanics", "lithology": "Basalt", "status": "Completed", "spud_date": "2024-09-02", "well_type": "Horizontal", "trajectory_type": "Horizontal", "pressure": 3600.0, "temperature": 125.0},
    {"well_id": "OIL-W071", "lat_offset": -0.045, "lon_offset": 0.025, "total_depth": 3150.0, "formation": "Barmer Hill Shale", "lithology": "Siliceous Porcelanite", "status": "Suspended", "spud_date": "2024-10-14", "well_type": "Deviated", "trajectory_type": "J-Type", "pressure": 3100.0, "temperature": 99.0},
    {"well_id": "OIL-W078", "lat_offset": 0.052, "lon_offset": -0.035, "total_depth": 3480.0, "formation": "Fatehgarh Lower", "lithology": "Glauconitic Sandstone", "status": "Completed", "spud_date": "2025-01-18", "well_type": "Deviated", "trajectory_type": "S-Type", "pressure": 3490.0, "temperature": 120.0},
    {"well_id": "OIL-W080", "lat_offset": -0.018, "lon_offset": -0.048, "total_depth": 3320.0, "formation": "Fatehgarh Upper", "lithology": "Fluvial Sandstone", "status": "Completed", "spud_date": "2025-02-04", "well_type": "Vertical", "trajectory_type": "Vertical", "pressure": 3280.0, "temperature": 110.0},
    {"well_id": "OIL-W083", "lat_offset": 0.011, "lon_offset": -0.012, "total_depth": 3400.0, "formation": "Fatehgarh Lower", "lithology": "Glauconitic Sandstone", "status": "Completed", "spud_date": "2025-02-28", "well_type": "Deviated", "trajectory_type": "S-Type", "pressure": 3440.0, "temperature": 116.5},
    {"well_id": "OIL-W089", "lat_offset": 0.038, "lon_offset": 0.031, "total_depth": 3620.0, "formation": "Nagana Volcanics", "lithology": "Basalt Interflow", "status": "Completed", "spud_date": "2025-04-15", "well_type": "Horizontal", "trajectory_type": "Horizontal", "pressure": 3650.0, "temperature": 128.0},
    {"well_id": "OIL-W093", "lat_offset": -0.032, "lon_offset": 0.045, "total_depth": 3350.0, "formation": "Fatehgarh Lower", "lithology": "Glauconitic Sandstone", "status": "Completed", "spud_date": "2025-07-08", "well_type": "Deviated", "trajectory_type": "J-Type", "pressure": 3410.0, "temperature": 115.0},
    {"well_id": "OIL-W095", "lat_offset": 0.065, "lon_offset": -0.010, "total_depth": 3200.0, "formation": "Barmer Hill Shale", "lithology": "Organic Shale", "status": "Completed", "spud_date": "2025-08-30", "well_type": "Vertical", "trajectory_type": "Vertical", "pressure": 3150.0, "temperature": 102.0},
    {"well_id": "OIL-W097", "lat_offset": -0.058, "lon_offset": -0.030, "total_depth": 3440.0, "formation": "Fatehgarh Lower", "lithology": "Sandstone / Shale", "status": "Completed", "spud_date": "2025-10-12", "well_type": "Deviated", "trajectory_type": "S-Type", "pressure": 3470.0, "temperature": 119.0},
    {"well_id": "OIL-W099", "lat_offset": 0.024, "lon_offset": 0.062, "total_depth": 3520.0, "formation": "Fatehgarh Lower", "lithology": "Glauconitic Sandstone", "status": "Completed", "spud_date": "2025-12-01", "well_type": "Deviated", "trajectory_type": "S-Type", "pressure": 3500.0, "temperature": 122.0},
    {"well_id": "OIL-W100", "lat_offset": -0.010, "lon_offset": 0.033, "total_depth": 3380.0, "formation": "Fatehgarh Lower", "lithology": "Glauconitic Sandstone", "status": "Completed", "spud_date": "2026-01-15", "well_type": "Deviated", "trajectory_type": "S-Type", "pressure": 3430.0, "temperature": 117.5},
    {"well_id": "OIL-W101", "lat_offset": 0.048, "lon_offset": -0.055, "total_depth": 3300.0, "formation": "Fatehgarh Upper", "lithology": "Fluvial Sandstone", "status": "Completed", "spud_date": "2026-04-20", "well_type": "Vertical", "trajectory_type": "Vertical", "pressure": 3250.0, "temperature": 108.0},
    {"well_id": "OIL-W103", "lat_offset": -0.070, "lon_offset": 0.015, "total_depth": 3580.0, "formation": "Nagana Volcanics", "lithology": "Basalt", "status": "Planned", "spud_date": "2026-10-01", "well_type": "Deviated", "trajectory_type": "S-Type", "pressure": 3590.0, "temperature": 126.0},
    {"well_id": "OIL-W104", "lat_offset": 0.019, "lon_offset": -0.072, "total_depth": 3250.0, "formation": "Barmer Hill Shale", "lithology": "Siliceous Porcelanite", "status": "Completed", "spud_date": "2026-02-10", "well_type": "Vertical", "trajectory_type": "Vertical", "pressure": 3180.0, "temperature": 104.0},
    {"well_id": "OIL-W105", "lat_offset": -0.039, "lon_offset": -0.065, "total_depth": 3490.0, "formation": "Fatehgarh Lower", "lithology": "Glauconitic Sandstone", "status": "Completed", "spud_date": "2026-03-05", "well_type": "Deviated", "trajectory_type": "S-Type", "pressure": 3480.0, "temperature": 120.5},
    {"well_id": "OIL-W106", "lat_offset": 0.075, "lon_offset": 0.040, "total_depth": 3650.0, "formation": "Nagana Volcanics", "lithology": "Basalt", "status": "Completed", "spud_date": "2026-05-14", "well_type": "Horizontal", "trajectory_type": "Horizontal", "pressure": 3680.0, "temperature": 130.0},
    {"well_id": "OIL-W107", "lat_offset": -0.082, "lon_offset": -0.025, "total_depth": 3180.0, "formation": "Barmer Hill Shale", "lithology": "Organic Shale", "status": "Suspended", "spud_date": "2026-06-01", "well_type": "Deviated", "trajectory_type": "J-Type", "pressure": 3120.0, "temperature": 101.0},
    {"well_id": "OIL-W108", "lat_offset": 0.033, "lon_offset": -0.088, "total_depth": 3420.0, "formation": "Fatehgarh Lower", "lithology": "Glauconitic Sandstone", "status": "Completed", "spud_date": "2026-07-02", "well_type": "Deviated", "trajectory_type": "S-Type", "pressure": 3450.0, "temperature": 118.0},
    {"well_id": "OIL-W109", "lat_offset": -0.022, "lon_offset": 0.078, "total_depth": 3530.0, "formation": "Fatehgarh Lower", "lithology": "Glauconitic Sandstone", "status": "Completed", "spud_date": "2026-07-28", "well_type": "Deviated", "trajectory_type": "S-Type", "pressure": 3510.0, "temperature": 121.5},
    {"well_id": "OIL-W110", "lat_offset": 0.088, "lon_offset": -0.045, "total_depth": 3310.0, "formation": "Fatehgarh Upper", "lithology": "Fluvial Sandstone", "status": "Completed", "spud_date": "2026-08-01", "well_type": "Vertical", "trajectory_type": "Vertical", "pressure": 3260.0, "temperature": 109.0},
    {"well_id": "OIL-W111", "lat_offset": -0.060, "lon_offset": 0.068, "total_depth": 3460.0, "formation": "Fatehgarh Lower", "lithology": "Glauconitic Sandstone", "status": "Completed", "spud_date": "2026-08-10", "well_type": "Deviated", "trajectory_type": "S-Type", "pressure": 3475.0, "temperature": 119.0},
    {"well_id": "OIL-W112", "lat_offset": 0.055, "lon_offset": 0.082, "total_depth": 3600.0, "formation": "Nagana Volcanics", "lithology": "Basalt", "status": "Planned", "spud_date": "2026-11-15", "well_type": "Deviated", "trajectory_type": "S-Type", "pressure": 3610.0, "temperature": 127.0},
    {"well_id": "OIL-W113", "lat_offset": -0.095, "lon_offset": 0.040, "total_depth": 3240.0, "formation": "Barmer Hill Shale", "lithology": "Siliceous Porcelanite", "status": "Completed", "spud_date": "2026-08-20", "well_type": "Deviated", "trajectory_type": "J-Type", "pressure": 3170.0, "temperature": 103.0},
    {"well_id": "OIL-W114", "lat_offset": 0.005, "lon_offset": -0.095, "total_depth": 3390.0, "formation": "Fatehgarh Lower", "lithology": "Glauconitic Sandstone", "status": "Completed", "spud_date": "2026-08-25", "well_type": "Deviated", "trajectory_type": "S-Type", "pressure": 3440.0, "temperature": 117.0},
    {"well_id": "OIL-W115", "lat_offset": -0.040, "lon_offset": -0.090, "total_depth": 3510.0, "formation": "Fatehgarh Lower", "lithology": "Glauconitic Sandstone", "status": "Completed", "spud_date": "2026-09-01", "well_type": "Deviated", "trajectory_type": "S-Type", "pressure": 3495.0, "temperature": 120.0},
    {"well_id": "OIL-W116", "lat_offset": 0.092, "lon_offset": 0.015, "total_depth": 3360.0, "formation": "Fatehgarh Upper", "lithology": "Fluvial Sandstone", "status": "Completed", "spud_date": "2026-09-08", "well_type": "Vertical", "trajectory_type": "Vertical", "pressure": 3300.0, "temperature": 111.0},
]

SPECIFIC_EVENTS = [
    # Top Analogue 1 Events (OIL-W087)
    {
        "well_id": "OIL-W087",
        "depth": 2735.0,
        "event_type": "LOST_CIRCULATION",
        "severity": "HIGH",
        "description": "Severe partial lost circulation (42 bbl/hr) upon entering fractured porous sand streak in Fatehgarh Lower.",
        "duration": 18.5,
        "npt_hours": 14.0,
        "formation": "Fatehgarh Lower",
        "mitigation": "Pumped 30 bbl medium LCM pill (nut plug + mica). Reduced mud weight from 11.2 to 10.8 ppg."
    },
    {
        "well_id": "OIL-W087",
        "depth": 2742.0,
        "event_type": "STUCK_PIPE",
        "severity": "CRITICAL",
        "description": "Differential sticking while stationary for survey at 2,742 m. Overbalance estimated at 480 psi.",
        "duration": 34.0,
        "npt_hours": 28.5,
        "formation": "Fatehgarh Lower",
        "mitigation": "Spotted 45 bbl pipe-release oil-based pill. Jarred down with 110 klbs for 4.2 hours to free BHA."
    },
    # Top Analogue 2 Events (OIL-W091)
    {
        "well_id": "OIL-W091",
        "depth": 2760.0,
        "event_type": "HIGH_TORQUE",
        "severity": "HIGH",
        "description": "Erratic surface torque fluctuations exceeding 32 kft-lbs with severe stick-slip oscillations.",
        "duration": 12.0,
        "npt_hours": 8.5,
        "formation": "Fatehgarh Lower",
        "mitigation": "Wiper trip performed to 2,650 m. Conditioned mud with 2% lubricant additive to reduce wall friction."
    },
    {
        "well_id": "OIL-W091",
        "depth": 2775.0,
        "event_type": "WELLBORE_INSTABILITY",
        "severity": "MEDIUM",
        "description": "Heavy splintery shale caving observed over shakers during drilling break.",
        "duration": 15.0,
        "npt_hours": 11.0,
        "formation": "Fatehgarh Lower",
        "mitigation": "Increased mud weight from 10.5 to 10.9 ppg to stabilize wellbore hoop stress."
    },
    # Top Analogue 3 Events (OIL-W074)
    {
        "well_id": "OIL-W074",
        "depth": 2780.0,
        "event_type": "STUCK_PIPE",
        "severity": "HIGH",
        "description": "Mechanical key-seating and differential sticking on trip-out at 2,780 m. High overpull of 90 klbs.",
        "duration": 26.0,
        "npt_hours": 22.0,
        "formation": "Fatehgarh Lower",
        "mitigation": "Pumped acid wash pill and worked pipe with maximum torque and rotary jarring."
    },
    {
        "well_id": "OIL-W074",
        "depth": 2710.0,
        "event_type": "KICK",
        "severity": "HIGH",
        "description": "Gas influx kick (18 bbl pit gain, SIDPP 320 psi) while penetrating upper sand lens.",
        "duration": 22.0,
        "npt_hours": 19.5,
        "formation": "Fatehgarh Lower",
        "mitigation": "Shut-in well with annular BOP, circulated out kick gas using Wait and Weight method with 11.1 ppg kill mud."
    },
    # Other field events
    {
        "well_id": "OIL-W065",
        "depth": 2725.0,
        "event_type": "LOST_CIRCULATION",
        "severity": "MEDIUM",
        "description": "Seepage losses of 18 bbl/hr in porous sand layer.",
        "duration": 8.0,
        "npt_hours": 4.5,
        "formation": "Fatehgarh Lower",
        "mitigation": "Added fine calcium carbonate LCM to active system."
    },
    {
        "well_id": "OIL-W078",
        "depth": 2755.0,
        "event_type": "STUCK_PIPE",
        "severity": "HIGH",
        "description": "Tight hole and differential sticking during connection break.",
        "duration": 19.0,
        "npt_hours": 15.0,
        "formation": "Fatehgarh Lower",
        "mitigation": "Jarred upward with 120 klbs; circulated high-viscosity pill."
    },
    {
        "well_id": "OIL-W083",
        "depth": 2748.0,
        "event_type": "PRESSURE_ANOMALY",
        "severity": "MEDIUM",
        "description": "Pore pressure ramp from 9.8 ppg equivalent to 10.7 ppg over a 15m depth interval.",
        "duration": 6.0,
        "npt_hours": 3.0,
        "formation": "Fatehgarh Lower",
        "mitigation": "Controlled ROP and raised mud weight to 11.0 ppg."
    },
    {
        "well_id": "OIL-W071",
        "depth": 2240.0,
        "event_type": "WELLBORE_INSTABILITY",
        "severity": "HIGH",
        "description": "Severe cavings causing pack-off and lost bottom hole assembly.",
        "duration": 48.0,
        "npt_hours": 42.0,
        "formation": "Barmer Hill Shale",
        "mitigation": "Fishing operation unsuccessful. Plugged back and sidetracked well."
    },
    {
        "well_id": "OIL-W068",
        "depth": 2980.0,
        "event_type": "FISHING",
        "severity": "HIGH",
        "description": "Twisted off drill collar connection due to high cyclic fatigue in basalt formation.",
        "duration": 36.0,
        "npt_hours": 31.0,
        "formation": "Nagana Volcanics",
        "mitigation": "Ran overshot fishing assembly and successfully recovered fish in 2 runs."
    },
    {
        "well_id": "OIL-W097",
        "depth": 2730.0,
        "event_type": "HIGH_TORQUE",
        "severity": "HIGH",
        "description": "Extreme torque spikes up to 29 kft-lbs with severe axial vibration.",
        "duration": 10.0,
        "npt_hours": 6.5,
        "formation": "Fatehgarh Lower",
        "mitigation": "Replaced PDC bit and optimized RPM/WOB parameters."
    }
]

def seed_database(db: Session):
    # Check if already seeded
    if db.query(Well).count() > 0:
        print("Database already contains wells. Skipping seed.")
        return

    print("Seeding Formations...")
    for f in FORMATIONS_DATA:
        formation = Formation(**f)
        db.add(formation)
    db.commit()

    print("Seeding Wells...")
    for spec in WELL_SPECS:
        lat = round(BASE_LAT + spec["lat_offset"], 6)
        lon = round(BASE_LON + spec["lon_offset"], 6)
        
        well = Well(
            well_id=spec["well_id"],
            latitude=lat,
            longitude=lon,
            field_name="Barmer Basin Block-A",
            formation=spec["formation"],
            lithology=spec["lithology"],
            total_depth=spec["total_depth"],
            well_type=spec["well_type"],
            spud_date=spec["spud_date"],
            completion_date="2026-09-15" if spec["status"] == "Completed" else None,
            pressure=spec["pressure"],
            temperature=spec["temperature"],
            status=spec["status"],
            trajectory_type=spec["trajectory_type"],
            target_reservoir="Fatehgarh Sandstone"
        )
        db.add(well)
    db.commit()

    print("Seeding Historical Events...")
    for ev in SPECIFIC_EVENTS:
        event = HistoricalEvent(
            well_id=ev["well_id"],
            depth=ev["depth"],
            event_type=ev["event_type"],
            severity=ev["severity"],
            description=ev["description"],
            duration=ev["duration"],
            npt_hours=ev["npt_hours"],
            formation=ev["formation"],
            mitigation=ev["mitigation"],
            timestamp=datetime(2025, 5, 12, 14, 30)
        )
        db.add(event)
    db.commit()

    print("Seeding Drilling Parameters and Depth Logs...")
    # Generate depth log profiles (every 10m from 0 to TD)
    wells = db.query(Well).all()
    for w in wells:
        max_d = 2720.0 if w.well_id == "OIL-W102" else w.total_depth
        depth_step = 25.0
        current_d = 100.0
        
        while current_d <= max_d:
            # Formation physics correlation
            in_critical = 2700.0 <= current_d <= 2800.0
            in_shale = 1950.0 <= current_d < 2650.0
            
            # Base params
            base_rop = 18.0 if not in_critical else 8.5
            base_torque = 14.0 if not in_critical else (24.0 if in_critical else 16.0)
            base_wob = 16.0 if not in_critical else 22.0
            base_rpm = 120.0 if not in_critical else 95.0
            base_mud_weight = 9.2 if current_d < 2000 else (10.2 if current_d < 2700 else 10.9)
            
            # Add realistic physics noise
            rop = max(2.0, base_rop + random.gauss(0, 1.5))
            wob = max(5.0, base_wob + random.gauss(0, 1.2))
            rpm = max(40.0, base_rpm + random.gauss(0, 5.0))
            torque = max(4.0, base_torque + (random.gauss(0, 2.5) if in_critical else random.gauss(0, 0.8)))
            mud_weight = round(base_mud_weight + random.uniform(-0.1, 0.1), 2)
            flow_rate = 650.0 + random.uniform(-30, 30)
            standpipe_pressure = round(2800.0 + (current_d * 0.45) + random.uniform(-50, 50), 1)
            hook_load = round(180.0 + (current_d * 0.04) + random.uniform(-10, 10), 1)
            
            param = DrillingParameter(
                well_id=w.well_id,
                depth=round(current_d, 1),
                rop=round(rop, 2),
                wob=round(wob, 2),
                rpm=round(rpm, 1),
                torque=round(torque, 2),
                mud_weight=mud_weight,
                flow_rate=round(flow_rate, 1),
                standpipe_pressure=standpipe_pressure,
                hook_load=hook_load,
                timestamp=datetime.utcnow() - timedelta(hours=int((max_d - current_d) * 0.5))
            )
            db.add(param)
            current_d += depth_step
            
    db.commit()

    print("Seeding Sample Documents...")
    sample_docs = [
        {
            "filename": "OIL-W087_End_Of_Well_Report_EOWR.pdf",
            "well_id": "OIL-W087",
            "document_type": "End of Well Report",
            "extracted_text": """
            WELL SUMMARY REPORT: OIL-W087 (Barmer Basin Block-A)
            Total Depth Reached: 3,420 m MD.
            Key Operational Highlights:
            - Intermediate 12-1/4" Section penetrated smoothly to 2,650 m (Barmer Hill Shale).
            - At 2,735 m (Fatehgarh Lower Sandstone), experienced sudden 42 bbl/hr mud losses into fractured permeable interval.
            - Spotted 30 bbl medium LCM pill (nut plug + mica blend) to regain 100% circulation.
            - At 2,742 m, during 30-minute static survey break, string became differentially stuck with 480 psi overbalance.
            - Maximum pull of 140 klbs failed to release. Spotted 45 bbl pipe-release oil pill and jarred downward for 4.2 hours before freeing BHA.
            - Recommendations for Future Offset Drilling: Keep drill pipe reciprocating continuously in 2,700-2,800 m zone. Maintain mud weight strictly below 10.9 ppg to prevent differential sticking.
            """,
            "file_size_kb": 245.8
        },
        {
            "filename": "OIL-W091_Daily_Drilling_Report_DDR_2760m.pdf",
            "well_id": "OIL-W091",
            "document_type": "Daily Drilling Report",
            "extracted_text": """
            DAILY DRILLING LOG - WELL OIL-W091
            Interval: 2,700 m to 2,810 m MD | Date: 2025-07-04
            Activity Summary:
            - Drilling 8-1/2" hole in Fatehgarh Lower formation.
            - At 2,760 m, observed severe stick-slip and erratic torque fluctuations peaking at 32 kft-lbs.
            - High drag observed on connections (+45 klbs over string weight).
            - Wiper trip conducted to 2,650 m casing shoe. Reamed tight spots from 2,740 m to 2,760 m.
            - Added 2% drill-glide lubricant additive to active mud pit. Torque stabilized at 21 kft-lbs.
            """,
            "file_size_kb": 182.4
        },
        {
            "filename": "OIL-W074_Incident_Investigation_Stuck_Pipe.pdf",
            "well_id": "OIL-W074",
            "document_type": "Incident Investigation",
            "extracted_text": """
            INCIDENT INVESTIGATION REPORT: High-Severity Stuck Pipe & Gas Influx in Well OIL-W074
            Location: Barmer Basin Offset Well #74
            Depth of Occurrence: 2,780 m MD
            Total NPT: 22.0 Hours | Financial Impact: Moderate
            Root Cause Analysis:
            1. High differential pressure between 11.2 ppg mud column and depleted upper Fatehgarh sand lens.
            2. High dogleg severity (4.2 deg/30m) coupled with thick permeable filter cake.
            3. Mud conditioning was delayed after penetrating 2,700 m formation boundary.
            Key Corrective Actions & Lesson Learned:
            - Offset wells entering 2,700–2,800 m interval must utilize proactive mud conditioning.
            - Mandatory wiper trips recommended every 50 meters in Fatehgarh Lower.
            """,
            "file_size_kb": 312.0
        },
        {
            "filename": "Barmer_Basin_Fatehgarh_Geomechanical_Study.pdf",
            "well_id": None,
            "document_type": "Geomechanical Study",
            "extracted_text": """
            REGIONAL GEOMECHANICAL MODEL & DRILLING HAZARDS: BARMER BASIN
            Formations Analyzed: Barmer Hill Shale, Fatehgarh Upper & Lower, Nagana Basalt.
            Critical Depth Interval: 2,700 m – 2,800 m MD.
            Pore Pressure & Fracture Gradient:
            - Pore pressure in Fatehgarh Lower increases sharply from 0.52 psi/ft (10.0 ppg equiv) to 0.56 psi/ft (10.8 ppg equiv).
            - Fracture gradient is narrow (0.64 psi/ft / 12.3 ppg equiv), leaving a narrow drilling margin of ~1.2 ppg.
            - Key drilling hazards identified across 18 regional offset wells: Differential Sticking (68% frequency), Lost Circulation (54% frequency), Gas Kicks (24% frequency).
            """,
            "file_size_kb": 514.2
        },
        {
            "filename": "OIL-W102_Well_Drilling_Program_Approved.pdf",
            "well_id": "OIL-W102",
            "document_type": "Well Program",
            "extracted_text": """
            APPROVED DRILLING PROGRAM: WELL OIL-W102 (Target TD: 3,450 m)
            Operator: Oil & Gas Operations Co.
            Target Reservoir: Fatehgarh Sandstone (2,700m - 2,850m MD)
            Well Profile: S-Type Deviated, Kick-off Depth 950 m, Maximum Inclination 28.5 deg.
            Critical Watch Interval: 2,700 m to 2,800 m.
            Standard operating guideline: Review offset analogue records (OIL-W087, OIL-W091, OIL-W074) before drilling through 2,700 m depth marker.
            """,
            "file_size_kb": 410.5
        }
    ]

    for d in sample_docs:
        doc = Document(
            filename=d["filename"],
            well_id=d["well_id"],
            document_type=d["document_type"],
            upload_date=datetime.utcnow() - timedelta(days=random.randint(5, 45)),
            extraction_status="COMPLETED",
            indexed_status="INDEXED",
            extracted_text=d["extracted_text"].strip(),
            file_size_kb=d["file_size_kb"]
        )
        db.add(doc)
    db.commit()

    print("Database seeding completed successfully with 30+ wells, formations, realistic logs, events, and documents!")
