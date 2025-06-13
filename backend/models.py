from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base
from sqlalchemy import Date
from datetime import date



class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)

    tareas = relationship("Tarea", back_populates="usuario")

class Cliente(Base):
    __tablename__ = "clientes"
    id = Column(String, primary_key=True, index=True)
    nombre = Column(String)

    tareas = relationship("Tarea", back_populates="cliente") 

class Tarea(Base):
    __tablename__ = "tareas"
    id = Column(Integer, primary_key=True)
    titulo = Column(String)
    estado = Column(String)
    fecha_vencimiento = Column(Date)

    cliente_id = Column(Integer, ForeignKey("clientes.id"))
    usuario_id = Column(Integer, ForeignKey("users.id"))

    cliente = relationship("Cliente", back_populates="tareas")
    usuario = relationship("User", back_populates="tareas")