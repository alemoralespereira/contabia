from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from database import Base, engine
from routers import tareas, clientes, auth
from routers.usuarios import router as usuarios_router


app = FastAPI()

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://contabia-git-main-alejandro-morales-projects-f200c0cc.vercel.app"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("✅ CORS ACTIVADO para Vercel")

Base.metadata.create_all(bind=engine)

# Routers
app.include_router(auth.auth_router)
app.include_router(tareas.router)
app.include_router(clientes.router)
app.include_router(usuarios_router)  # ⬅️ Nuevo router agregado



# Ruta base
@app.get("/")
def read_root():
    return {"status": "ok"}
