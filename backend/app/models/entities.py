from sqlalchemy import Column, Integer, Float, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Well(Base):
    __tablename__ = "wells"

    id = Column(Integer, primary_key=True, index=True)
    well_id = Column(String(50), unique=True, index=True, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    field_name = Column(String(100), default="Barmer Basin Block-A")
    formation = Column(String(100), nullable=False)
    lithology = Column(String(100), nullable=False)
    total_depth = Column(Float, nullable=False)
    well_type = Column(String(50), default="Deviated") # Vertical, Deviated, Horizontal
    spud_date = Column(String(50), nullable=True)
    completion_date = Column(String(50), nullable=True)
    pressure = Column(Float, nullable=True) # psi
    temperature = Column(Float, nullable=True) # deg C
    status = Column(String(50), default="Completed") # Drilling, Completed, Suspended, Planned
    trajectory_type = Column(String(50), default="S-Type")
    target_reservoir = Column(String(100), default="Fatehgarh Sandstone")

    # Relationships
    drilling_parameters = relationship("DrillingParameter", back_populates="well", cascade="all, delete-orphan")
    events = relationship("HistoricalEvent", back_populates="well", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="well", cascade="all, delete-orphan")
    predictions = relationship("RiskPrediction", back_populates="well", cascade="all, delete-orphan")


class DrillingParameter(Base):
    __tablename__ = "drilling_parameters"

    id = Column(Integer, primary_key=True, index=True)
    well_id = Column(String(50), ForeignKey("wells.well_id"), nullable=False, index=True)
    depth = Column(Float, nullable=False, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    rop = Column(Float, nullable=False) # Rate of Penetration (m/hr)
    wob = Column(Float, nullable=False) # Weight on Bit (klbs)
    rpm = Column(Float, nullable=False) # Revolutions per minute
    torque = Column(Float, nullable=False) # kft-lbs
    mud_weight = Column(Float, nullable=False) # ppg (pounds per gallon)
    flow_rate = Column(Float, nullable=False) # gpm
    standpipe_pressure = Column(Float, nullable=False) # psi
    hook_load = Column(Float, nullable=False) # klbs

    well = relationship("Well", back_populates="drilling_parameters")


class HistoricalEvent(Base):
    __tablename__ = "historical_events"

    id = Column(Integer, primary_key=True, index=True)
    well_id = Column(String(50), ForeignKey("wells.well_id"), nullable=False, index=True)
    depth = Column(Float, nullable=False, index=True)
    event_type = Column(String(100), nullable=False, index=True) # STUCK_PIPE, LOST_CIRCULATION, KICK, HIGH_TORQUE, WELLBORE_INSTABILITY, FISHING, NPT, CEMENTING_ISSUE, PRESSURE_ANOMALY
    severity = Column(String(50), nullable=False) # LOW, MEDIUM, HIGH, CRITICAL
    description = Column(Text, nullable=False)
    duration = Column(Float, default=0.0) # hours
    npt_hours = Column(Float, default=0.0) # Non-Productive Time hours
    formation = Column(String(100), nullable=False)
    mitigation = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    well = relationship("Well", back_populates="events")


class Formation(Base):
    __tablename__ = "formations"

    id = Column(Integer, primary_key=True, index=True)
    formation_name = Column(String(100), unique=True, index=True, nullable=False)
    top_depth = Column(Float, nullable=False)
    bottom_depth = Column(Float, nullable=False)
    lithology = Column(String(100), nullable=False)
    pressure_regime = Column(String(50), default="Normal") # Normal, Overpressured, Depleted
    risk_characteristics = Column(Text, nullable=True)
    color_code = Column(String(20), default="#2F80ED")


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    well_id = Column(String(50), ForeignKey("wells.well_id"), nullable=True, index=True)
    document_type = Column(String(100), default="Daily Drilling Report") # DDR, EOWR, Mud Log, Incident Report
    upload_date = Column(DateTime, default=datetime.utcnow)
    extraction_status = Column(String(50), default="COMPLETED") # PENDING, PROCESSING, COMPLETED, FAILED
    indexed_status = Column(String(50), default="INDEXED")
    extracted_text = Column(Text, nullable=True)
    extracted_events = Column(Text, nullable=True) # JSON string of detected events
    file_size_kb = Column(Float, default=124.5)

    well = relationship("Well", back_populates="documents")


class RiskPrediction(Base):
    __tablename__ = "risk_predictions"

    id = Column(Integer, primary_key=True, index=True)
    well_id = Column(String(50), ForeignKey("wells.well_id"), nullable=False, index=True)
    depth = Column(Float, nullable=False, index=True)
    risk_type = Column(String(100), nullable=False) # STUCK_PIPE, LOST_CIRCULATION, KICK, HIGH_TORQUE, NPT
    probability = Column(Float, nullable=False) # 0.0 to 1.0
    confidence = Column(Float, nullable=False) # 0.0 to 1.0
    severity = Column(String(50), nullable=False) # LOW, MEDIUM, HIGH, CRITICAL
    explanation = Column(Text, nullable=True) # JSON list or detailed text
    created_at = Column(DateTime, default=datetime.utcnow)

    well = relationship("Well", back_populates="predictions")
