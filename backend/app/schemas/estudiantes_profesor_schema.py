from datetime import datetime

from pydantic import BaseModel


# ==========================================
# HISTORIAL DE EVALUACIONES
# ==========================================

class HistorialEvaluacion(BaseModel):

    id_resultado:int

    fecha:datetime

    competencia:str

    submodulo:str

    tema:str

    porcentaje:float

    nivel_desempeno:str

    dificultad:str

    tiempo_segundos:int

    class Config:

        from_attributes=True
        
        
# ==========================================
# DETALLE DE EVALUACIÓN
# ==========================================

class DetalleEvaluacionSchema(BaseModel):

    numero_pregunta:int

    pregunta:str

    opcion_a:str

    opcion_b:str

    opcion_c:str

    opcion_d:str

    respuesta_correcta:str

    respuesta_estudiante:str

    es_correcta:bool

    justificacion:str

    tiempo_respuesta:int

    class Config:

        from_attributes=True