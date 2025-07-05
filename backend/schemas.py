from pydantic import BaseModel, EmailStr
from datetime import date
from enum import Enum

# Si Rol no está definido en otro archivo, aquí te dejo uno base:
class Rol(str, Enum):
    admin = "admin"
    supervisor = "supervisor"
    miembro = "miembro"

# -----------------------------
#           USERS
# -----------------------------

class UserOut(BaseModel):
    id: int
    nombre: str
    email: EmailStr

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    email: EmailStr
    username: str
    rol: Rol

class UserCreate(UserBase):
    password: str
    empresa_id: int

class UserUpdate(BaseModel):
    nombre: str
    email: EmailStr



# -----------------------------
#         CLIENTES
# -----------------------------
class ClienteOut(BaseModel):
    id: int
    nombre: str

    class Config:
        orm_mode = True


# -----------------------------
#          TAREAS
# -----------------------------
class TareaOut(BaseModel):
    id: int
    titulo: str
    estado: str
    cliente: ClienteOut
    usuario: UserOut
    fecha_vencimiento: date

    class Config:
        orm_mode = True

class TareaCreate(BaseModel):
    titulo: str
    estado: str
    cliente_id: int
    usuario_id: int
    fecha_vencimiento: date

class TareaUpdate(BaseModel):
    titulo: str | None = None
    estado: str | None = None
    cliente_id: int | None = None
    usuario_id: int | None = None
    fecha_vencimiento: date | None = None
