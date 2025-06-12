from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)

class Cliente(Base):
    __tablename__ = "clientes"
    id = Column(String, primary_key=True, index=True)
    nombre = Column(String)

class Tarea(Base):
    __tablename__ = "tareas"
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String)
    estado = Column(String)
    clienteId = Column(String, ForeignKey("clientes.id"))