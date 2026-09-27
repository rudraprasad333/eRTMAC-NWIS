from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database import get_db
from app.models.entities import Well
from app.schemas.schemas import RiskPredictRequest, RiskPredictionResponse, DepthRiskItem, ExplainabilityResponse, RiskItem
from app.ml.predict import predict_drilling_risks, get_depth_risk_profile, get_explanation_for_risk

router = APIRouter(prefix="/risk", tags=["Risk Intelligence"])

@router.get("/{well_id}", response_model=RiskPredictionResponse)
def get_well_risk_status(well_id: str, db: Session = Depends(get_db)):
    well = db.query(Well).filter(Well.well_id == well_id).first()
    if not well:
        raise HTTPException(status_code=404, detail=f"Well {well_id} not found")

    depth = 2715.0 if well_id == "OIL-W102" else (well.total_depth * 0.8)
    preds = predict_drilling_risks(
        depth=depth,
        formation=well.formation,
        rop=14.2,
        wob=18.5,
        rpm=110.0,
        torque=24.8,
        mud_weight=10.8,
        pressure=well.pressure or 3450.0
    )

    return RiskPredictionResponse(
        well_id=well_id,
        depth=depth,
        formation=well.formation,
        stuck_pipe=RiskItem(**preds["stuck_pipe"]),
        lost_circulation=RiskItem(**preds["lost_circulation"]),
        kick=RiskItem(**preds["kick"]),
        high_torque=RiskItem(**preds["high_torque"]),
        npt=RiskItem(**preds["npt"])
    )

@router.post("/predict", response_model=RiskPredictionResponse)
def predict_custom_risk(payload: RiskPredictRequest):
    preds = predict_drilling_risks(
        depth=payload.current_depth,
        formation=payload.formation or "Fatehgarh Lower",
        rop=payload.rop or 14.2,
        wob=payload.wob or 18.5,
        rpm=payload.rpm or 110.0,
        torque=payload.torque or 24.8,
        mud_weight=payload.mud_weight or 10.8,
        pressure=payload.pressure or 3450.0
    )

    return RiskPredictionResponse(
        well_id=payload.well_id,
        depth=payload.current_depth,
        formation=payload.formation or "Fatehgarh Lower",
        stuck_pipe=RiskItem(**preds["stuck_pipe"]),
        lost_circulation=RiskItem(**preds["lost_circulation"]),
        kick=RiskItem(**preds["kick"]),
        high_torque=RiskItem(**preds["high_torque"]),
        npt=RiskItem(**preds["npt"])
    )

@router.get("/{well_id}/depth-profile", response_model=List[DepthRiskItem])
def get_depth_risk_curve(well_id: str):
    profile = get_depth_risk_profile(well_id)
    return profile

@router.get("/{well_id}/explanation", response_model=ExplainabilityResponse)
def get_risk_explanation(well_id: str, depth: float = 2715.0):
    return get_explanation_for_risk(well_id, depth)
