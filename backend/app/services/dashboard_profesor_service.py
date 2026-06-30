from sqlalchemy import func

from app.models.academico import Competencia

from sqlalchemy import desc

from sqlalchemy import case

from app.models.evaluaciones import (
    IntentoDetalle,
    IntentoQuiz,
    PreguntaCompetencia,
    ResultadoQuiz
)

from app.models.usuarios import (
    Profesor,
    Estudiante
)

# ==========================================
# RESUMEN DASHBOARD PROFESOR
# ==========================================

def obtener_resumen_dashboard_profesor(
    db,
    id_profesor:int
):

    profesor = (

        db.query(

            Profesor

        )

        .filter(

            Profesor.id_profesor == id_profesor

        )

        .first()

    )

    if not profesor:

        return None

    id_nivel = profesor.id_nivel

    # --------------------------------------
    # Total estudiantes del mismo nivel
    # --------------------------------------

    total_estudiantes = (

        db.query(

            func.count(

                Estudiante.id_estudiante

            )

        )

        .filter(

            Estudiante.id_nivel == id_nivel

        )

        .scalar()

    )

    # --------------------------------------
    # Total evaluaciones
    # --------------------------------------

    total_evaluaciones = (

        db.query(

            func.count(

                ResultadoQuiz.id_resultado

            )

        )

        .join(

            Estudiante,

            ResultadoQuiz.id_estudiante
            ==
            Estudiante.id_estudiante

        )

        .filter(

            Estudiante.id_nivel == id_nivel

        )

        .scalar()

    )

    # --------------------------------------
    # Precisión promedio
    # --------------------------------------

    promedio = (

        db.query(

            func.avg(

                ResultadoQuiz.porcentaje

            )

        )

        .join(

            Estudiante,

            ResultadoQuiz.id_estudiante
            ==
            Estudiante.id_estudiante

        )

        .filter(

            Estudiante.id_nivel == id_nivel

        )

        .scalar()

    )

    if promedio is None:

        promedio = 0

    # --------------------------------------
    # Competencia crítica
    # --------------------------------------

    competencia = (

        db.query(

            Competencia.nombre_competencia,

            func.avg(

                ResultadoQuiz.porcentaje

            ).label(

                "promedio"

            )

        )

        .join(

            ResultadoQuiz,

            Competencia.id_competencia
            ==
            ResultadoQuiz.id_competencia

        )

        .join(

            Estudiante,

            ResultadoQuiz.id_estudiante
            ==
            Estudiante.id_estudiante

        )

        .filter(

            Estudiante.id_nivel == id_nivel

        )

        .group_by(

            Competencia.nombre_competencia

        )

        .order_by(

            func.avg(

                ResultadoQuiz.porcentaje

            )

        )

        .first()

    )

    return {

        "estudiantes_activos":

            total_estudiantes,

        "evaluaciones":

            total_evaluaciones,

        "precision_promedio":

            round(

                promedio,

                1

            ),

        "competencia_critica":

            competencia.nombre_competencia

            if competencia

            else

            "Sin datos"

    }
    
# ==========================================
# RENDIMIENTO POR COMPETENCIA
# ==========================================

def obtener_rendimiento_competencias(
    db,
    id_profesor:int
):

    profesor = (

        db.query(Profesor)

        .filter(

            Profesor.id_profesor==id_profesor

        )

        .first()

    )

    if not profesor:

        return []

    datos = (

        db.query(

            Competencia.nombre_competencia,

            func.avg(

                ResultadoQuiz.porcentaje

            ).label(

                "promedio"

            )

        )

        .join(

            Competencia,

            Competencia.id_competencia
            ==
            ResultadoQuiz.id_competencia

        )

        .join(

            Estudiante,

            Estudiante.id_estudiante
            ==
            ResultadoQuiz.id_estudiante

        )

        .filter(

            Estudiante.id_nivel
            ==
            profesor.id_nivel

        )

        .group_by(

            Competencia.nombre_competencia

        )

        .order_by(

            Competencia.id_competencia

        )

        .all()

    )

    return [

        {

            "competencia":fila.nombre_competencia,

            "promedio":round(

                fila.promedio,

                1

            )

        }

        for fila in datos

    ]
    

# ==========================================
# PREGUNTAS CON MÁS ERRORES
# ==========================================

def obtener_preguntas_error(
    db,
    id_profesor: int
):

    profesor = (

        db.query(
            Profesor
        )

        .filter(

            Profesor.id_profesor
            ==
            id_profesor

        )

        .first()

    )

    if not profesor:

        return []

    datos = (

        db.query(

            PreguntaCompetencia.pregunta,

            func.count(
                IntentoDetalle.id_detalle
            ).label("total"),

            func.sum(

                case(

                    (

                        IntentoDetalle.es_correcta == False,

                        1

                    ),

                    else_=0

                )

            ).label("errores")

        )

        .join(

            PreguntaCompetencia,

            PreguntaCompetencia.id_pregunta
            ==
            IntentoDetalle.id_pregunta

        )

        .join(

            IntentoQuiz,

            IntentoQuiz.id_intento
            ==
            IntentoDetalle.id_intento

        )

        .join(

            Estudiante,

            Estudiante.id_estudiante
            ==
            IntentoQuiz.id_estudiante

        )

        .filter(

            Estudiante.id_nivel
            ==
            profesor.id_nivel

        )

        .group_by(

            PreguntaCompetencia.id_pregunta,

            PreguntaCompetencia.pregunta

        )

        .having(

            func.sum(

                case(

                    (

                        IntentoDetalle.es_correcta == False,

                        1

                    ),

                    else_=0

                )

            ) > 0

        )

        .all()

    )

    resultado = []

    for fila in datos:

        porcentaje = round(

            (fila.errores / fila.total) * 100,

            1

        )

        resultado.append({

            "pregunta": fila.pregunta,

            "errores": fila.errores,

            "intentos": fila.total,

            "porcentaje": porcentaje

        })

    resultado.sort(

        key=lambda x: x["porcentaje"],

        reverse=True

    )

    return resultado[:5]
    