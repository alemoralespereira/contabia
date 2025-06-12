from fastapi import FastAPI
from database import Base, engine
from routers import tareas, clientes
import auth

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(tareas.router)
app.include_router(clientes.router)