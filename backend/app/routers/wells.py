from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.entities import Well, DrillingParameter, Formation
from app.schemas.schemas import WellOut, NearbyWellOut, SimilarWellOut, DrillingParamOut, FormationOut
from app.services.similarity import haversine_distance_km, calculate_bearing_deg, get_similar_wells

router = APIRouter(prefix="/wells", tags=["Wells"])

@router.get("", response_model=List[WellOut])
def get_all_wells(
    status: Optional[str] = None,
    formation: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Well)
    if status:
        query = query.filter(Well.status == status)
    if formation:
        query = query.filter(Well.formation.ilike(f"%{formation}%"))
    return query.all()

@router.get("/formations", response_model=List[FormationOut])
def get_formations(db: Session = Depends(get_db)):
    return db.query(Formation).order_by(Formation.top_depth.asc()).all()

@router.get("/{well_id}", response_model=WellOut)
def get_well_by_id(well_id: str, db: Session = Depends(get_db)):
    well = db.query(Well).filter(Well.well_id == well_id).first()
    if not well:
        raise HTTPException(status_code=404, detail=f"Well {well_id} not found")
    return well

@router.get("/{well_id}/nearby", response_model=List[NearbyWellOut])
def get_nearby_wells(
    well_id: str,
    radius_km: float = Query(25.0, description="Search radius in kilometers"),
    db: Session = Depends(get_db)
):
    target = db.query(Well).filter(Well.well_id == well_id).first()
    if not target:
        raise HTTPException(status_code=404, detail=f"Target well {well_id} not found")

    all_wells = db.query(Well).filter(Well.well_id != well_id).all()
    nearby_list = []

    for w in all_wells:
        dist = haversine_distance_km(target.latitude, target.longitude, w.latitude, w.longitude)
        if dist <= radius_km:
            bearing = calculate_bearing_deg(target.latitude, target.longitude, w.latitude, w.longitude)
            event_count = len(w.events)
            risk_level = "CRITICAL" if event_count >= 2 else ("MEDIUM" if event_count == 1 else "LOW")
            
            nearby_list.append(NearbyWellOut(
                id=w.id,
                well_id=w.well_id,
                latitude=w.latitude,
                longitude=w.longitude,
                field_name=w.field_name,
                formation=w.formation,
                lithology=w.lithology,
                total_depth=w.total_depth,
                well_type=w.well_type,
                spud_date=w.spud_date,
                completion_date=w.completion_date,
                pressure=w.pressure,
                temperature=w.temperature,
                status=w.status,
                trajectory_type=w.trajectory_type,
                target_reservoir=w.target_reservoir,
                distance_km=dist,
                bearing_deg=bearing,
                risk_level=risk_level,
                event_count=event_count
            ))

    nearby_list.sort(key=lambda x: x.distance_km)
    return nearby_list

@router.get("/{well_id}/similar", response_model=List[SimilarWellOut])
def get_offset_similar_wells(
    well_id: str,
    limit: int = Query(10, description="Max similar wells to return"),
    w_geo: float = Query(0.35, description="Geological weight"),
    w_spat: float = Query(0.25, description="Spatial weight"),
    w_dep: float = Query(0.15, description="Depth weight"),
    w_form: float = Query(0.10, description="Formation weight"),
    w_des: float = Query(0.10, description="Drilling design weight"),
    w_hist: float = Query(0.05, description="Historical performance weight"),
    db: Session = Depends(get_db)
):
    weights = {
        "geological": w_geo,
        "spatial": w_spat,
        "depth": w_dep,
        "formation": w_form,
        "drilling_design": w_des,
        "historical_performance": w_hist
    }
    similar_wells = get_similar_wells(well_id, db, limit=limit, weights=weights)
    return similar_wells

@router.get("/{well_id}/drilling-data", response_model=List[DrillingParamOut])
def get_well_drilling_data(
    well_id: str,
    start_depth: Optional[float] = None,
    end_depth: Optional[float] = None,
    db: Session = Depends(get_db)
):
    query = db.query(DrillingParameter).filter(DrillingParameter.well_id == well_id)
    if start_depth is not None:
        query = query.filter(DrillingParameter.depth >= start_depth)
    if end_depth is not None:
        query = query.filter(DrillingParameter.depth <= end_depth)
    
    return query.order_by(DrillingParameter.depth.asc()).all()
