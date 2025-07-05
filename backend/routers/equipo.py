# equipo.py ─ Routers para gestión de equipos
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from database import get_db
from models import Team, User
from auth import get_current_user
from pydantic import BaseModel

router = APIRouter()

# ────────────────────────────────────────────────────────────
#  Esquemas Pydantic
# ────────────────────────────────────────────────────────────
class TeamBase(BaseModel):
    name: str
    description: Optional[str] = None
    supervisor_id: Optional[int] = None  # id de User que será supervisor


class TeamCreate(TeamBase):
    pass


class TeamUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    supervisor_id: Optional[int] = None


class TeamOut(TeamBase):
    id: int

    class Config:
        orm_mode = True


# ────────────────────────────────────────────────────────────
#  Helper de permisos
# ────────────────────────────────────────────────────────────
def ensure_admin(user: User):
    if user.rol != "admin":
        raise HTTPException(status_code=403, detail="Solo administradores pueden realizar esta acción")


# ────────────────────────────────────────────────────────────
#  Endpoints
# ────────────────────────────────────────────────────────────
@router.get("/equipos", response_model=List[TeamOut])
def listar_equipos(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Team).filter(Team.empresa_id == current_user.empresa_id)
    if current_user.rol == "supervisor":
        # Un supervisor solo ve sus propios equipos
        query = query.filter(Team.supervisor_id == current_user.id)
    return query.all()


@router.post("/equipos", response_model=TeamOut, status_code=status.HTTP_201_CREATED)
def crear_equipo(
    nuevo: TeamCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ensure_admin(current_user)

    # Validar que el supervisor pertenezca a la misma empresa
    if nuevo.supervisor_id:
        supervisor = db.query(User).filter(
            User.id == nuevo.supervisor_id,
            User.empresa_id == current_user.empresa_id
        ).first()
        if not supervisor:
            raise HTTPException(400, "Supervisor no pertenece a la empresa")

    team_db = Team(
        name=nuevo.name,
        description=nuevo.description,
        supervisor_id=nuevo.supervisor_id,
        empresa_id=current_user.empresa_id
    )
    db.add(team_db)
    db.commit()
    db.refresh(team_db)
    return team_db


@router.get("/equipos/{team_id}", response_model=TeamOut)
def obtener_equipo(
    team_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    team = db.query(Team).filter(
        Team.id == team_id,
        Team.empresa_id == current_user.empresa_id
    ).first()

    if not team:
        raise HTTPException(404, "Equipo no encontrado")

    if current_user.rol == "supervisor" and team.supervisor_id != current_user.id:
        raise HTTPException(403, "No autorizado para ver este equipo")
    return team


@router.put("/equipos/{team_id}", response_model=TeamOut)
def actualizar_equipo(
    team_id: int,
    datos: TeamUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ensure_admin(current_user)

    team = db.query(Team).filter(
        Team.id == team_id,
        Team.empresa_id == current_user.empresa_id
    ).first()
    if not team:
        raise HTTPException(404, "Equipo no encontrado")

    if datos.name is not None:
        team.name = datos.name
    if datos.description is not None:
        team.description = datos.description
    if datos.supervisor_id is not None:
        supervisor = db.query(User).filter(
            User.id == datos.supervisor_id,
            User.empresa_id == current_user.empresa_id
        ).first()
        if not supervisor:
            raise HTTPException(400, "Supervisor no pertenece a la empresa")
        team.supervisor_id = datos.supervisor_id

    db.commit()
    db.refresh(team)
    return team


@router.delete("/equipos/{team_id}")
def eliminar_equipo(
    team_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ensure_admin(current_user)

    team = db.query(Team).filter(
        Team.id == team_id,
        Team.empresa_id == current_user.empresa_id
    ).first()
    if not team:
        raise HTTPException(404, "Equipo no encontrado")

    # (Opcional) Validar que no haya usuarios asignados
    miembros = db.query(User).filter(User.team_id == team_id).count()
    if miembros:
        raise HTTPException(400, "No se puede eliminar: hay miembros asignados")

    db.delete(team)
    db.commit()
    return {"mensaje": f"Equipo {team_id} eliminado"}


# ────────────────────────────────────────────────────────────
#  Gestión de miembros del equipo
# ────────────────────────────────────────────────────────────
class MemberAssign(BaseModel):
    user_id: int


@router.post("/equipos/{team_id}/miembros", status_code=status.HTTP_200_OK)
def agregar_miembro(
    team_id: int,
    miembro: MemberAssign,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Permite admin o supervisor del equipo
    team = db.query(Team).filter(
        Team.id == team_id,
        Team.empresa_id == current_user.empresa_id
    ).first()
    if not team:
        raise HTTPException(404, "Equipo no encontrado")

    if current_user.rol not in ("admin",) and team.supervisor_id != current_user.id:
        raise HTTPException(403, "No autorizado para agregar miembros")

    usuario = db.query(User).filter(
        User.id == miembro.user_id,
        User.empresa_id == current_user.empresa_id
    ).first()
    if not usuario:
        raise HTTPException(404, "Usuario no encontrado")

    usuario.team_id = team_id
    db.commit()
    return {"mensaje": f"Usuario {usuario.id} agregado al equipo {team_id}"}


@router.delete("/equipos/{team_id}/miembros/{user_id}")
def quitar_miembro(
    team_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    team = db.query(Team).filter(
        Team.id == team_id,
        Team.empresa_id == current_user.empresa_id
    ).first()
    if not team:
        raise HTTPException(404, "Equipo no encontrado")

    if current_user.rol not in ("admin",) and team.supervisor_id != current_user.id:
        raise HTTPException(403, "No autorizado para quitar miembros")

    usuario = db.query(User).filter(
        User.id == user_id,
        User.team_id == team_id,
        User.empresa_id == current_user.empresa_id
    ).first()
    if not usuario:
        raise HTTPException(404, "Usuario no pertenece al equipo")

    usuario.team_id = None
    db.commit()
    return {"mensaje": f"Usuario {user_id} quitado del equipo {team_id}"}
