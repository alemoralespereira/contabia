from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import User
from schemas import UserCreate, UserUpdate, UserOut
from routers.auth import get_current_user, get_password_hash
from models import Rol

router = APIRouter()

# ────────────────────────────────────────────────────────────
#  1) Mi perfil
# ────────────────────────────────────────────────────────────
@router.get("/usuarios/me", response_model=UserOut)
def obtener_mi_usuario(
    current_user: User = Depends(get_current_user)
):
    """Devuelve los datos del usuario autenticado."""
    return current_user

# ────────────────────────────────────────────────────────────
#  2) Listar usuarios de la empresa (solo admin)
# ────────────────────────────────────────────────────────────
@router.get("/usuarios", response_model=List[UserOut])
def listar_usuarios(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.rol != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo administradores pueden ver la lista de usuarios"
        )

    return (
        db.query(User)
        .filter(User.empresa_id == current_user.empresa_id)
        .all()
    )

# ────────────────────────────────────────────────────────────
#  3) Crear nuevo usuario (solo admin)
# ────────────────────────────────────────────────────────────
@router.post("/usuarios", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def crear_usuario(
    nuevo: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.rol != "admin":
        raise HTTPException(403, "Solo administradores pueden crear usuarios")

    # Verificar email único dentro de la empresa
    if (
        db.query(User)
        .filter(User.email == nuevo.email, User.empresa_id == current_user.empresa_id)
        .first()
    ):
        raise HTTPException(400, "Email ya registrado en esta empresa")

    usuario_db = User(
        username=nuevo.email,
        email=nuevo.email,
        password=get_password_hash(nuevo.password),
        rol=Rol(nuevo.rol) if isinstance(nuevo.rol, str) else nuevo.rol,
        empresa_id=current_user.empresa_id
    )
    db.add(usuario_db)
    db.commit()
    db.refresh(usuario_db)
    return usuario_db

# ────────────────────────────────────────────────────────────
#  4) Actualizar usuario (solo admin)
# ────────────────────────────────────────────────────────────
@router.put("/usuarios/{id}", response_model=UserOut)
def actualizar_usuario(
    id: int,
    datos: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.rol != "admin":
        raise HTTPException(403, "Solo administradores pueden actualizar usuarios")

    usuario = (
        db.query(User)
        .filter(User.id == id, User.empresa_id == current_user.empresa_id)
        .first()
    )
    if not usuario:
        raise HTTPException(404, "Usuario no encontrado")

    # Actualizar campos opcionales
    if datos.email:
        # Evitar duplicados
        if (
            db.query(User)
            .filter(
                User.email == datos.email,
                User.empresa_id == current_user.empresa_id,
                User.id != id
            )
            .first()
        ):
            raise HTTPException(400, "Email ya registrado en esta empresa")
        usuario.email = datos.email
        usuario.username = datos.email
    if datos.password:
        usuario.password = get_password_hash(datos.password)
    if datos.rol:
        usuario.rol = Rol(datos.rol) if isinstance(datos.rol, str) else datos.rol

    db.commit()
    db.refresh(usuario)
    return usuario

# ────────────────────────────────────────────────────────────
#  5) Eliminar usuario (solo admin)
# ────────────────────────────────────────────────────────────
@router.delete("/usuarios/{id}")
def eliminar_usuario(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.rol != "admin":
        raise HTTPException(403, "Solo administradores pueden eliminar usuarios")

    usuario = (
        db.query(User)
        .filter(User.id == id, User.empresa_id == current_user.empresa_id)
        .first()
    )
    if not usuario:
        raise HTTPException(404, "Usuario no encontrado")

    # (opcional) evitar que un admin se elimine a sí mismo
    if usuario.id == current_user.id:
        raise HTTPException(400, "No puedes eliminar tu propio usuario")

    db.delete(usuario)
    db.commit()
    return {"mensaje": f"Usuario {id} eliminado correctamente"}
