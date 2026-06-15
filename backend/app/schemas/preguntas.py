from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict
)

from typing import Optional

class PreguntaOut(BaseModel):

    id_pregunta: int

    id_profesor: int

    id_nivel: int

    id_competencia: int

    id_submodulo: int

    id_tema: int

    dificultad: str

    pregunta: str

    opcion_a: str

    opcion_b: str

    opcion_c: str

    opcion_d: str

    respuesta_correcta: str

    justificacion: Optional[str]

    tiempo_estimado: int

    estado: bool

    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
    
class PreguntaQuizOut(BaseModel):

    id_pregunta: int

    pregunta: str

    opcion_a: str

    opcion_b: str

    opcion_c: str

    opcion_d: str

    tiempo_estimado: int

    model_config = ConfigDict(
        from_attributes=True
    )
    
class ImportacionResponse(BaseModel):

    preguntas_importadas: int

    preguntas_rechazadas: int

    mensaje: str
    
