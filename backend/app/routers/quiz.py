from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from sqlalchemy.sql.expression import func

from app.database.database import get_db

from app.models.usuarios import Estudiante

from app.models.evaluaciones import (
    PreguntaCompetencia,
    ResultadoQuiz,
    ResultadoDetalle
)

from app.core.auth import (
    get_current_estudiante
)

from app.schemas.quiz import (
    GenerarQuizRequest,
    CalificarQuizRequest,
    PreguntaQuizOut,
    ResultadoQuizOut,
    ResponderPreguntaRequest,
    RespuestaPreguntaOut
)

from app.services.quiz_service import (
    evaluar_respuesta
)


router = APIRouter(
    prefix="/quiz",
    tags=["Quiz"]
)


# ==========================================
# GENERAR QUIZ
# ==========================================

@router.post(
    "/generar",
    response_model=list[PreguntaQuizOut]
)
def generar_quiz(
    data: GenerarQuizRequest,
    estudiante: Estudiante = Depends(
        get_current_estudiante
    ),
    db: Session = Depends(get_db)
):

    query = (
        db.query(
            PreguntaCompetencia
        )
        .filter(
            PreguntaCompetencia.id_nivel ==
            estudiante.id_nivel,

            PreguntaCompetencia.id_competencia ==
            data.id_competencia,

            PreguntaCompetencia.id_submodulo ==
            data.id_submodulo,

            PreguntaCompetencia.id_tema ==
            data.id_tema,

            PreguntaCompetencia.estado == True
        )
    )

    # ==========================================
    # FILTRO DE DIFICULTAD
    # ==========================================

    if data.dificultad != "Todas":

        query = query.filter(

            PreguntaCompetencia.dificultad
            ==
            data.dificultad

        )

    preguntas = (
        query
        .order_by(
            func.rand()
        )
        .limit(
            data.cantidad_preguntas
        )
        .all()
    )

    if not preguntas:

        raise HTTPException(
            status_code=404,
            detail="No existen preguntas disponibles"
        )

    return preguntas


# ==========================================
# CALIFICAR QUIZ
# ==========================================

@router.post(
    "/calificar",
    response_model=ResultadoQuizOut
)
def calificar_quiz(
    data: CalificarQuizRequest,
    estudiante: Estudiante = Depends(
        get_current_estudiante
    ),
    db: Session = Depends(get_db)
):

    if len(data.respuestas) == 0:

        raise HTTPException(
            status_code=400,
            detail="Debe enviar al menos una respuesta"
        )

    correctas = 0

    incorrectas = 0

    detalles_temporales = []

    for respuesta in data.respuestas:

        pregunta = (
            db.query(
                PreguntaCompetencia
            )
            .filter(
                PreguntaCompetencia.id_pregunta ==
                respuesta.pregunta_id
            )
            .first()
        )

        if not pregunta:

            raise HTTPException(
                status_code=404,
                detail=f"Pregunta {respuesta.pregunta_id} no encontrada"
            )

        if (
            pregunta.id_competencia
            != data.id_competencia
        ):
            continue

        if (
            pregunta.id_submodulo
            != data.id_submodulo
        ):
            continue

        if (
            pregunta.id_tema
            != data.id_tema
        ):
            continue

        es_correcta = (
            respuesta.respuesta.upper()
            ==
            pregunta.respuesta_correcta.upper()
        )

        if es_correcta:

            correctas += 1

        else:

            incorrectas += 1

        detalles_temporales.append(
            {
                "pregunta":
                pregunta,

                "respuesta_estudiante":
                respuesta.respuesta.upper(),

                "respuesta_correcta":
                pregunta.respuesta_correcta.upper(),

                "es_correcta":
                es_correcta
            }
        )

    total = correctas + incorrectas

    puntaje = (
        (correctas / total) * 100
        if total > 0
        else 0
    )

    # ==========================================
    # RETROALIMENTACIÓN
    # ==========================================

    if puntaje < 50:

        retroalimentacion = (
            "Existen aspectos por fortalecer. "
            "Continúa practicando y revisa los recursos disponibles."
        )

    elif puntaje < 75:

        retroalimentacion = (
            "Vas bien, pero existen aspectos por fortalecer."
        )

    else:

        retroalimentacion = (
            "Tienes una base sólida en este tema. Continúa así."
        )

    # ==========================================
    # DIAGNÓSTICO
    # ==========================================

    if data.id_submodulo == 1:

        retroalimentacion = (
            "Diagnóstico completado. "
            + retroalimentacion
        )

    # ==========================================
    # GUARDAR RESULTADO GENERAL
    # ==========================================

    resultado = ResultadoQuiz(

        id_estudiante=
        estudiante.id_estudiante,

        id_competencia=
        data.id_competencia,

        id_submodulo=
        data.id_submodulo,

        id_tema=
        data.id_tema,

        puntaje=
        round(puntaje, 2),

        correctas=
        correctas,

        incorrectas=
        incorrectas,

        total_preguntas=
        total,

        tiempo_segundos=
        0,

        intento=
        1,

        retroalimentacion=
        retroalimentacion
    )

    db.add(
        resultado
    )

    db.commit()

    db.refresh(
        resultado
    )

    # ==========================================
    # GUARDAR DETALLE DE RESPUESTAS
    # ==========================================

    for detalle in detalles_temporales:

        nuevo_detalle = ResultadoDetalle(

            id_resultado=
            resultado.id_resultado,

            id_pregunta=
            detalle["pregunta"].id_pregunta,

            id_competencia=
            detalle["pregunta"].id_competencia,

            id_tema=
            detalle["pregunta"].id_tema,

            respuesta_estudiante=
            detalle["respuesta_estudiante"],

            respuesta_correcta=
            detalle["respuesta_correcta"],

            es_correcta=
            detalle["es_correcta"]
        )

        db.add(
            nuevo_detalle
        )

    db.commit()

    # ==========================================
    # RESPUESTA
    # ==========================================

    return ResultadoQuizOut(

        puntaje=
        round(puntaje, 2),

        correctas=
        correctas,

        incorrectas=
        incorrectas,

        total_preguntas=
        total,

        retroalimentacion=
        retroalimentacion
    )
    
# ==========================================
# RESPONDER PREGUNTA
# ==========================================

@router.post(
    "/responder",
    response_model=RespuestaPreguntaOut
)
def responder_pregunta(
    datos: ResponderPreguntaRequest,
    estudiante: Estudiante = Depends(
        get_current_estudiante
    ),
    db: Session = Depends(get_db)
):

    return evaluar_respuesta(

        estudiante=
        estudiante,

        id_competencia=
        datos.id_competencia,

        id_submodulo=
        datos.id_submodulo,

        id_tema=
        datos.id_tema,

        id_pregunta=
        datos.id_pregunta,

        respuesta=
        datos.respuesta,

        usar_intento=
        datos.usar_intento,

        db=
        db
    )
    
