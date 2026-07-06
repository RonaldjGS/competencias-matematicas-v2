from sqlalchemy import func

from app.models.academico import Competencia

from app.models.academico import Submodulo

from app.models.academico import Tema

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


# ==========================================
# PRECISIÓN POR DIFICULTAD
# ==========================================

def obtener_precision_dificultad(
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

        return []

    datos = (

        db.query(

            ResultadoQuiz.dificultad,

            func.avg(

                ResultadoQuiz.porcentaje

            ).label(

                "promedio"

            )

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

            ResultadoQuiz.dificultad

        )

        .all()

    )

    return [

        {

            "dificultad": fila.dificultad,

            "promedio": round(

                fila.promedio,

                1

            )

        }

        for fila in datos

    ]

# ==========================================
# RENDIMIENTO POR SUBMÓDULO
# ==========================================

def obtener_rendimiento_submodulos(
    db,
    id_profesor:int
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

            Submodulo.nombre_submodulo,

            func.avg(

                ResultadoQuiz.porcentaje

            ).label(

                "promedio"

            )

        )

        .join(

            ResultadoQuiz,

            ResultadoQuiz.id_submodulo
            ==
            Submodulo.id_submodulo

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

            Submodulo.nombre_submodulo

        )

        .order_by(

            Submodulo.id_submodulo

        )

        .all()

    )

    return [

        {

            "submodulo": fila.nombre_submodulo,

            "promedio": round(

                fila.promedio,

                1

            )

        }

        for fila in datos

    ]
    
# ==========================================
# RENDIMIENTO POR TEMAS
# ==========================================

def obtener_rendimiento_temas(
    db,
    id_profesor:int
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

            Tema.nombre_tema,

            func.avg(

                ResultadoQuiz.porcentaje

            ).label(

                "promedio"

            )

        )

        .join(

            ResultadoQuiz,

            ResultadoQuiz.id_tema
            ==
            Tema.id_tema

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

            Tema.nombre_tema

        )

        .order_by(

            func.avg(

                ResultadoQuiz.porcentaje

            ).desc()

        )

        .all()

    )

    return [

        {

            "tema":fila.nombre_tema,

            "promedio":round(

                fila.promedio,

                1

            )

        }

        for fila in datos

    ]
    
# ==========================================
# ACTIVIDAD RECIENTE
# ==========================================

def obtener_actividad_reciente(
    db,
    id_profesor:int
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

    actividades = (

        db.query(

            Estudiante.nombre_estudiante,

            Competencia.nombre_competencia,

            Submodulo.nombre_submodulo,

            Tema.nombre_tema,

            ResultadoQuiz.porcentaje,

            ResultadoQuiz.nivel_desempeno,

            ResultadoQuiz.fecha

        )

        .join(

            Estudiante,

            Estudiante.id_estudiante
            ==
            ResultadoQuiz.id_estudiante

        )

        .join(

            Competencia,

            Competencia.id_competencia
            ==
            ResultadoQuiz.id_competencia

        )

        .join(

            Submodulo,

            Submodulo.id_submodulo
            ==
            ResultadoQuiz.id_submodulo

        )

        .join(

            Tema,

            Tema.id_tema
            ==
            ResultadoQuiz.id_tema

        )

        .filter(

            Estudiante.id_nivel
            ==
            profesor.id_nivel

        )

        .order_by(

            ResultadoQuiz.fecha.desc()

        )

        .limit(20)

        .all()

    )

    return [

        {

            "estudiante":fila.nombre_estudiante,

            "competencia":fila.nombre_competencia,

            "submodulo":fila.nombre_submodulo,

            "tema":fila.nombre_tema,

            "porcentaje":round(

                fila.porcentaje,

                1

            ),

            "nivel":fila.nivel_desempeno,

            "fecha":fila.fecha

        }

        for fila in actividades

    ]