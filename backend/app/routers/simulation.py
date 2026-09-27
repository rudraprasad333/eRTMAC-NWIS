from fastapi import APIRouter, Query
from typing import List, Dict, Any
import math
import random
from app.schemas.schemas import SimulationState, AlertItem
from app.services.alert_engine import generate_proactive_alerts

router = APIRouter(prefix="/simulation", tags=["Live Drilling & Simulation"])

# In-memory simulation state
_sim_state = {
    "is_running": False,
    "speed": 1.0,
    "current_depth": 2715.0,
    "current_formation": "Fatehgarh Lower (Glauconitic Sandstone)",
    "rop": 14.2,
    "wob": 18.5,
    "rpm": 110.0,
    "torque": 24.8,
    "mud_weight": 10.8,
    "standpipe_pressure": 3450.0,
    "acknowledged_alerts": set()
}

@router.get("/state", response_model=SimulationState)
def get_simulation_state():
    in_crit = 2700.0 <= _sim_state["current_depth"] <= 2800.0
    all_alerts = generate_proactive_alerts(
        current_depth=_sim_state["current_depth"],
        torque=_sim_state["torque"],
        rop=_sim_state["rop"],
        mud_weight=_sim_state["mud_weight"],
        well_id="OIL-W102"
    )
    
    for a in all_alerts:
        if a.id in _sim_state["acknowledged_alerts"]:
            a.acknowledged = True

    return SimulationState(
        is_running=_sim_state["is_running"],
        speed=_sim_state["speed"],
        current_depth=round(_sim_state["current_depth"], 1),
        current_formation=_sim_state["current_formation"],
        rop=round(_sim_state["rop"], 1),
        wob=round(_sim_state["wob"], 1),
        rpm=round(_sim_state["rpm"], 0),
        torque=round(_sim_state["torque"], 1),
        mud_weight=round(_sim_state["mud_weight"], 2),
        standpipe_pressure=round(_sim_state["standpipe_pressure"], 1),
        active_alerts=all_alerts,
        in_critical_zone=in_crit
    )

@router.post("/toggle")
def toggle_simulation(running: bool = Query(...)):
    _sim_state["is_running"] = running
    return {"is_running": _sim_state["is_running"]}

@router.post("/step")
def step_simulation(delta_m: float = Query(2.5)):
    _sim_state["current_depth"] += delta_m
    d = _sim_state["current_depth"]
    
    in_crit = 2700.0 <= d <= 2800.0
    
    # Dynamic parameter changes
    if in_crit:
        _sim_state["current_formation"] = "Fatehgarh Lower (Glauconitic Sandstone & Shale)"
        _sim_state["torque"] = round(22.0 + 8.0 * math.sin(d * 0.1) + random.uniform(-1, 1), 1)
        _sim_state["rop"] = round(8.0 + 4.0 * math.cos(d * 0.08) + random.uniform(-0.5, 0.5), 1)
        _sim_state["wob"] = round(21.0 + random.uniform(-1, 1), 1)
        _sim_state["rpm"] = round(95.0 + random.uniform(-3, 3), 0)
    else:
        _sim_state["current_formation"] = "Fatehgarh Upper / Surrounding Strata"
        _sim_state["torque"] = round(14.0 + random.uniform(-1, 1), 1)
        _sim_state["rop"] = round(18.0 + random.uniform(-1.5, 1.5), 1)
        _sim_state["wob"] = round(16.0 + random.uniform(-1, 1), 1)
        _sim_state["rpm"] = round(120.0 + random.uniform(-2, 2), 0)

    _sim_state["standpipe_pressure"] = round(2800.0 + (d * 0.45) + random.uniform(-20, 20), 1)

    return get_simulation_state()

@router.post("/reset")
def reset_simulation(target_depth: float = Query(2715.0)):
    _sim_state["current_depth"] = target_depth
    _sim_state["is_running"] = False
    _sim_state["rop"] = 14.2
    _sim_state["wob"] = 18.5
    _sim_state["rpm"] = 110.0
    _sim_state["torque"] = 24.8
    _sim_state["mud_weight"] = 10.8
    _sim_state["standpipe_pressure"] = 3450.0
    _sim_state["acknowledged_alerts"].clear()
    return get_simulation_state()

@router.get("/alerts", response_model=List[AlertItem])
def get_current_alerts(well_id: str = "OIL-W102"):
    alerts = generate_proactive_alerts(
        current_depth=_sim_state["current_depth"],
        torque=_sim_state["torque"],
        rop=_sim_state["rop"],
        mud_weight=_sim_state["mud_weight"],
        well_id=well_id
    )
    for a in alerts:
        if a.id in _sim_state["acknowledged_alerts"]:
            a.acknowledged = True
    return alerts

@router.post("/alerts/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: str):
    _sim_state["acknowledged_alerts"].add(alert_id)
    return {"status": "acknowledged", "alert_id": alert_id}
