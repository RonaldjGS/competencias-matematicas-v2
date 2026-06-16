from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from sqlalchemy import func

from app.database.database import get_db

from app.models.usuarios import (
    Estudiante,
    Profesor
)

from app.models.evaluaciones import (
    ResultadoQuiz,
    ResultadoDetalle
)

from app.core.auth import (
    get_current_estudiante,
    get_current_profesor
)

from app.models.academico import (
    Competencia,
    Tema
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
    obtener_estado_resultado,
    obtener_dashboard_profesor,
    obtener_recomendaciones,
    obtener_ranking_semanal,
    obtener_estudiantes_resumen
)

from datetime import datetime, timedelta

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

    resultados = (
        db.query(
            ResultadoQuiz,
            Tema.nombre_tema
        )
        .join(
            Tema,
            ResultadoQuiz.id_tema ==
            Tema.id_tema
        )
        .filter(
            ResultadoQuiz.id_estudiante ==
            id_estudiante
        )
        .order_by(
            ResultadoQuiz.fecha.desc()
        )
        .all()
    )

    respuesta = []

    for resultado, nombre_tema in resultados:

        estado = obtener_estado_resultado(
            resultado.puntaje
        )

        respuesta.append(

            HistorialEstudianteOut(

                id_resultado=
                resultado.id_resultado,

                fecha=
                resultado.fecha,

                tema=
                nombre_tema,

                puntaje=
                resultado.puntaje,

                correctas=
                resultado.correctas,

                total_preguntas=
                resultado.total_preguntas,

                tiempo_segundos=
                resultado.tiempo_segundos,

                estado=
                estado
            )
        )

    return respuesta

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

    competencias = (
        db.query(
            Competencia
        )
        .all()
    )

    respuesta = []

    for competencia in competencias:

        detalles = (
            db.query(
                ResultadoDetalle
            )
            .join(
                ResultadoQuiz,
                ResultadoDetalle.id_resultado
                ==
                ResultadoQuiz.id_resultado
            )
            .filter(
                ResultadoQuiz.id_estudiante
                ==
                estudiante.id_estudiante,

                ResultadoDetalle.id_competencia
                ==
                competencia.id_competencia
            )
            .all()
        )

        total = len(
            detalles
        )

        if total == 0:

            continue

        correctas = len(
            [
                d for d in detalles
                if d.es_correcta
            ]
        )

        porcentaje = round(
            (
                correctas / total
            ) * 100,
            2
        )

        respuesta.append(

            CompetenciaRendimientoOut(

                competencia=
                competencia.nombre_competencia,

                total_preguntas=
                total,

                correctas=
                correctas,

                porcentaje=
                porcentaje
            )
        )

    return respuesta

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

    resultados = (
        db.query(
            ResultadoQuiz
        )
        .filter(
            ResultadoQuiz.id_estudiante ==
            estudiante.id_estudiante
        )
        .order_by(
            ResultadoQuiz.fecha.asc()
        )
        .all()
    )

    respuesta = []

    for resultado in resultados:

        respuesta.append(

            EvolucionRendimientoOut(

                fecha=
                resultado.fecha,

                puntaje=
                resultado.puntaje
            )
        )

    return respuesta

