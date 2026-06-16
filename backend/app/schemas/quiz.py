from pydantic import (
    BaseModel,
    ConfigDict,
    Field
)

from typing import List


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


class GenerarQuizRequest(BaseModel):

    id_competencia: int

    id_submodulo: int

    id_tema: int


class RespuestaEstudiante(BaseModel):

    pregunta_id: int

    respuesta: str = Field(
        pattern="^[A-D]$"
    )


class CalificarQuizRequest(BaseModel):

    id_competencia: int

    id_submodulo: int

    id_tema: int

    respuestas: List[RespuestaEstudiante]


class ResultadoQuizOut(BaseModel):

    puntaje: float

    correctas: int

    incorrectas: int

    total_preguntas: int

    retroalimentacion: str

    model_config = ConfigDict(
        from_attributes=True
    )