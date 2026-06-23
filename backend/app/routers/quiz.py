from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from sqlalchemy.sql.expression import func

from app.database.database import get_db

from app.models.usuarios import Estudiante

from app.models.estudiante_submodulo import EstudianteSubmodulo

from app.models.academico import Tema

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
    RespuestaPreguntaOut,
    EstadoIntentosOut,
    ConsultarIntentosRequest,
    FinalizarSubmoduloIn,
    TemaDisponibleOut
)

from app.services.quiz_service import (
    evaluar_respuesta,
    obtener_estado_intentos
)


from datetime import datetime


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
        data.tiempo_total,

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
            detalle["es_correcta"],
            
            tiempo_pregunta=
            detalle["tiempo_pregunta"]
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
        
        tiempo_segundos=
        data.tiempo_total,

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
    
# ==========================================
# ESTADO DE INTENTOS
# ==========================================

@router.post(
    "/intentos",
    response_model=EstadoIntentosOut
)
def consultar_intentos(
    datos: ConsultarIntentosRequest,
    estudiante: Estudiante = Depends(
        get_current_estudiante
    ),
    db: Session = Depends(get_db)
):

    return obtener_estado_intentos(

        id_estudiante=
        estudiante.id_estudiante,

        id_competencia=
        datos.id_competencia,

        id_submodulo=
        datos.id_submodulo,

        id_tema=
        datos.id_tema,

        db=
        db
    )
    
# ==========================================
# Submodulos Disponibles
# ==========================================

@router.get(
    "/submodulos-disponibles"
)
def obtener_submodulos_disponibles(
    id_estudiante: int,
    id_competencia: int,
    db: Session = Depends(get_db)
):

    diagnostico = True

    refuerzo = False

    fortalecimiento = False

    # --------------------------------------
    # Diagnóstico realizado
    # --------------------------------------

    diagnostico_realizado = (

        db.query(
            EstudianteSubmodulo
        )
        .filter(
            EstudianteSubmodulo.id_estudiante
            == id_estudiante,

            EstudianteSubmodulo.id_competencia
            == id_competencia,

            EstudianteSubmodulo.id_submodulo
            == 1,

            EstudianteSubmodulo.completado
            == True
        )
        .first()

    )

    if diagnostico_realizado:

        refuerzo = True

    # --------------------------------------
    # Refuerzo realizado
    # --------------------------------------

    refuerzo_realizado = (

        db.query(
            EstudianteSubmodulo
        )
        .filter(
            EstudianteSubmodulo.id_estudiante
            == id_estudiante,

            EstudianteSubmodulo.id_competencia
            == id_competencia,

            EstudianteSubmodulo.id_submodulo
            == 2,

            EstudianteSubmodulo.completado
            == True
        )
        .first()

    )

    if refuerzo_realizado:

        fortalecimiento = True

    return [

        {
            "id_submodulo": 1,
            "nombre_submodulo": "Diagnóstico",
            "estado": "disponible"
        },

        {
            "id_submodulo": 2,
            "nombre_submodulo": "Refuerzo",
            "estado": (
                "disponible"
                if refuerzo
                else "bloqueado"
            )
        },

        {
            "id_submodulo": 3,
            "nombre_submodulo": "Fortalecimiento",
            "estado": (
                "disponible"
                if fortalecimiento
                else "bloqueado"
            )
        }

    ]
    
# ==========================================
# Finalizar Submódulo
# ==========================================

@router.post(
    "/finalizar-submodulo"
)
def finalizar_submodulo(
    data: FinalizarSubmoduloIn,
    db: Session = Depends(get_db)
):

    registro = (

        db.query(
            EstudianteSubmodulo
        )
        .filter(

            EstudianteSubmodulo.id_estudiante
            == data.id_estudiante,

            EstudianteSubmodulo.id_competencia
            == data.id_competencia,

            EstudianteSubmodulo.id_submodulo
            == data.id_submodulo

        )
        .first()

    )

    if registro:

        return {

            "mensaje":
            "Submódulo ya completado"

        }

    nuevo = EstudianteSubmodulo(

        id_estudiante=
        data.id_estudiante,

        id_competencia=
        data.id_competencia,

        id_submodulo=
        data.id_submodulo,

        completado=True,

        fecha_completado=
        datetime.now()

    )

    db.add(
        nuevo
    )

    db.commit()

    db.refresh(
        nuevo
    )

    return {

        "mensaje":
        "Submódulo completado correctamente"

    }
    
    
# ==========================================
# TEMAS DISPONIBLES
# ==========================================

@router.get(
    "/temas-disponibles",
    response_model=list[TemaDisponibleOut]
)
def obtener_temas_disponibles(

    id_nivel: int,

    db: Session = Depends(get_db)

):

    return (

        db.query(
            Tema
        )

        .filter(
            Tema.id_nivel == id_nivel,
            Tema.estado == True
        )

        .all()

    )