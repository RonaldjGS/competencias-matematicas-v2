from sqlalchemy.orm import Session

from app.models.evaluaciones import (
    ResultadoQuiz,
    ResultadoDetalle
)

from app.models.academico import (
    Competencia,
    Tema
)

from datetime import (
    datetime,
    timedelta
)

from app.models.usuarios import (
    Estudiante
)

from sqlalchemy import func

# ==========================================
# DASHBOARD ESTUDIANTE
# ==========================================

def obtener_dashboard_estudiante(
    id_estudiante: int,
    db: Session
):

    resultados = (
        db.query(
            ResultadoQuiz
        )
        .filter(
            ResultadoQuiz.id_estudiante ==
            id_estudiante
        )
        .all()
    )

    if not resultados:

        return {
            "total_evaluaciones": 0,
            "promedio": 0,
            "mejor_puntaje": 0,
            "peor_puntaje": 0
        }

    total = len(resultados)

    promedio = round(
        sum(
            r.puntaje
            for r in resultados
        ) / total,
        2
    )

    return {

        "total_evaluaciones":
        total,

        "promedio":
        promedio,

        "mejor_puntaje":
        max(
            r.puntaje
            for r in resultados
        ),

        "peor_puntaje":
        min(
            r.puntaje
            for r in resultados
        )
    }
    
# ==========================================
# PERFIL ESTUDIANTE
# ==========================================

def obtener_perfil_estudiante(
    estudiante,
    db: Session
):

    resultados = (
        db.query(
            ResultadoQuiz
        )
        .filter(
            ResultadoQuiz.id_estudiante ==
            estudiante.id_estudiante
        )
        .all()
    )

    total = len(
        resultados
    )

    if total == 0:

        promedio = 0

        mejor = 0

        tiempo = 0

    else:

        promedio = round(
            sum(
                r.puntaje
                for r in resultados
            )
            / total,
            2
        )

        mejor = max(
            r.puntaje
            for r in resultados
        )

        tiempo = round(
            sum(
                r.tiempo_segundos
                for r in resultados
            )
            / total,
            2
        )

    return {

        "id_estudiante":
        estudiante.id_estudiante,

        "nombre_estudiante":
        estudiante.nombre_estudiante,

        "correo_estudiante":
        estudiante.correo_estudiante,

        "estado":
        estudiante.estado,

        "total_evaluaciones":
        total,

        "promedio_general":
        promedio,

        "mejor_puntaje":
        mejor,

        "tiempo_promedio":
        tiempo
    }
    
# ==========================================
# COMPETENCIA MÁS DÉBIL
# ==========================================

def obtener_competencia_debil(
    id_estudiante: int,
    db: Session
):

    resultado = (
        db.query(
            Competencia.nombre_competencia,
            func.count(
                ResultadoDetalle.id_detalle
            ).label("errores")
        )
        .join(
            ResultadoQuiz,
            ResultadoDetalle.id_resultado
            ==
            ResultadoQuiz.id_resultado
        )
        .join(
            Competencia,
            ResultadoDetalle.id_competencia
            ==
            Competencia.id_competencia
        )
        .filter(
            ResultadoQuiz.id_estudiante
            ==
            id_estudiante,

            ResultadoDetalle.es_correcta == False
        )
        .group_by(
            Competencia.id_competencia
        )
        .order_by(
            func.count(
                ResultadoDetalle.id_detalle
            ).desc()
        )
        .first()
    )

    if not resultado:

        return {
            "competencia": "Sin datos",
            "errores": 0,
            "porcentaje_error": 0
        }

    return {
        "competencia": resultado[0],
        "errores": resultado[1],
        "porcentaje_error": 0
    }
    
# ==========================================
# TEMA MÁS DÉBIL
# ==========================================

def obtener_tema_debil(
    id_estudiante: int,
    db: Session
):

    resultado = (
        db.query(
            Tema.nombre_tema,
            func.count(
                ResultadoDetalle.id_detalle
            ).label("errores")
        )
        .join(
            ResultadoQuiz,
            ResultadoDetalle.id_resultado
            ==
            ResultadoQuiz.id_resultado
        )
        .join(
            Tema,
            ResultadoDetalle.id_tema
            ==
            Tema.id_tema
        )
        .filter(
            ResultadoQuiz.id_estudiante
            ==
            id_estudiante,

            ResultadoDetalle.es_correcta == False
        )
        .group_by(
            Tema.id_tema
        )
        .order_by(
            func.count(
                ResultadoDetalle.id_detalle
            ).desc()
        )
        .first()
    )

    if not resultado:

        return {
            "tema": "Sin datos",
            "errores": 0,
            "porcentaje_error": 0
        }

    return {
        "tema": resultado[0],
        "errores": resultado[1],
        "porcentaje_error": 0
    }
    
# ==========================================
# ESTADO DEL RESULTADO
# ==========================================

def obtener_estado_resultado(
    puntaje: float
):

    if puntaje >= 90:
        return "Excelente"

    if puntaje >= 75:
        return "Bueno"

    if puntaje >= 50:
        return "Regular"

    return "Reforzar"
    
# ==========================================
# RETROALIMENTACIÓN
# ==========================================

def obtener_retroalimentacion(
    puntaje: float
):

    if puntaje < 50:

        return (
            "Existen aspectos por fortalecer. "
            "Continúa practicando."
        )

    if puntaje < 75:

        return (
            "Vas bien, pero existen aspectos por fortalecer."
        )

    return (
        "Tienes una base sólida en este tema."
    )
    
# ==========================================
# DASHBOARD PROFESOR
# ==========================================

from app.models.usuarios import (
    Estudiante
)

def obtener_dashboard_profesor(
    id_nivel: int,
    db: Session
):

    total_estudiantes = (
        db.query(
            Estudiante
        )
        .filter(
            Estudiante.id_nivel ==
            id_nivel
        )
        .count()
    )

    resultados = (
        db.query(
            ResultadoQuiz
        )
        .join(
            Estudiante,
            ResultadoQuiz.id_estudiante
            ==
            Estudiante.id_estudiante
        )
        .filter(
            Estudiante.id_nivel ==
            id_nivel
        )
        .all()
    )

    total_evaluaciones = len(
        resultados
    )

    if total_evaluaciones == 0:

        promedio_general = 0

        aprobados = 0

        reprobados = 0

    else:

        promedio_general = round(
            sum(
                r.puntaje
                for r in resultados
            )
            /
            total_evaluaciones,
            2
        )

        aprobados = len(
            [
                r
                for r in resultados
                if r.puntaje >= 70
            ]
        )

        reprobados = len(
            [
                r
                for r in resultados
                if r.puntaje < 70
            ]
        )

    return {

        "total_estudiantes":
        total_estudiantes,

        "total_evaluaciones":
        total_evaluaciones,

        "promedio_general":
        promedio_general,

        "aprobados":
        aprobados,

        "reprobados":
        reprobados
    }
    
# ==========================================
# RECOMENDACIONES
# ==========================================

def obtener_recomendaciones(
    id_estudiante: int,
    db: Session
):

    temas = (
        db.query(
            Tema.nombre_tema,
            func.count(
                ResultadoDetalle.id_detalle
            ).label("errores")
        )
        .join(
            ResultadoQuiz,
            ResultadoDetalle.id_resultado
            ==
            ResultadoQuiz.id_resultado
        )
        .join(
            Tema,
            ResultadoDetalle.id_tema
            ==
            Tema.id_tema
        )
        .filter(
            ResultadoQuiz.id_estudiante
            ==
            id_estudiante,

            ResultadoDetalle.es_correcta == False
        )
        .group_by(
            Tema.id_tema
        )
        .order_by(
            func.count(
                ResultadoDetalle.id_detalle
            ).desc()
        )
        .limit(3)
        .all()
    )

    respuesta = []

    for tema in temas:

        errores = tema[1]

        if errores >= 10:

            motivo = (
                "Requiere reforzamiento prioritario."
            )

        elif errores >= 5:

            motivo = (
                "Necesita práctica adicional."
            )

        else:

            motivo = (
                "Mantener seguimiento."
            )

        respuesta.append({

            "tema":
            tema[0],

            "motivo":
            motivo
        })

    return respuesta

# ==========================================
# RANKING SEMANAL
# ==========================================

def obtener_ranking_semanal(
    db: Session
):

    hace_7_dias = (
        datetime.now()
        - timedelta(days=7)
    )

    ranking = (
        db.query(
            Estudiante.nombre_estudiante,
            func.avg(
                ResultadoQuiz.puntaje
            ).label(
                "promedio"
            )
        )
        .join(
            Estudiante,
            ResultadoQuiz.id_estudiante
            ==
            Estudiante.id_estudiante
        )
        .filter(
            ResultadoQuiz.fecha >=
            hace_7_dias
        )
        .group_by(
            Estudiante.id_estudiante
        )
        .order_by(
            func.avg(
                ResultadoQuiz.puntaje
            ).desc()
        )
        .all()
    )

    respuesta = []

    puesto = 1

    for estudiante in ranking:

        respuesta.append({

            "puesto":
            puesto,

            "estudiante":
            estudiante.nombre_estudiante,

            "promedio":
            round(
                estudiante.promedio,
                2
            )
        })

        puesto += 1

    return respuesta

# ==========================================
# LISTAR ESTUDIANTES
# ==========================================

def obtener_estudiantes_resumen(
    id_nivel: int,
    db: Session
):

    estudiantes = (
        db.query(
            Estudiante
        )
        .filter(
            Estudiante.id_nivel ==
            id_nivel
        )
        .all()
    )

    respuesta = []

    for estudiante in estudiantes:

        resultados = (
            db.query(
                ResultadoQuiz
            )
            .filter(
                ResultadoQuiz.id_estudiante ==
                estudiante.id_estudiante
            )
            .all()
        )

        if resultados:

            promedio = round(
                sum(
                    r.puntaje
                    for r in resultados
                )
                /
                len(resultados),
                2
            )

            mejor_puntaje = max(
                r.puntaje
                for r in resultados
            )

            evaluaciones = len(
                resultados
            )

        else:

            promedio = 0

            mejor_puntaje = 0

            evaluaciones = 0

        respuesta.append({

            "id_estudiante":
            estudiante.id_estudiante,

            "nombre_estudiante":
            estudiante.nombre_estudiante,

            "correo_estudiante":
            estudiante.correo_estudiante,

            "promedio":
            promedio,

            "evaluaciones":
            evaluaciones,

            "mejor_puntaje":
            mejor_puntaje,

            "estado":
            estudiante.estado
        })

    return respuesta

# ==========================================
# HISTORIAL DEL ESTUDIANTE
# ==========================================

def obtener_historial_estudiante(
    id_estudiante: int,
    db: Session
):

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

        respuesta.append({

            "id_resultado":
            resultado.id_resultado,

            "fecha":
            resultado.fecha,

            "tema":
            nombre_tema,

            "puntaje":
            resultado.puntaje,

            "correctas":
            resultado.correctas,

            "total_preguntas":
            resultado.total_preguntas,

            "tiempo_segundos":
            resultado.tiempo_segundos,

            "estado":
            estado
        })

    return respuesta

# ==========================================
# RENDIMIENTO POR COMPETENCIA
# ==========================================

def obtener_rendimiento_competencias(
    id_estudiante: int,
    db: Session
):

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
                id_estudiante,

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

        respuesta.append({

            "competencia":
            competencia.nombre_competencia,

            "total_preguntas":
            total,

            "correctas":
            correctas,

            "porcentaje":
            porcentaje
        })

    return respuesta

# ==========================================
# EVOLUCIÓN DEL RENDIMIENTO
# ==========================================

def obtener_evolucion_rendimiento(
    id_estudiante: int,
    db: Session
):

    resultados = (
        db.query(
            ResultadoQuiz
        )
        .filter(
            ResultadoQuiz.id_estudiante ==
            id_estudiante
        )
        .order_by(
            ResultadoQuiz.fecha.asc()
        )
        .all()
    )

    respuesta = []

    for resultado in resultados:

        respuesta.append({

            "fecha":
            resultado.fecha,

            "puntaje":
            resultado.puntaje
        })

    return respuesta

