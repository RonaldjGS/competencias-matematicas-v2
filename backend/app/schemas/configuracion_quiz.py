from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

class ConfiguracionQuizBase(BaseModel):

    id_competencia: int

    id_submodulo: int

    id_tema: int

    dificultad: Literal[
        "Básico",
        "Intermedio",
        "Avanzado"
    ]

    cantidad_preguntas: int = Field(..., ge=1)

    tiempo_minutos: int = Field(..., ge=1)

    intentos: int = Field(..., ge=1, le=5)

    mezclar_preguntas: bool = True

    mezclar_opciones: bool = True

    mostrar_resultado: bool = True
    
class ConfiguracionQuizCreate(ConfiguracionQuizBase):
    pass

class ConfiguracionQuizUpdate(ConfiguracionQuizBase):
    pass

class ConfiguracionQuizResponse(ConfiguracionQuizBase):

    id_configuracion: int

    id_profesor: int

    estado: bool

    created_at: datetime

    updated_at: datetime | None = None

    model_config = ConfigDict(
        from_attributes=True
    )
    
    
class ConfiguracionQuizDetalle(ConfiguracionQuizResponse):

    nombre_competencia: str

    nombre_submodulo: str

    nombre_tema: str