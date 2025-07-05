from datetime import date
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload

from database import get_db
from models import Tarea, Cliente, User
from .auth import get_current_user
from schemas import TareaCreate, TareaOut, TareaUpdate, ClienteOut

router = APIRouter()

# ────────────────────────────────────────────────────────────
# GET  /tareas   (filtro multi-empresa + filtros opcionales)
# ────────────────────────────────────────────────────────────
@router.get("/tareas", response_model=List[TareaOut])
def obtener_tareas(
    estado: str | None = Query(default=None),
    cliente_id: int | None = Query(default=None),
    fecha_desde: date | None = Query(default=None),
    fecha_hasta: date | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # base: tareas de la misma empresa
    query = (
        db.query(Tarea)
        .options(joinedload(Tarea.cliente))
        .filter(Tarea.empresa_id == current_user.empresa_id)
    )

    # opcionales
    if estado:
        query = query.filter(Tarea.estado == estado)

    if cliente_id:
        query = query.filter(Tarea.cliente_id == cliente_id)

    if fecha_desde:
        query = query.filter(Tarea.fecha_vencimiento >= fecha_desde)

    if fecha_hasta:
        query = query.filter(Tarea.fecha_vencimiento <= fecha_hasta)

    return query.all()

# ────────────────────────────────────────────────────────────
# POST /tareas
# ────────────────────────────────────────────────────────────
@router.post("/tareas", response_model=TareaOut, status_code=status.HTTP_201_CREATED)
def crear_tarea(
    tarea: TareaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Validar que el cliente pertenezca a la misma empresa
    cliente = db.query(Cliente).filter(
        Cliente.id == tarea.cliente_id,
        Cliente.empresa_id == current_user.empresa_id
    ).first()

    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado o sin permiso")

    nueva_tarea = Tarea(
        titulo=tarea.titulo,
        estado=tarea.estado,
        cliente_id=tarea.cliente_id,
        usuario_id=tarea.usuario_id or current_user.id,
        empresa_id=current_user.empresa_id,
        fecha_vencimiento=tarea.fecha_vencimiento
    )
    db.add(nueva_tarea)
    db.commit()
    db.refresh(nueva_tarea)
    return nueva_tarea

# ────────────────────────────────────────────────────────────
# GET  /clientes/{cliente_id}/tareas
# ────────────────────────────────────────────────────────────
@router.get("/clientes/{cliente_id}/tareas", response_model=List[TareaOut])
def obtener_tareas_por_cliente(
    cliente_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # verificar pertenencia del cliente
    cliente = db.query(Cliente).filter(
        Cliente.id == cliente_id,
        Cliente.empresa_id == current_user.empresa_id
    ).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado o sin permiso")

    return db.query(Tarea).filter(
        Tarea.cliente_id == cliente_id,
        Tarea.empresa_id == current_user.empresa_id
    ).all()

# ────────────────────────────────────────────────────────────
# GET /tareas/{tarea_id}
# ────────────────────────────────────────────────────────────
@router.get("/tareas/{tarea_id}", response_model=TareaOut)
def obtener_tarea_por_id(
    tarea_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tarea = db.query(Tarea).options(joinedload(Tarea.cliente)).filter(
        Tarea.id == tarea_id,
        Tarea.empresa_id == current_user.empresa_id
    ).first()
    if not tarea:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    return tarea

# ────────────────────────────────────────────────────────────
# PUT /tareas/{tarea_id}
# ────────────────────────────────────────────────────────────
@router.put("/tareas/{tarea_id}", response_model=TareaOut)
def actualizar_tarea(
    tarea_id: int,
    datos: TareaUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tarea = db.query(Tarea).filter(
        Tarea.id == tarea_id,
        Tarea.empresa_id == current_user.empresa_id
    ).first()
    if not tarea:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")

    # Campos opcionales
    if datos.titulo is not None:
        tarea.titulo = datos.titulo
    if datos.estado is not None:
        tarea.estado = datos.estado
    if datos.cliente_id is not None:
        # Validar cliente perteneciente a la empresa
        cliente = db.query(Cliente).filter(
            Cliente.id == datos.cliente_id,
            Cliente.empresa_id == current_user.empresa_id
        ).first()
        if not cliente:
            raise HTTPException(status_code=400, detail="Cliente inválido para esta empresa")
        tarea.cliente_id = datos.cliente_id
    if datos.usuario_id is not None:
        tarea.usuario_id = datos.usuario_id
    if datos.fecha_vencimiento is not None:
        tarea.fecha_vencimiento = datos.fecha_vencimiento

    db.commit()
    db.refresh(tarea)
    return tarea

# ────────────────────────────────────────────────────────────
# DELETE /tareas/{tarea_id}
# ────────────────────────────────────────────────────────────
@router.delete("/tareas/{tarea_id}")
def eliminar_tarea(
    tarea_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tarea = db.query(Tarea).filter(
        Tarea.id == tarea_id,
        Tarea.empresa_id == current_user.empresa_id
    ).first()
    if not tarea:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    db.delete(tarea)
    db.commit()
    return {"mensaje": f"Tarea {tarea_id} eliminada correctamente"}


