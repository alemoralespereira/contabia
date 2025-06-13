from fastapi import APIRouter, Depends
from fastapi import Query 
from datetime import date
from sqlalchemy.orm import Session
from database import get_db
from models import Tarea
from verify_token import verify_token
from schemas import TareaOut  # ⬅️ Importa el esquema nuevo

router = APIRouter()
fecha_desde: date | None = Query(default=None),
fecha_hasta: date | None = Query(default=None)

@router.get("/tareas", response_model=list[TareaOut])
def obtener_tareas(
    usuario=Depends(verify_token),
    db: Session = Depends(get_db),
    estado: str | None = Query(default=None),
    cliente_id: int | None = Query(default=None)
):
    query = db.query(Tarea).filter(Tarea.usuario_id == usuario.id)

    if estado:
        query = query.filter(Tarea.estado == estado)

    if cliente_id:
        query = query.filter(Tarea.cliente_id == cliente_id)

    if fecha_desde:
    	query = query.filter(Tarea.fecha_vencimiento >= fecha_desde)
    if fecha_hasta:
    	query = query.filter(Tarea.fecha_vencimiento <= fecha_hasta)
    
    return query.all()


from schemas import TareaCreate  # asegurate de importar

@router.post("/tareas", response_model=TareaOut)
def crear_tarea(tarea: TareaCreate, db: Session = Depends(get_db)):
    nueva_tarea = Tarea(
        titulo=tarea.titulo,
        estado=tarea.estado,
        cliente_id=tarea.cliente_id,
        usuario_id=tarea.usuario_id
    )
    db.add(nueva_tarea)
    db.commit()
    db.refresh(nueva_tarea)
    return nueva_tarea


@router.get("/clientes/{cliente_id}/tareas", response_model=list[TareaOut])
def obtener_tareas_por_cliente(cliente_id: int, db: Session = Depends(get_db), usuario=Depends(verify_token)):
    return db.query(Tarea).filter(Tarea.cliente_id == cliente_id).all()


@router.get("/tareas/{tarea_id}", response_model=TareaOut)
def obtener_tarea_por_id(tarea_id: int, db: Session = Depends(get_db), usuario=Depends(verify_token)):
    tarea = db.query(Tarea).filter(Tarea.id == tarea_id).first()
    if not tarea:
        return {"error": "Tarea no encontrada"}
    return tarea


@router.put("/tareas/{tarea_id}", response_model=TareaOut)
def actualizar_tarea(tarea_id: int, datos: TareaUpdate, db: Session = Depends(get_db), usuario=Depends(verify_token)):
    tarea = db.query(Tarea).filter(Tarea.id == tarea_id).first()
    if not tarea:
        return {"error": "Tarea no encontrada"}

    if datos.titulo is not None:
        tarea.titulo = datos.titulo
    if datos.estado is not None:
        tarea.estado = datos.estado
    if datos.cliente_id is not None:
        tarea.cliente_id = datos.cliente_id
    if datos.usuario_id is not None:
        tarea.usuario_id = datos.usuario_id

    db.commit()
    db.refresh(tarea)
    return tarea

@router.delete("/tareas/{tarea_id}")
def eliminar_tarea(tarea_id: int, db: Session = Depends(get_db), usuario=Depends(verify_token)):
    tarea = db.query(Tarea).filter(Tarea.id == tarea_id).first()
    if not tarea:
        return {"error": "Tarea no encontrada"}
    db.delete(tarea)
    db.commit()
    return {"mensaje": f"Tarea {tarea_id} eliminada correctamente"}

