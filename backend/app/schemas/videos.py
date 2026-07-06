from datetime import datetime

from pydantic import (
    BaseModel,
    HttpUrl,
    ConfigDict
)

from typing import Optional, Literal

# ===========================
# Base
# ===========================

class VideoBase(BaseModel):
    titulo: str
    descripcion: Optional[str] = None

    id_competencia: int
    id_submodulo: int
    id_tema: int

    youtube_url: str

    tipo: Literal["DIAGNOSTICO", "REFUERZO"] = "REFUERZO"

    estado: bool = True


# ===========================
# Crear
# ===========================

class VideoCreate(VideoBase):
    actualizado_por: int


# ===========================
# Editar
# ===========================

class VideoEdit(VideoBase):

    actualizado_por: int

# ===========================
# Respuesta
# ===========================

class VideoResponse(VideoBase):
    id_video: int
    actualizado_por: int

    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
    
# ==========================================
# ACTUALIZAR VIDEO
# ==========================================

class VideoUpdate(BaseModel):

    titulo: str

    descripcion: str | None = None

    id_competencia: int

    id_submodulo: int

    id_tema: int

    youtube_url: str

    tipo: str

    actualizado_por: int
    
# ==========================================
# VIDEO VISTO COMPLETO
# ==========================================

class VideoVisualizado(BaseModel):

    id_estudiante: int

    id_video: int


# ==========================================
# VIDEO OMITIDO
# ==========================================

class VideoOmitido(BaseModel):

    id_estudiante: int

    id_video: int