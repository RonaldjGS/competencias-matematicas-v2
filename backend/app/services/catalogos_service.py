from sqlalchemy.orm import Session

from sqlalchemy import func

from app.models.academico import (
    Competencia,
    Submodulo,
    Tema
)

from app.models.catalogos import (
    NivelEducativo,
    Carrera,
    TipoInstitucion,
    Provincia,
    Ciudad
)

from app.models.evaluaciones import ResultadoQuiz



def obtener_submodulos_competencia(
    db:Session,
    id_competencia:int
):

    datos=(

        db.query(
            Submodulo
        )

        .filter(
            Submodulo.id_competencia==
            id_competencia
        )

        .order_by(
            Submodulo.nombre_submodulo
        )

        .all()

    )

    return [

        {
            "id_submodulo":x.id_submodulo,
            "nombre_submodulo":x.nombre_submodulo
        }

        for x in datos

    ]
    
    
def obtener_evolucion_rendimiento(
    db: Session,
    id_estudiante: int
):

    resultados = (

        db.query(

            ResultadoQuiz.id_intento,

            ResultadoQuiz.fecha,

            ResultadoQuiz.porcentaje

        )

        .filter(

            ResultadoQuiz.id_estudiante == id_estudiante

        )

        .order_by(

            ResultadoQuiz.fecha.asc()

        )

        .all()

    )

    return [

        {

            "id_intento": r.id_intento,

            "fecha": r.fecha.strftime("%d/%m/%Y"),

            "porcentaje": round(r.porcentaje,2)

        }

        for r in resultados

    ]
    