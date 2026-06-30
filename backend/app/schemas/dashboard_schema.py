from pydantic import BaseModel
from datetime import datetime

class DashboardResumen(BaseModel):

    ejercicios_completados: int | None

    porcentaje_aciertos: float | None

    tiempo_promedio: int | None

    evaluaciones_realizadas: int | None
    
class RankingItem(BaseModel):

    posicion: int

    id_estudiante: int

    nombre: str

    puntaje: float

    porcentaje: float


class RankingResponse(BaseModel):

    top: list[RankingItem]

    mi_posicion: int
    
class ActividadItem(BaseModel):

    titulo: str

    porcentaje: float

    nivel: str

    fecha: datetime


class ActividadRecienteResponse(BaseModel):

    actividades: list[ActividadItem]