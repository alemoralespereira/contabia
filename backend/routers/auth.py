from fastapi import Depends, HTTPException, status, APIRouter
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from models import User              # modelo SQLAlchemy
from database import get_db
import os
from dotenv import load_dotenv

# ────────────────────────────────────────────────────────────
#  Configuración básica
# ────────────────────────────────────────────────────────────
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM  = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context   = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
auth_router   = APIRouter()

# ────────────────────────────────────────────────────────────
#  Utilidades de contraseña
# ────────────────────────────────────────────────────────────
def verify_password(plain_password, stored_password):
    return plain_password == stored_password

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# ────────────────────────────────────────────────────────────
#  Autenticar usuario
# ────────────────────────────────────────────────────────────
def authenticate_user(db: Session, username: str, password: str):
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.password):
        return False
    return user

# ────────────────────────────────────────────────────────────
#  Crear JWT con empresa_id y rol
# ────────────────────────────────────────────────────────────
def create_access_token(
    user: User,
    expires_delta: timedelta | None = None
) -> str:
    expire = datetime.utcnow() + (expires_delta or timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    ))

    payload = {
        "sub": str(user.id),          # ID único del usuario
        "empresa_id": user.empresa_id,
        "rol": user.rol,
        "exp": expire
    }
    encoded_jwt = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# ────────────────────────────────────────────────────────────
#  Endpoint de login
# ────────────────────────────────────────────────────────────
@auth_router.post("/token")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(user)
    return {"access_token": access_token, "token_type": "bearer"}

# ────────────────────────────────────────────────────────────
#  Obtener usuario actual (incluye empresa_id y rol)
# ────────────────────────────────────────────────────────────
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload      = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id      = payload.get("sub")
        empresa_id   = payload.get("empresa_id")
        rol          = payload.get("rol")
        if user_id is None or empresa_id is None or rol is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception

    # Adjuntar al objeto usuario la info del token
    user.empresa_id = empresa_id
    user.rol        = rol
    return user

