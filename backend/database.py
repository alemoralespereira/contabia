from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

Base = declarative_base()

DATABASE_URL = os.getenv("DATABASE_URL")

# 🔧 Forzamos conexión por IPv4 agregando `?sslmode=require` directamente
engine = create_engine(DATABASE_URL + "?sslmode=require", connect_args={"sslmode": "require"})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
