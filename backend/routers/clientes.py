from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Cliente
from verify_token import verify_token

router = APIRouter()

class ClienteBase(BaseModel):
    id: str
    nombre: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/clientes")
def get_clientes(db: Session = Depends(get_db), username: str = Depends(verify_token)):
    return db.query(Cliente).all()

@router.post("/clientes")
def create_cliente(cliente: ClienteBase, db: Session = Depends(get_db), username: str = Depends(verify_token)):
    nuevo = Cliente(**cliente.dict())
    db.add(nuevo)
    db.commit()
    return {"msg": "Cliente creado"}