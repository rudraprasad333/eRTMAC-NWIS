from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import AssistantQueryRequest, AssistantQueryResponse
from app.rag.knowledge_assistant import query_knowledge_assistant

router = APIRouter(prefix="/assistant", tags=["Knowledge Assistant"])

@router.post("/query", response_model=AssistantQueryResponse)
def ask_knowledge_assistant(payload: AssistantQueryRequest, db: Session = Depends(get_db)):
    return query_knowledge_assistant(
        question=payload.question,
        well_id=payload.well_id,
        current_depth=payload.current_depth or 2715.0,
        db=db
    )
