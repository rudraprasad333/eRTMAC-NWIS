from app.routers.wells import router as wells_router
from app.routers.risk import router as risk_router
from app.routers.events import router as events_router
from app.routers.assistant import router as assistant_router
from app.routers.documents import router as documents_router
from app.routers.simulation import router as simulation_router

__all__ = [
    "wells_router",
    "risk_router",
    "events_router",
    "assistant_router",
    "documents_router",
    "simulation_router"
]
