from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from contextlib import asynccontextmanager

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.utils.synthetic_data import seed_database
from app.ml.train_models import train_and_save_models
from app.ml.predict import load_models
from app.routers import (
    wells_router,
    risk_router,
    events_router,
    assistant_router,
    documents_router,
    simulation_router
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Initialize DB tables
    print("[eRTMAC-NWIS] Initializing database schema...")
    Base.metadata.create_all(bind=engine)
    
    # 2. Seed database
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

    # 3. Train ML models if missing, then load
    model_file = settings.DATABASE_URL
    from app.config import MODELS_DIR
    if not (MODELS_DIR / "stuck_pipe_model.joblib").exists():
        print("[eRTMAC-NWIS] Training initial ML risk models on synthetic drilling physics...")
        train_and_save_models()
    
    load_models()
    print("[eRTMAC-NWIS] System ready: Decision-Support API online.")
    yield

app = FastAPI(
    title="eRTMAC-NWIS — Nearby Wells Intelligence System API",
    description="Full-stack AI Decision-Support Platform for Oil & Gas Drilling Operations. Learn from every well before drilling the next one.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(wells_router, prefix=settings.API_V1_STR)
app.include_router(risk_router, prefix=settings.API_V1_STR)
app.include_router(events_router, prefix=settings.API_V1_STR)
app.include_router(assistant_router, prefix=settings.API_V1_STR)
app.include_router(documents_router, prefix=settings.API_V1_STR)
app.include_router(simulation_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "system": "eRTMAC-NWIS",
        "title": "Nearby Wells Intelligence System",
        "tagline": "Learn from every well before drilling the next one.",
        "status": "ONLINE",
        "active_well": "OIL-W102",
        "docs_url": "/docs",
        "api_v1": "/api"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "ml_models": "loaded",
        "version": settings.VERSION
    }

@app.get("/api/system/stats")
def get_system_stats():
    from app.models.entities import Well, HistoricalEvent, Document, DrillingParameter
    db = SessionLocal()
    try:
        wells_count = db.query(Well).count()
        events_count = db.query(HistoricalEvent).count()
        docs_count = db.query(Document).count()
        telemetry_points = db.query(DrillingParameter).count()
        return {
            "total_wells": wells_count,
            "total_historical_events": events_count,
            "indexed_documents": docs_count,
            "telemetry_points_indexed": telemetry_points,
            "active_basin": "Barmer Basin Block-A",
            "active_well_id": "OIL-W102",
            "ml_risk_models": ["Stuck Pipe RF", "Lost Circulation RF", "Kick Influx RF", "High Torque RF", "NPT Gradient Booster"]
        }
    finally:
        db.close()
