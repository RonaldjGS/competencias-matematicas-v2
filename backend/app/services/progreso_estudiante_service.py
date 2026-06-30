from sqlalchemy import func

from app.models.evaluaciones import ResultadoQuiz

from datetime import datetime,timedelta




def obtener_resumen_progreso(

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

    if total == 0:

        return {

            "promedio_general": None,

            "test_realizados": None,

            "precision_promedio": None,

            "tiempo_promedio": None

        }

    promedio = round(datos[1], 1)

    return {

        "promedio_general": promedio,

        "test_realizados": total,

        "precision_promedio": promedio,

        "tiempo_promedio": round(datos[2])

    }


