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
    
    dificultad: str

    cantidad_preguntas: int = 10

# ==========================================
# Respuestas Estudainte
# ==========================================

class RespuestaEstudiante(BaseModel):

    pregunta_id: int

    respuesta: str = Field(
        pattern="^[A-D]$"
    )
    
    tiempo_pregunta: int

# ==========================================
# Clasificar Quiz
# ==========================================

class CalificarQuizRequest(BaseModel):

    id_competencia: int

    id_submodulo: int

    id_tema: int

    respuestas: List[RespuestaEstudiante]
    
    tiempo_total: int

# ==========================================
# Resultado Quiz
# ==========================================

class ResultadoQuizBasicoOut(BaseModel):

    puntaje: float

    correctas: int

    incorrectas: int

    total_preguntas: int
    
    tiempo_segundos: int

    retroalimentacion: str

    model_config = ConfigDict(
        from_attributes=True
    )
   

# ==========================================
# RESPONDER PREGUNTA
# ==========================================

class ResponderPreguntaRequest(BaseModel):

    id_intento: int

    id_pregunta: int

    respuesta: str

    numero_pregunta: int

    tiempo_respuesta: int
    
# ==========================================
# RESPUESTA PREGUNTA
# ==========================================

class RespuestaPreguntaOut(
    BaseModel
):

    correcta: bool

    mostrar_solucion: bool
    
    puede_reintentar: bool
    
    ultimo_intento: bool = False

    intentos_restantes: int

    respuesta_correcta: str | None = None

    justificacion: str | None = None

    opciones_bloqueadas: list[str] = []

    
# ==========================================
# ESTADO DE INTENTOS
# ==========================================

class EstadoIntentosOut(
    BaseModel
):

    intentos_usados: int

    intentos_restantes: int

    completado: bool
    
# ==========================================
# CONSULTAR INTENTOS
# ==========================================

class ConsultarIntentosRequest(
    BaseModel
):

    id_competencia: int

    id_submodulo: int

    id_tema: int
    
# ==========================================
# Submodulo Disponible
# ==========================================

class SubmoduloDisponibleOut(
    BaseModel
):

    id_submodulo: int

    nombre_submodulo: str

    estado: str
    
 
# ==========================================
# Submodulo finalizado
# ==========================================    

class FinalizarSubmoduloIn(
    BaseModel
):

    id_estudiante: int

    id_competencia: int

    id_submodulo: int
    
# ==========================================
# Tema Disponible
# ==========================================  
class TemaDisponibleOut(BaseModel):

    id_tema: int

    nombre_tema: str

    descripcion_tema: str

    model_config = ConfigDict(
        from_attributes=True
    )
    
# ==========================================
# QUIZ GENERADO
# ==========================================

class QuizGeneradoOut(BaseModel):

    id_intento: int

    preguntas: list[PreguntaQuizOut]
    
    tiempo_segundos: int

# ==========================================
# REINTENTAR PREGUNTA
# ==========================================    
class ReintentarPreguntaRequest(BaseModel):

    id_intento:int

    id_pregunta:int

    respuesta:str
    
    numero_pregunta: int

    tiempo_respuesta: int

# ==========================================
# RESPUESTA REINTENTO
# ==========================================    
class RespuestaReintentoOut(BaseModel):

    intentos_restantes:int

    opciones_bloqueadas:list[str]

    ultimo_intento:bool=False

    respuesta_correcta:str|None=None

    justificacion:str|None=None
    
# ==========================================
# CONTINUAR SIN INTENTO
# ==========================================

class ContinuarPreguntaRequest(BaseModel):

    id_intento: int

    id_pregunta: int

    numero_pregunta: int

    respuesta: str

    tiempo_respuesta: int
    

# ==========================================
# FINALIZAR QUIZ
# ==========================================

class FinalizarQuizRequest(BaseModel):

    id_intento: int

    tiempo_total: int


# ==========================================
# RESULTADO FINAL QUIZ
# ==========================================

class FinalizarQuizOut(BaseModel):

    id_resultado: int
    
# ==========================================
# DETALLE RESULTADO
# ==========================================

class ResultadoDetalleOut(BaseModel):

    numero_pregunta: int

    respuesta_estudiante: str

    respuesta_correcta: str

    es_correcta: bool

    tiempo_respuesta: int

    model_config = {

        "from_attributes": True

    }


# ==========================================
# RESULTADO COMPLETO
# ==========================================

class ResumenQuizOut(BaseModel):

    id_resultado: int

    porcentaje: float

    nivel_desempeno: str

    correctas: int

    incorrectas: int

    total_preguntas: int

    tiempo_segundos: int

    intento: int

    retroalimentacion: str

    mejora: float | None = None

    detalle: list[ResultadoDetalleOut]

    model_config = {

        "from_attributes": True

    }