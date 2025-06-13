from pydantic import BaseModel
from datetime import date

class ClienteOut(BaseModel):
    id: int
    nombre: str

    class Config:
        orm_mode = True

class UsuarioOut(BaseModel):
    id: int
    username: str

    class Config:
        orm_mode = True

class TareaOut(BaseModel):
    id: int
    titulo: str
    estado: str
    cliente: ClienteOut
    usuario: UsuarioOut
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