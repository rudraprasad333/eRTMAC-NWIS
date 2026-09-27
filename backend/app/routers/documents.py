from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.entities import Document
from app.schemas.schemas import DocumentOut
from app.services.document_service import process_and_save_document

router = APIRouter(prefix="/documents", tags=["Document Intelligence"])

@router.get("", response_model=List[DocumentOut])
def get_all_documents(
    well_id: Optional[str] = None,
    document_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Document)
    if well_id:
        query = query.filter(Document.well_id == well_id)
    if document_type:
        query = query.filter(Document.document_type.ilike(f"%{document_type}%"))
    return query.order_by(Document.upload_date.desc()).all()

@router.post("/upload", response_model=DocumentOut)
async def upload_document(
    file: UploadFile = File(...),
    well_id: Optional[str] = Form(None),
    document_type: Optional[str] = Form("Daily Drilling Report"),
    db: Session = Depends(get_db)
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    file_bytes = await file.read()
    doc = process_and_save_document(
        filename=file.filename,
        file_bytes=file_bytes,
        well_id=well_id,
        document_type=document_type,
        db=db
    )
    return doc
