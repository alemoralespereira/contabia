from sqlalchemy import create_engine
from sqlalchemy.engine.url import URL
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = URL.create(
    drivername="postgresql+psycopg2",
    username="postgres",
    password="Contabia2024Secure!",
    host="db.poovgzyvfwrcbqgqvaqk.supabase.co",
    port=5432,
    database="postgres"
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()