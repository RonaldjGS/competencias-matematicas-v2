from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict
)

from typing import List


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

    estado: bool

    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
    
# ==========================================
# BANCO DE PREGUNTAS
# ==========================================

class PreguntaBancoOut(BaseModel):

    id_pregunta: int

    pregunta: str

    competencia: str

    submodulo: str

    tema: str

    dificultad: str

    estado: bool

    model_config = ConfigDict(
        from_attributes=True
    )
    
# ==========================================
# ACTUALIZAR PREGUNTA
# ==========================================

class PreguntaUpdate(BaseModel):

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

class PreguntaQuizOut(BaseModel):

    id_pregunta: int

    pregunta: str

    opcion_a: str

    opcion_b: str

    opcion_c: str

    opcion_d: str

    model_config = ConfigDict(
        from_attributes=True
    )
    
class ErrorImportacion(BaseModel):

    fila: int

    motivo: str


class ImportacionResponse(BaseModel):

    estado: str

    total_preguntas: int

    preguntas_importadas: int

    preguntas_rechazadas: int

    mensaje: str

    errores: List[ErrorImportacion] = []