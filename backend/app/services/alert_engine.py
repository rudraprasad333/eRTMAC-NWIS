from typing import List, Dict, Any
from datetime import datetime
from app.schemas.schemas import AlertItem

def generate_proactive_alerts(
    current_depth: float = 2715.0,
    torque: float = 24.8,
    rop: float = 14.2,
    mud_weight: float = 10.8,
    well_id: str = "OIL-W102"
) -> List[AlertItem]:
    alerts = []
    
    # 1. Critical Interval Proximity Alert
    if 2680.0 <= current_depth <= 2820.0:
        dist_to_critical = 0 if (2700.0 <= current_depth <= 2800.0) else (2700.0 - current_depth)
        alerts.append(AlertItem(
            id="ALT-CRIT-001",
            well_id=well_id,
            depth=current_depth,
            severity="CRITICAL",
            title="Historical Risk Zone Active (2,700–2,800 m)",
            message=f"Well {well_id} is operating within the historically challenging Fatehgarh Lower interval (current depth: {current_depth} m). 4 high-similarity offset wells experienced severe stuck pipe and loss incidents in this exact window.",
            risk_zone="2,700 m – 2,800 m (Fatehgarh Lower)",
            similar_wells_count=4,
            timestamp=datetime.utcnow().strftime("%H:%M:%S UTC"),
            acknowledged=False,
            action_suggestion="Review offset analogue mud weights (OIL-W087, OIL-W074). Restrict stationary drill string time to under 5 minutes during surveys."
        ))

    # 2. Torque / Friction Anomaly Alert
    if torque > 22.0:
        alerts.append(AlertItem(
            id="ALT-WARN-002",
            well_id=well_id,
            depth=current_depth,
            severity="HIGH" if torque > 26.0 else "WARNING",
            title="Elevated Torque & Drag Anomaly",
            message=f"Surface rotary torque ({torque} kft-lbs) is 38% above baseline for this depth. Analogue OIL-W091 exhibited identical torque spikes prior to severe stick-slip and pack-off.",
            risk_zone="2,740 m – 2,770 m",
            similar_wells_count=3,
            timestamp=datetime.utcnow().strftime("%H:%M:%S UTC"),
            acknowledged=False,
            action_suggestion="Perform wiper trip to casing shoe (2,650m) if torque spikes exceed 28 kft-lbs. Consider adding 2% drill-glide lubricity agent."
        ))

    # 3. ROP Drop / Formation Tightening Alert
    if rop < 10.0 and current_depth >= 2700.0:
        alerts.append(AlertItem(
            id="ALT-WARN-003",
            well_id=well_id,
            depth=current_depth,
            severity="WARNING",
            title="ROP Retardation / Tight Hole Indicator",
            message=f"Rate of penetration ({rop} m/hr) has decelerated significantly. Offset well OIL-W074 observed similar ROP degradation before differential sticking.",
            risk_zone="2,700 m – 2,780 m",
            similar_wells_count=2,
            timestamp=datetime.utcnow().strftime("%H:%M:%S UTC"),
            acknowledged=False,
            action_suggestion="Check shaker returns for splintery shale cavings. Circulate high-viscosity pill to ensure adequate hole cleaning."
        ))

    # 4. General Advisory Info
    alerts.append(AlertItem(
        id="ALT-INFO-004",
        well_id=well_id,
        depth=current_depth,
        severity="INFO",
        title="Offset Analogue Correlation Loaded",
        message="30 regional offset wells analyzed. Top analogues identified: OIL-W087 (94%), OIL-W091 (91%), OIL-W074 (88%).",
        risk_zone="Full Well Section",
        similar_wells_count=12,
        timestamp=datetime.utcnow().strftime("%H:%M:%S UTC"),
        acknowledged=True,
        action_suggestion="Continuous real-time correlation active. Decision support recommendations synchronized."
    ))

    return alerts
