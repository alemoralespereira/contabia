from fastapi import Depends, HTTPException, Header
import jwt

SECRET_KEY = "secret123"

def verify_token(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token inválido")
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["username"]
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")