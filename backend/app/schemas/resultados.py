from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict
)

class ResultadoHistorialOut(
    BaseModel
):

    id_resultado: int

    id_competencia: int

    id_submodulo: int

    id_tema: int

    puntaje: float

    correctas: int

    incorrectas: int

    total_preguntas: int
    
    retroalimentacion: str

    fecha: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
    
class DashboardEstudianteOut(
    BaseModel
):

    total_evaluaciones: int

    promedio: float

    mejor_puntaje: float

    peor_puntaje: float
    
class DashboardProfesorOut(
    BaseModel
):

    total_estudiantes: int

    total_evaluaciones: int

    promedio_general: float

    aprobados: int

    reprobados: int
    
class CompetenciaDebilOut(BaseModel):

    competencia: str

    errores: int

    porcentaje_error: float
    
class TemaDebilOut(BaseModel):

    tema: str

    errores: int

    porcentaje_error: float
    
class RecomendacionOut(BaseModel):

    tema: str

    motivo: str
    
class RankingOut(BaseModel):

    puesto: int

    estudiante: str

    promedio: float
    
class EstudianteResumenOut(BaseModel):

    id_estudiante: int

    nombre_estudiante: str

    correo_estudiante: str

    promedio: float

    evaluaciones: int

    mejor_puntaje: float

    estado: bool
    
# ==========================================
# PERFIL INDIVIDUAL ESTUDIANTE
# ==========================================

class PerfilEstudianteOut(BaseModel):

    id_estudiante: int

    nombre_estudiante: str

    correo_estudiante: str

    estado: bool

    total_evaluaciones: int

    promedio_general: float

    mejor_puntaje: float

    tiempo_promedio: float
    
# ==========================================
# HISTORIAL DEL ESTUDIANTE
# ==========================================

class HistorialEstudianteOut(BaseModel):

    id_resultado: int

    fecha: datetime

    tema: str

    puntaje: float

    correctas: int

    total_preguntas: int

    tiempo_segundos: int

    estado: str
    
# ==========================================
# RENDIMIENTO POR COMPETENCIA
# ==========================================

class CompetenciaRendimientoOut(BaseModel):

    competencia: str

    total_preguntas: int

    correctas: int

    porcentaje: float
    
# ==========================================
# EVOLUCIÓN DEL RENDIMIENTO
# ==========================================

class EvolucionRendimientoOut(BaseModel):

    fecha: datetime

    puntaje: float
    
