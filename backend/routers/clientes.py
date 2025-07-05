from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Cliente, Tarea, User
from auth import get_current_user

router = APIRouter()


# ────────────────────────────────────────────────────────────
#  Esquemas Pydantic
# ────────────────────────────────────────────────────────────
class ClienteBase(BaseModel):
    nombre: str


class ClienteCreate(ClienteBase):
    pass


class ClienteUpdate(BaseModel):
    nombre: Optional[str] = None


class ClienteOut(BaseModel):
    id: int
    nombre: str

    class Config:
        orm_mode = True


# ────────────────────────────────────────────────────────────
#  Utilidad DB local
# ────────────────────────────────────────────────────────────
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ────────────────────────────────────────────────────────────
#  1. Listar clientes de la empresa
# ────────────────────────────────────────────────────────────
@router.get("/clientes", response_model=List[ClienteOut])
def get_clientes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return (
        db.query(Cliente)
        .filter(Cliente.empresa_id == current_user.empresa_id)
        .all()
    )


# ────────────────────────────────────────────────────────────
#  2. Crear cliente
# ────────────────────────────────────────────────────────────
@router.post("/clientes", response_model=ClienteOut, status_code=status.HTTP_201_CREATED)
def create_cliente(
    cliente: ClienteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    nuevo = Cliente(
        nombre=cliente.nombre,
        empresa_id=current_user.empresa_id
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


# ────────────────────────────────────────────────────────────
#  3. Obtener cliente por ID
# ────────────────────────────────────────────────────────────
@router.get("/clientes/{cliente_id}", response_model=ClienteOut)
def get_cliente(
    cliente_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cliente = (
        db.query(Cliente)
        .filter(Cliente.id == cliente_id, Cliente.empresa_id == current_user.empresa_id)
        .first()
    )
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return cliente


# ────────────────────────────────────────────────────────────
#  4. Actualizar cliente
# ────────────────────────────────────────────────────────────
@router.put("/clientes/{cliente_id}", response_model=ClienteOut)
def update_cliente(
    cliente_id: int,
    datos: ClienteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cliente = (
        db.query(Cliente)
        .filter(Cliente.id == cliente_id, Cliente.empresa_id == current_user.empresa_id)
        .first()
    )
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

    if datos.nombre is not None:
        cliente.nombre = datos.nombre

    db.commit()
    db.refresh(cliente)
    return cliente


# ────────────────────────────────────────────────────────────
#  5. Eliminar cliente (solo si no tiene tareas)
# ────────────────────────────────────────────────────────────
@router.delete("/clientes/{cliente_id}")
def delete_cliente(
    cliente_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cliente = (
        db.query(Cliente)
        .filter(Cliente.id == cliente_id, Cliente.empresa_id == current_user.empresa_id)
        .first()
    )
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

    # Verificar tareas asociadas
    tareas_asociadas = (
        db.query(Tarea)
        .filter(Tarea.cliente_id == cliente_id, Tarea.empresa_id == current_user.empresa_id)
        .count()
    )
    if tareas_asociadas > 0:
        raise HTTPException(
            status_code=400,
            detail="No se puede eliminar: el cliente tiene tareas asociadas"
        )

    db.delete(cliente)
    db.commit()
    return {"mensaje": f"Cliente {cliente_id} eliminado correctamente"}
