from sqlalchemy import func

from app.models.evaluaciones import ResultadoQuiz

from app.models.usuarios import Estudiante

from datetime import datetime, timedelta

from app.models.academico import (

    Tema,

    Competencia,

    Submodulo

)

from sqlalchemy import desc

from app.models.evaluaciones import PreguntaCompetencia





def obtener_resumen_dashboard(
    db,
    id_estudiante: int
):
    
    

    datos = (
        
        
        db.query(

            func.count(ResultadoQuiz.id_resultado),

            func.avg(ResultadoQuiz.porcentaje),

            func.avg(ResultadoQuiz.tiempo_segundos)

        )
        .filter(

            ResultadoQuiz.id_estudiante == id_estudiante

        )
        .first()
    )

    total = datos[0]
    total_ejercicios = total * 10

    if total == 0:

        return {

            "ejercicios_completados": None,

            "porcentaje_aciertos": None,

            "tiempo_promedio": None,

            "evaluaciones_realizadas": None

        }

    return {

        "ejercicios_completados": total_ejercicios,

        "porcentaje_aciertos": round(datos[1], 1),

        "tiempo_promedio": round(datos[2]),

        "evaluaciones_realizadas": total

    }
    
# ==========================================
# RENDIMIENTO POR TEMA
# ==========================================

def obtener_rendimiento_temas(

    db,
    id_estudiante:int

):

    datos = (

        db.query(

            Tema.nombre_tema,

            func.avg(
                ResultadoQuiz.porcentaje
            ).label("promedio")

        )

        .join(

            ResultadoQuiz,

            ResultadoQuiz.id_tema == Tema.id_tema

        )

        .filter(

            ResultadoQuiz.id_estudiante == id_estudiante

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

            "tema": d[0],

            "promedio": round(d[1],1)

        }

        for d in datos

    ]
    
# ==========================================
# EVOLUCIÓN DEL RENDIMIENTO
# ==========================================

def obtener_evolucion_rendimiento(

    db,
    id_estudiante:int,
    dias:int=7

):

    fecha_inicio = (

        datetime.now()

        - timedelta(days=dias)

    )

    datos=(

        db.query(

            func.date(ResultadoQuiz.fecha).label("fecha"),

            func.avg(ResultadoQuiz.porcentaje).label("promedio")

        )

        .filter(

            ResultadoQuiz.id_estudiante==id_estudiante,

            ResultadoQuiz.fecha>=fecha_inicio

        )

        .group_by(

            func.date(ResultadoQuiz.fecha)

        )

        .order_by(

            func.date(ResultadoQuiz.fecha)

        )

        .all()

    )

    return [

        {

            "fecha": str(fila.fecha),

            "promedio": round(

                fila.promedio,

                1

            )

        }

        for fila in datos

    ]
    
# ==========================================
# RENDIMIENTO POR COMPETENCIA
# ==========================================

from app.models.academico import Competencia


def obtener_rendimiento_competencias(

    db,
    id_estudiante:int

):

    datos = (

        db.query(

            Competencia.nombre_competencia,

            func.avg(

                ResultadoQuiz.porcentaje

            ).label("promedio")

        )

        .join(

            Competencia,

            ResultadoQuiz.id_competencia
            ==
            Competencia.id_competencia

        )

        .filter(

            ResultadoQuiz.id_estudiante
            ==
            id_estudiante

        )

        .group_by(

            Competencia.nombre_competencia

        )

        .all()

    )

    return [

        {

            "competencia": fila.nombre_competencia,

            "promedio": round(

                fila.promedio,

                1

            )

        }

        for fila in datos

    ]
    
    
def obtener_rendimiento_submodulos(

    db,
    id_estudiante:int

):

    datos = (

        db.query(

            Submodulo.nombre_submodulo,

            func.avg(

                ResultadoQuiz.porcentaje

            ).label("promedio")

        )

        .join(

            Submodulo,

            ResultadoQuiz.id_submodulo
            ==
            Submodulo.id_submodulo

        )

        .filter(

            ResultadoQuiz.id_estudiante
            ==
            id_estudiante

        )

        .group_by(

            Submodulo.nombre_submodulo

        )

        .order_by(

            Submodulo.nombre_submodulo

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
    
    
    
def obtener_ranking_semanal(
    db,
    id_estudiante: int
):

    # ==========================================
    # SEMANA ACTUAL (Lunes 00:00 hasta Lunes siguiente)
    # ==========================================

    hoy = datetime.now()

    inicio_semana = hoy - timedelta(days=hoy.weekday())

    inicio_semana = inicio_semana.replace(

        hour=0,

        minute=0,

        second=0,

        microsecond=0

    )

    fin_semana = inicio_semana + timedelta(days=7)

    # ==========================================
    # OBTENER NIVEL DEL ESTUDIANTE
    # ==========================================

    estudiante = (

        db.query(Estudiante)

        .filter(

            Estudiante.id_estudiante == id_estudiante

        )

        .first()

    )

    if not estudiante:

        return {

            "top": [],

            "mi_posicion": 0

        }

    # ==========================================
    # RANKING SEMANAL
    # ==========================================

    ranking = (

        db.query(

            ResultadoQuiz.id_estudiante,

            Estudiante.nombre_estudiante,

            func.sum(

                ResultadoQuiz.puntaje

            ).label("puntaje"),

            func.avg(

                ResultadoQuiz.porcentaje

            ).label("porcentaje")

        )

        .join(

            Estudiante,

            ResultadoQuiz.id_estudiante
            ==
            Estudiante.id_estudiante

        )

        .filter(

            Estudiante.id_nivel
            ==
            estudiante.id_nivel

        )

        .filter(

            ResultadoQuiz.fecha >= inicio_semana

        )

        .filter(

            ResultadoQuiz.fecha < fin_semana

        )

        .group_by(

            ResultadoQuiz.id_estudiante,

            Estudiante.nombre_estudiante

        )

        .order_by(

            func.sum(

                ResultadoQuiz.puntaje

            ).desc()

        )

        .all()

    )

    # ==========================================
    # TOP 5 Y POSICIÓN DEL ESTUDIANTE
    # ==========================================

    top = []

    mi_posicion = 0

    for i, fila in enumerate(ranking):

        if fila.id_estudiante == id_estudiante:

            mi_posicion = i + 1

        if i < 5:

            top.append({

                "posicion": i + 1,

                "id_estudiante": fila.id_estudiante,

                "nombre": fila.nombre_estudiante,

                "puntaje": round(

                    fila.puntaje,

                    2

                ),

                "porcentaje": round(

                    fila.porcentaje,

                    1

                )

            })

    return {

        "top": top,

        "mi_posicion": mi_posicion

    }
    
def obtener_actividad_reciente(
    db,
    id_estudiante: int
):

    actividades = (

        db.query(

            Tema.nombre_tema,

            ResultadoQuiz.porcentaje,

            ResultadoQuiz.nivel_desempeno,

            ResultadoQuiz.fecha

        )

        .join(

            Tema,

            ResultadoQuiz.id_tema == Tema.id_tema

        )

        .filter(

            ResultadoQuiz.id_estudiante == id_estudiante

        )

        .order_by(

            ResultadoQuiz.fecha.desc()

        )

        .limit(5)

        .all()

    )

    return {

        "actividades": [

            {

                "titulo": fila.nombre_tema,

                "porcentaje": round(

                    fila.porcentaje,

                    1

                ),

                "nivel": fila.nivel_desempeno,

                "fecha": fila.fecha

            }

            for fila in actividades

        ]

    }
    
# ==========================================
# RENDIMIENTO POR DIFICULTAD
# ==========================================

def obtener_rendimiento_dificultad(

    db,
    id_estudiante: int,
    id_competencia=None,
    id_submodulo=None,
    id_tema=None

):

    consulta = (

        db.query(

            ResultadoQuiz.dificultad,

            func.avg(
                ResultadoQuiz.porcentaje
            ).label("promedio")

        )

        .filter(

            ResultadoQuiz.id_estudiante == id_estudiante

        )

    )

    # ======================================
    # FILTROS OPCIONALES
    # ======================================

    if id_competencia:

        consulta = consulta.filter(

            ResultadoQuiz.id_competencia == id_competencia

        )

    if id_submodulo:

        consulta = consulta.filter(

            ResultadoQuiz.id_submodulo == id_submodulo

        )

    if id_tema:

        consulta = consulta.filter(

            ResultadoQuiz.id_tema == id_tema

        )

    # ======================================

    datos = (

        consulta

        .group_by(

            ResultadoQuiz.dificultad

        )

        .order_by(

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
# HISTORIAL COMPLETO DEL ESTUDIANTE
# ==========================================

def obtener_historial_completo(

    db,
    id_estudiante:int

):

    resultados = (

        db.query(

            ResultadoQuiz,

            Tema.nombre_tema,

            Competencia.nombre_competencia,

            Submodulo.nombre_submodulo

        )

        .join(

            Tema,

            ResultadoQuiz.id_tema ==
            Tema.id_tema

        )

        .join(

            Competencia,

            ResultadoQuiz.id_competencia ==
            Competencia.id_competencia

        )

        .join(

            Submodulo,

            ResultadoQuiz.id_submodulo ==
            Submodulo.id_submodulo

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

    historial=[]

    for resultado,tema,competencia,submodulo in resultados:

        historial.append({

            "tema":tema,

            "competencia":competencia,

            "submodulo":submodulo,

            "dificultad":resultado.dificultad,

            "correctas":resultado.correctas,

            "total":resultado.total_preguntas,

            "porcentaje":round(

                resultado.porcentaje,

                1

            ),

            "tiempo":resultado.tiempo_segundos,

            "nivel":resultado.nivel_desempeno,

            "fecha":resultado.fecha

        })

    return historial
