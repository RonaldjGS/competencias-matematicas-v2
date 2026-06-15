from datetime import datetime, timedelta, timezone

from jose import jwt

from passlib.context import CryptContext

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.usuarios import Estudiante

from app.models.usuarios import Profesor
from jose import jwt, JWTError

from fastapi import (
    Depends,
    HTTPException,
    status
)

from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials
)


bearer_scheme = HTTPBearer()

from .config import (
    SECRET_KEY,
    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def hash_password(password: str):

    return pwd_context.hash(password)

def verify_password(
    password: str,
    password_hash: str
):

    return pwd_context.verify(
        password,
        password_hash
    )

def create_access_token(
    data: dict
):

    to_encode = data.copy()

    expire = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    to_encode.update(
        {
            "exp": expire
        }
    )

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )
from jose import JWTError

from fastapi import (
    Depends,
    HTTPException,
    status
)

from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials
)


def get_current_estudiante(
    credentials: HTTPAuthorizationCredentials = Depends(
        bearer_scheme
    ),
    db: Session = Depends(get_db)
):

    token = credentials.credentials

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido o expirado"
    )

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        estudiante_id = payload.get("sub")

        tipo = payload.get("tipo")

        if estudiante_id is None:
            raise credentials_exception

        if tipo != "estudiante":
            raise credentials_exception

    except JWTError:

        raise credentials_exception

    estudiante = (
        db.query(Estudiante)
        .filter(
            Estudiante.id_estudiante == int(
                estudiante_id
            )
        )
        .first()
    )

    if not estudiante:

        raise credentials_exception

    return estudiante

def get_current_profesor(
    credentials: HTTPAuthorizationCredentials = Depends(
        bearer_scheme
    ),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido o expirado"
    )

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        profesor_id = payload.get("sub")

        tipo = payload.get("tipo")

        if profesor_id is None:
            raise credentials_exception

        if tipo != "profesor":
            raise credentials_exception

    except JWTError:

        raise credentials_exception

    profesor = (
        db.query(Profesor)
        .filter(
            Profesor.id_profesor == int(
                profesor_id
            )
        )
        .first()
    )

    if not profesor:

        raise credentials_exception

    return profesor