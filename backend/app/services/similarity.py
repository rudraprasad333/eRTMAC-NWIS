import math
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.entities import Well, HistoricalEvent, Formation

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great-circle distance between two points on the Earth in kilometers."""
    R = 6371.0 # Earth's radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2.0) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(R * c, 3)

def calculate_bearing_deg(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate compass bearing between two points in degrees."""
    dlon = math.radians(lon2 - lon1)
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    y = math.sin(dlon) * math.cos(lat2_rad)
    x = (math.cos(lat1_rad) * math.sin(lat2_rad) -
         math.sin(lat1_rad) * math.cos(lat2_rad) * math.cos(dlon))
    bearing = (math.degrees(math.atan2(y, x)) + 360.0) % 360.0
    return round(bearing, 1)

def compute_similarity(
    target_well: Well,
    offset_well: Well,
    db: Session,
    weights: Optional[Dict[str, float]] = None
) -> Dict[str, Any]:
    """
    Computes a multidimensional prototype similarity score between target well and an offset well.
    """
    if weights is None:
        weights = {
            "geological": 0.35,
            "spatial": 0.25,
            "depth": 0.15,
            "formation": 0.10,
            "drilling_design": 0.10,
            "historical_performance": 0.05
        }

    # Normalize weights just in case
    total_w = sum(weights.values()) or 1.0
    w_geo = weights.get("geological", 0.35) / total_w
    w_spat = weights.get("spatial", 0.25) / total_w
    w_dep = weights.get("depth", 0.15) / total_w
    w_form = weights.get("formation", 0.10) / total_w
    w_des = weights.get("drilling_design", 0.10) / total_w
    w_hist = weights.get("historical_performance", 0.05) / total_w

    # 1. Spatial Proximity Score (decay with distance; 0km = 1.0, 20km = ~0.2)
    dist_km = haversine_distance_km(target_well.latitude, target_well.longitude, offset_well.latitude, offset_well.longitude)
    spatial_sim = max(0.05, math.exp(-0.12 * dist_km))

    # 2. Formation Similarity
    formation_match = 1.0 if target_well.formation == offset_well.formation else (
        0.75 if "Fatehgarh" in target_well.formation and "Fatehgarh" in offset_well.formation else 0.40
    )

    # 3. Geological & Lithological Similarity
    lithology_match = 0.95 if target_well.lithology == offset_well.lithology else (
        0.80 if "Sandstone" in target_well.lithology and "Sandstone" in offset_well.lithology else 0.45
    )
    geological_sim = round(0.6 * lithology_match + 0.4 * formation_match, 3)

    # 4. Total Depth Similarity (relative difference)
    td_diff = abs(target_well.total_depth - offset_well.total_depth)
    depth_sim = max(0.1, 1.0 - (td_diff / max(target_well.total_depth, 3000.0)))

    # 5. Drilling Design Similarity (well type, trajectory, pressure profile)
    type_match = 1.0 if target_well.well_type == offset_well.well_type else 0.6
    traj_match = 1.0 if target_well.trajectory_type == offset_well.trajectory_type else 0.7
    pressure_diff = abs((target_well.pressure or 3450) - (offset_well.pressure or 3450))
    press_sim = max(0.2, 1.0 - (pressure_diff / 1000.0))
    design_sim = round(0.4 * type_match + 0.3 * traj_match + 0.3 * press_sim, 3)

    # 6. Historical Performance / Event Relevance
    events = db.query(HistoricalEvent).filter(HistoricalEvent.well_id == offset_well.well_id).all()
    event_count = len(events)
    # High event count indicates strong analog value for risk prediction
    hist_sim = min(1.0, 0.5 + (event_count * 0.15))

    # Calculate overall composite score
    overall_score = (
        (geological_sim * w_geo) +
        (spatial_sim * w_spat) +
        (depth_sim * w_dep) +
        (formation_match * w_form) +
        (design_sim * w_des) +
        (hist_sim * w_hist)
    )

    # Key risks from events
    key_risks = list(set([e.event_type.replace("_", " ").title() for e in events]))

    # Operational similarity aggregate
    operational_sim = round(0.5 * design_sim + 0.5 * hist_sim, 3)

    return {
        "well_id": offset_well.well_id,
        "distance_km": dist_km,
        "bearing_deg": calculate_bearing_deg(target_well.latitude, target_well.longitude, offset_well.latitude, offset_well.longitude),
        "geological_similarity": round(geological_sim, 3),
        "spatial_similarity": round(spatial_sim, 3),
        "depth_similarity": round(depth_sim, 3),
        "formation_similarity": round(formation_match, 3),
        "drilling_design_similarity": round(design_sim, 3),
        "historical_performance": round(hist_sim, 3),
        "operational_similarity": operational_sim,
        "overall_similarity": round(overall_score, 3),
        "key_risks": key_risks if key_risks else ["Nominal Operations"],
        "major_events_count": event_count
    }

def get_similar_wells(
    target_well_id: str,
    db: Session,
    limit: int = 10,
    weights: Optional[Dict[str, float]] = None
) -> List[Dict[str, Any]]:
    target = db.query(Well).filter(Well.well_id == target_well_id).first()
    if not target:
        return []

    all_offsets = db.query(Well).filter(Well.well_id != target_well_id).all()
    results = []

    for offset in all_offsets:
        sim_data = compute_similarity(target, offset, db, weights)
        # Merge model fields
        well_dict = {
            "id": offset.id,
            "well_id": offset.well_id,
            "latitude": offset.latitude,
            "longitude": offset.longitude,
            "field_name": offset.field_name,
            "formation": offset.formation,
            "lithology": offset.lithology,
            "total_depth": offset.total_depth,
            "well_type": offset.well_type,
            "spud_date": offset.spud_date,
            "completion_date": offset.completion_date,
            "pressure": offset.pressure,
            "temperature": offset.temperature,
            "status": offset.status,
            "trajectory_type": offset.trajectory_type,
            "target_reservoir": offset.target_reservoir,
            **sim_data
        }
        results.append(well_dict)

    # Sort descending by overall similarity
    results.sort(key=lambda x: x["overall_similarity"], reverse=True)
    return results[:limit]
