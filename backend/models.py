from sqlalchemy import Column, Integer, String, ForeignKey, Date, Enum
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy import Date
from datetime import date
import enum

class Rol(enum.Enum):
    admin       = "admin"
    supervisor  = "supervisor"
    miembro     = "miembro"

class Empresa(Base):
    __tablename__ = "empresas"
    id      = Column(Integer, primary_key=True, index=True)
    nombre  = Column(String, nullable=False, unique=True)

    usuarios = relationship("User",    back_populates="empresa")
    clientes = relationship("Cliente", back_populates="empresa")

class Team(Base):
    __tablename__ = "teams"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    empresa_id = Column(Integer, ForeignKey("empresas.id"), nullable=False)
    supervisor_id = Column(Integer, ForeignKey("users.id"))

    empresa = relationship("Empresa")
    supervisor = relationship("User", foreign_keys=[supervisor_id])
    miembros = relationship("User", back_populates="equipo", 	foreign_keys="User.team_id")



class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    rol          = Column(Enum(Rol), nullable=False)
    empresa_id   = Column(Integer, ForeignKey("empresas.id"), nullable=False)
    team_id      = Column(Integer, ForeignKey("teams.id"), nullable=True)

    empresa = relationship("Empresa", back_populates="usuarios")
    tareas  = relationship("Tarea", back_populates="usuario")
    equipo  = relationship("Team", back_populates="miembros")


class Cliente(Base):
    __tablename__ = "clientes"
    id = Column(String, primary_key=True, index=True)
    nombre = Column(String)
    empresa_id = Column(Integer, ForeignKey("empresas.id"), nullable=False)

    empresa    = relationship("Empresa", back_populates="clientes")
    tareas     = relationship("Tarea", back_populates="cliente")

class Tarea(Base):
    __tablename__ = "tareas"
    id = Column(Integer, primary_key=True)
    titulo = Column(String)
    estado = Column(String)
    fecha_vencimiento = Column(Date)

    cliente_id = Column(Integer, ForeignKey("clientes.id"))
    usuario_id = Column(Integer, ForeignKey("users.id"))
    empresa_id = Column(Integer, ForeignKey("empresas.id"), nullable=False)

    cliente = relationship("Cliente", back_populates="tareas")
    usuario = relationship("User", back_populates="tareas")