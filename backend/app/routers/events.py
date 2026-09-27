from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.entities import HistoricalEvent
from app.schemas.schemas import EventOut

router = APIRouter(prefix="/events", tags=["Historical Events"])

@router.get("", response_model=List[EventOut])
def get_all_events(
    event_type: Optional[str] = None,
    formation: Optional[str] = None,
    min_depth: Optional[float] = None,
    max_depth: Optional[float] = None,
    severity: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(HistoricalEvent)
    if event_type:
        query = query.filter(HistoricalEvent.event_type.ilike(f"%{event_type}%"))
    if formation:
        query = query.filter(HistoricalEvent.formation.ilike(f"%{formation}%"))
    if min_depth is not None:
        query = query.filter(HistoricalEvent.depth >= min_depth)
    if max_depth is not None:
        query = query.filter(HistoricalEvent.depth <= max_depth)
    if severity:
        query = query.filter(HistoricalEvent.severity == severity.upper())

    return query.order_by(HistoricalEvent.depth.asc()).all()

@router.get("/well/{well_id}", response_model=List[EventOut])
def get_events_for_well(well_id: str, db: Session = Depends(get_db)):
    return db.query(HistoricalEvent).filter(HistoricalEvent.well_id == well_id).order_by(HistoricalEvent.depth.asc()).all()
