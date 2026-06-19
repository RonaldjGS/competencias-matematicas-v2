from pydantic import (
    BaseModel,
    ConfigDict,
    Field
)

from typing import List

# ==========================================
# Preguntas
# ==========================================

class PreguntaQuizOut(BaseModel):

    id_pregunta: int

    pregunta: str

    opcion_a: str

    opcion_b: str

    opcion_c: str

    opcion_d: str

    dificultad: str

    model_config = ConfigDict(
        from_attributes=True
    )

# ==========================================
# Generar Quiz
# ==========================================

class GenerarQuizRequest(
    BaseModel
):

    id_competencia: int

    id_submodulo: int

    id_tema: int

    cantidad_preguntas: int = 10

# ==========================================
# Respuestas Estudainte
# ==========================================

class RespuestaEstudiante(BaseModel):

    pregunta_id: int

    respuesta: str = Field(
        pattern="^[A-D]$"
    )

# ==========================================
# Clasificar Quiz
# ==========================================

class CalificarQuizRequest(BaseModel):

    id_competencia: int

    id_submodulo: int

    id_tema: int

    respuestas: List[RespuestaEstudiante]

# ==========================================
# Resultado Quiz
# ==========================================

class ResultadoQuizOut(BaseModel):

    puntaje: float

    correctas: int

    incorrectas: int

    total_preguntas: int

    retroalimentacion: str

    model_config = ConfigDict(
        from_attributes=True
    )
   

# ==========================================
# RESPONDER PREGUNTA
# ==========================================

class ResponderPreguntaRequest(
    BaseModel
):

    id_competencia: int

    id_submodulo: int

    id_tema: int

    id_pregunta: int

    respuesta: str

    usar_intento: bool
    
# ==========================================
# RESPUESTA PREGUNTA
# ==========================================

class RespuestaPreguntaOut(
    BaseModel
):

    correcta: bool

    mostrar_solucion: bool

    intentos_restantes: int

    respuesta_correcta: str | None = None

    justificacion: str | None = None

    opciones_bloqueadas: list[str] = []


# ==========================================
# RESPONDER PREGUNTA
# ==========================================

class ResponderPreguntaRequest(
    BaseModel
):

    id_competencia: int

    id_submodulo: int

    id_tema: int

    id_pregunta: int

    respuesta: str

    usar_intento: bool


# ==========================================
# RESPUESTA PREGUNTA
# ==========================================

class RespuestaPreguntaOut(
    BaseModel
):

    correcta: bool

    mostrar_solucion: bool

    intentos_restantes: int

    respuesta_correcta: str | None = None

    justificacion: str | None = None

    opciones_bloqueadas: list[str] = []