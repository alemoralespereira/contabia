from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Tarea
from verify_token import verify_token

router = APIRouter()

class TareaBase(BaseModel):
    id: int
    titulo: str
    estado: str
    clienteId: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/tareas")
def get_tareas(db: Session = Depends(get_db), username: str = Depends(verify_token)):
    return db.query(Tarea).all()

@router.post("/tareas")
def create_tarea(tarea: TareaBase, db: Session = Depends(get_db), username: str = Depends(verify_token)):
    nueva = Tarea(**tarea.dict())
    db.add(nueva)
    db.commit()
    return {"msg": "Tarea creada"}