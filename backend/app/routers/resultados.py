from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.usuarios import (
    Estudiante,
    Profesor
)

from app.models.evaluaciones import (
    ResultadoQuiz
)

from app.core.auth import (
    get_current_estudiante,
    get_current_profesor
)

from app.schemas.resultados import (
    ResultadoHistorialOut,
    DashboardEstudianteOut,
    DashboardProfesorOut,
    CompetenciaDebilOut,
    TemaDebilOut,
    RecomendacionOut,
    RankingOut,
    EstudianteResumenOut,
    PerfilEstudianteOut,
    HistorialEstudianteOut,
    CompetenciaRendimientoOut,
    EvolucionRendimientoOut
)

from app.services.resultados_service import (
    obtener_dashboard_estudiante,
    obtener_perfil_estudiante,
    obtener_competencia_debil,
    obtener_tema_debil,
    obtener_dashboard_profesor,
    obtener_recomendaciones,
    obtener_ranking_semanal,
    obtener_estudiantes_resumen,
    obtener_historial_estudiante,
    obtener_rendimiento_competencias,
    obtener_evolucion_rendimiento
)

router = APIRouter(
    prefix="/resultados",
    tags=["Resultados"]
)

# ==========================================
# RESULTADOS DEL ESTUDIANTE
# ==========================================

@router.get(
    "/mis-resultados",
    response_model=list[
        ResultadoHistorialOut
    ]
)
def mis_resultados(
    estudiante: Estudiante = Depends(
        get_current_estudiante
    ),
    db: Session = Depends(get_db)
):

    resultados = (
        db.query(
            ResultadoQuiz
        )
        .filter(
            ResultadoQuiz.id_estudiante ==
            estudiante.id_estudiante
        )
        .order_by(
            ResultadoQuiz.fecha.desc()
        )
        .all()
    )

    return resultados

# ==========================================
# DASHBOARD ESTUDIANTE
# ==========================================

@router.get(
    "/dashboard-estudiante",
    response_model=DashboardEstudianteOut
)
def dashboard_estudiante(
    estudiante: Estudiante = Depends(
        get_current_estudiante
    ),
    db: Session = Depends(get_db)
):

    return obtener_dashboard_estudiante(
        estudiante.id_estudiante,
        db
    )

    
# ==========================================
# DASHBOARD DEL PROFESOR
# ==========================================

@router.get(
    "/dashboard-profesor",
    response_model=DashboardProfesorOut
)
def dashboard_profesor(
    profesor: Profesor = Depends(
        get_current_profesor
    ),
    db: Session = Depends(get_db)
):

    return obtener_dashboard_profesor(
        profesor.id_nivel,
        db
    )
    
# ==========================================
# COMPETENCIA MÁS DÉBIL
# ==========================================

@router.get(
    "/competencia-mas-debil",
    response_model=CompetenciaDebilOut
)
def competencia_mas_debil(
    estudiante: Estudiante = Depends(
        get_current_estudiante
    ),
    db: Session = Depends(get_db)
):

    resultado = obtener_competencia_debil(
        estudiante.id_estudiante,
        db
    )

    return CompetenciaDebilOut(
        competencia=resultado["competencia"],
        errores=resultado["errores"],
        porcentaje_error=resultado["porcentaje_error"]
    )
    
# ==========================================
# RESULTADOS DEL ESTUDIANTE
# ==========================================
    
@router.get(
    "/tema-mas-debil",
    response_model=TemaDebilOut
)
def tema_mas_debil(
    estudiante: Estudiante = Depends(
        get_current_estudiante
    ),
    db: Session = Depends(get_db)
):

    resultado = obtener_tema_debil(
        estudiante.id_estudiante,
        db
    )

    return TemaDebilOut(
        tema=resultado["tema"],
        errores=resultado["errores"],
        porcentaje_error=resultado["porcentaje_error"]
    )

# ==========================================
# RECOMENDACIONES
# ==========================================

@router.get(
    "/recomendaciones",
    response_model=list[
        RecomendacionOut
    ]
)
def recomendaciones(
    estudiante: Estudiante = Depends(
        get_current_estudiante
    ),
    db: Session = Depends(get_db)
):

    recomendaciones = (
        obtener_recomendaciones(
            estudiante.id_estudiante,
            db
        )
    )

    return [

        RecomendacionOut(

            tema=
            item["tema"],

            motivo=
            item["motivo"]
        )

        for item in recomendaciones
    ]

# ==========================================
# RANKING SEMANAL
# ==========================================

@router.get(
    "/ranking-semanal",
    response_model=list[
        RankingOut
    ]
)
def ranking_semanal(
    db: Session = Depends(get_db)
):

    ranking = obtener_ranking_semanal(
        db
    )

    return [

        RankingOut(

            puesto=
            item["puesto"],

            estudiante=
            item["estudiante"],

            promedio=
            item["promedio"]
        )

        for item in ranking
    ]

# ==========================================
# GESTIÓN DE ESTUDIANTES (PROFESOR)
# ==========================================

@router.get(
    "/estudiantes",
    response_model=list[
        EstudianteResumenOut
    ]
)
def listar_estudiantes(
    profesor: Profesor = Depends(
        get_current_profesor
    ),
    db: Session = Depends(get_db)
):

    estudiantes = (
        obtener_estudiantes_resumen(
            profesor.id_nivel,
            db
        )
    )

    return [

        EstudianteResumenOut(

            id_estudiante=
            item["id_estudiante"],

            nombre_estudiante=
            item["nombre_estudiante"],

            correo_estudiante=
            item["correo_estudiante"],

            promedio=
            item["promedio"],

            evaluaciones=
            item["evaluaciones"],

            mejor_puntaje=
            item["mejor_puntaje"],

            estado=
            item["estado"]
        )

        for item in estudiantes
    ]

# ==========================================
# PERFIL INDIVIDUAL DEL ESTUDIANTE
# ==========================================

@router.get(
    "/estudiante/{id_estudiante}",
    response_model=PerfilEstudianteOut
)
def perfil_estudiante(
    id_estudiante: int,
    profesor: Profesor = Depends(
        get_current_profesor
    ),
    db: Session = Depends(get_db)
):

    estudiante = (
        db.query(
            Estudiante
        )
        .filter(
            Estudiante.id_estudiante ==
            id_estudiante,

            Estudiante.id_nivel ==
            profesor.id_nivel
        )
        .first()
    )

    if not estudiante:

        raise HTTPException(
            status_code=404,
            detail="Estudiante no encontrado"
        )

    return obtener_perfil_estudiante(
        estudiante,
        db
    )
    
# ==========================================
# HISTORIAL DEL ESTUDIANTE
# ==========================================

@router.get(
    "/estudiante/{id_estudiante}/historial",
    response_model=list[
        HistorialEstudianteOut
    ]
)
def historial_estudiante(
    id_estudiante: int,
    profesor: Profesor = Depends(
        get_current_profesor
    ),
    db: Session = Depends(get_db)
):

    estudiante = (
        db.query(
            Estudiante
        )
        .filter(
            Estudiante.id_estudiante ==
            id_estudiante,

            Estudiante.id_nivel ==
            profesor.id_nivel
        )
        .first()
    )

    if not estudiante:

        raise HTTPException(
            status_code=404,
            detail="Estudiante no encontrado"
        )

    historial = (
        obtener_historial_estudiante(
            id_estudiante,
            db
        )
    )

    return [

        HistorialEstudianteOut(
            **item
        )

        for item in historial
    ]

# ==========================================
# RENDIMIENTO POR COMPETENCIA
# ==========================================

@router.get(
    "/estudiante/{id_estudiante}/competencias",
    response_model=list[
        CompetenciaRendimientoOut
    ]
)
def rendimiento_competencias(
    id_estudiante: int,
    profesor: Profesor = Depends(
        get_current_profesor
    ),
    db: Session = Depends(get_db)
):

    estudiante = (
        db.query(
            Estudiante
        )
        .filter(
            Estudiante.id_estudiante ==
            id_estudiante,

            Estudiante.id_nivel ==
            profesor.id_nivel
        )
        .first()
    )

    if not estudiante:

        raise HTTPException(
            status_code=404,
            detail="Estudiante no encontrado"
        )

    rendimiento = (
        obtener_rendimiento_competencias(
            estudiante.id_estudiante,
            db
        )
    )

    return [

        CompetenciaRendimientoOut(
            **item
        )

        for item in rendimiento
    ]

# ==========================================
# EVOLUCIÓN DEL RENDIMIENTO
# ==========================================

@router.get(
    "/estudiante/{id_estudiante}/evolucion",
    response_model=list[
        EvolucionRendimientoOut
    ]
)
def evolucion_rendimiento(
    id_estudiante: int,
    profesor: Profesor = Depends(
        get_current_profesor
    ),
    db: Session = Depends(get_db)
):

    estudiante = (
        db.query(
            Estudiante
        )
        .filter(
            Estudiante.id_estudiante ==
            id_estudiante,

            Estudiante.id_nivel ==
            profesor.id_nivel
        )
        .first()
    )

    if not estudiante:

        raise HTTPException(
            status_code=404,
            detail="Estudiante no encontrado"
        )

    evolucion = (
        obtener_evolucion_rendimiento(
            estudiante.id_estudiante,
            db
        )
    )

    return [

        EvolucionRendimientoOut(
            **item
        )

        for item in evolucion
    ]

