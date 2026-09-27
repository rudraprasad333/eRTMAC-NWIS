import os
from pathlib import Path
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
MODELS_DIR = BASE_DIR / "models"
UPLOADS_DIR = DATA_DIR / "sample_documents"

DATA_DIR.mkdir(parents=True, exist_ok=True)
MODELS_DIR.mkdir(parents=True, exist_ok=True)
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

class Settings(BaseSettings):
    PROJECT_NAME: str = "eRTMAC-NWIS — Nearby Wells Intelligence System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{DATA_DIR / 'nwis_wells.db'}")
    CORS_ORIGINS: list[str] = ["*"]
    
    # ML & Similarity Configuration
    DEFAULT_ACTIVE_WELL_ID: str = "OIL-W102"
    SIMILARITY_WEIGHTS: dict = {
        "geological": 0.35,
        "spatial": 0.25,
        "depth": 0.15,
        "formation": 0.10,
        "drilling_design": 0.10,
        "historical_performance": 0.05
    }
    
    class Config:
        case_sensitive = True

settings = Settings()
