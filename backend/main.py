from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from database import Base, engine
from routers import tareas, clientes, auth


app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(auth.auth_router)
app.include_router(tareas.router)
app.include_router(clientes.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://contabia-frontend.netlify.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok"}
