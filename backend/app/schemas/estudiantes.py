from datetime import datetime

from pydantic import (
    BaseModel,
    EmailStr,
    Field,
    ConfigDict
)

from typing import Optional


# ==========================================
# REGISTRO
# ==========================================

class EstudianteCreate(BaseModel):

    nombre_estudiante: str = Field(
        min_length=3,
        max_length=200
    )

    institucion_edu: str = Field(
        min_length=3,
        max_length=200
    )

    id_nivel: int

    id_tipo_institucion: Optional[int] = None

    id_carrera: Optional[int] = None

    id_ciudad: int

    correo_estudiante: EmailStr

    password: str = Field(
        min_length=8,
        max_length=100
    )


# ==========================================
# LOGIN
# ==========================================

class EstudianteLogin(BaseModel):

    correo_estudiante: EmailStr

    password: str


# ==========================================
# RESPUESTA TOKEN
# ==========================================

class TokenResponse(BaseModel):

    access_token: str

    token_type: str

    usuario: dict


# ==========================================
# PERFIL
# ==========================================

class EstudianteOut(BaseModel):

    id_estudiante: int

    nombre_estudiante: str

    correo_estudiante: str

    estado: bool

    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


# ==========================================
# CAMBIO DE CONTRASEÑA
# ==========================================

class ChangePasswordRequest(BaseModel):

    current_password: str

    new_password: str = Field(
        min_length=8,
        max_length=100
    )
    