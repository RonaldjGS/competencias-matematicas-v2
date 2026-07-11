from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

import random

from sqlalchemy.orm import Session

from sqlalchemy.sql.expression import func

from app.database.database import get_db

from app.models.usuarios import Estudiante

from app.models.estudiante_submodulo import EstudianteSubmodulo

from app.models.evaluaciones import IntentoDetalle

from app.models.academico import Tema

from app.models.evaluaciones import (
    PreguntaCompetencia,
    ResultadoQuiz,
    ResultadoDetalle
)

from app.services.configuracion_quiz_service import ConfiguracionQuizService

from app.core.auth import (
    get_current_estudiante
)

from app.schemas.quiz import (
    GenerarQuizRequest,
    CalificarQuizRequest,
    PreguntaQuizOut,
    ResultadoQuizBasicoOut,
    ResumenQuizOut,
    ResponderPreguntaRequest,
    RespuestaPreguntaOut,
    EstadoIntentosOut,
    ConsultarIntentosRequest,
    FinalizarSubmoduloIn,
    TemaDisponibleOut,
    QuizGeneradoOut,
    ReintentarPreguntaRequest,
    ContinuarPreguntaRequest,
    RespuestaReintentoOut,
    FinalizarQuizOut,
    FinalizarQuizRequest,
    EstadisticasTemaOut,
)

from app.services.quiz_service import (
    validar_respuesta,
    obtener_estado_intentos,
    consumir_intento,
    mostrar_solucion,
    crear_intento,
    construir_preguntas_quiz,
)

from app.services.resultados_service import (

    guardar_resultado_quiz,
    
    obtener_resumen_quiz

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
    response_model=QuizGeneradoOut
    
    
)
def generar_quiz(
    data: GenerarQuizRequest,
    estudiante: Estudiante = Depends(
        get_current_estudiante
    ),
    db: Session = Depends(get_db)
):
    
    # ==========================================
    # OBTENER CONFIGURACIÓN DEL PROFESOR
    # ==========================================

    configuracion = ConfiguracionQuizService.obtener_configuracion_estudiante(

        db=db,

        id_competencia=data.id_competencia,

        id_submodulo=data.id_submodulo,

        id_tema=data.id_tema,

        dificultad=data.dificultad

    )
    # ==========================================
    # VALORES DEL QUIZ
    # ==========================================

    cantidad_preguntas = 10

    tiempo_minutos = 20

    intentos = 3

    mezclar_preguntas = True

    mezclar_opciones = True

    mostrar_resultado = True

    if configuracion:

        cantidad_preguntas = configuracion.cantidad_preguntas

        tiempo_minutos = configuracion.tiempo_minutos

        intentos = configuracion.intentos

        mezclar_preguntas = configuracion.mezclar_preguntas

        mezclar_opciones = configuracion.mezclar_opciones

        mostrar_resultado = configuracion.mostrar_resultado
    
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

    if mezclar_preguntas:

        query = query.order_by(func.rand())

    else:

        query = query.order_by(

            PreguntaCompetencia.id_pregunta

        )

    preguntas = (

        query

        .limit(cantidad_preguntas)

        .all()

    )

    preguntas = construir_preguntas_quiz(

        preguntas,

        mezclar_opciones

    )
    

    if not preguntas:

        raise HTTPException(
            status_code=404,
            detail="No existen preguntas disponibles"
        )
        
    # ==========================================
    # TIEMPO TOTAL DEL QUIZ
    # ==========================================

        
    tiempo_total = tiempo_minutos * 60
        
    
    nuevo_intento = crear_intento(

        id_estudiante=
        estudiante.id_estudiante,

        id_competencia=
        data.id_competencia,

        id_submodulo=
        data.id_submodulo,

        id_tema=
        data.id_tema,
        
        dificultad=
        data.dificultad,
        
        max_intentos=intentos,

        db=db

    )
    
    # ==========================================
    # CREAR DETALLE DEL QUIZ
    # ==========================================

    for indice, pregunta in enumerate(preguntas):

        detalle = IntentoDetalle(

            id_intento=nuevo_intento.id_intento,

            id_pregunta=pregunta.id_pregunta,

            numero_pregunta=indice + 1,

            respuesta_estudiante="-",

            es_correcta=False,

            tiempo_respuesta=0,

            opcion_fallida=None,

            respuesta_correcta_quiz=
                pregunta.respuesta_correcta_quiz,

            opcion_a_quiz=
                pregunta.opcion_a,

            opcion_b_quiz=
                pregunta.opcion_b,

            opcion_c_quiz=
                pregunta.opcion_c,

            opcion_d_quiz=
                pregunta.opcion_d

        )

        db.add(detalle)

    db.commit()

    # ==========================================
    # RESPUESTA PARA EL FRONT
    # ==========================================

    preguntas_front = []

    for pregunta in preguntas:

        preguntas_front.append({

            "id_pregunta": pregunta.id_pregunta,

            "pregunta": pregunta.pregunta,

            "opciones": [

                {
                    "letra": "A",
                    "texto": pregunta.opcion_a
                },

                {
                    "letra": "B",
                    "texto": pregunta.opcion_b
                },

                {
                    "letra": "C",
                    "texto": pregunta.opcion_c
                },

                {
                    "letra": "D",
                    "texto": pregunta.opcion_d
                }

            ],

            "dificultad": pregunta.dificultad

        })

    return QuizGeneradoOut(

        id_intento=
        nuevo_intento.id_intento,

        preguntas=
        preguntas_front,

        tiempo_segundos=
        tiempo_total,

        max_intentos=
        intentos,

        mostrar_resultado=
        mostrar_resultado,

        mezclar_preguntas=
        mezclar_preguntas,

        mezclar_opciones=
        mezclar_opciones

    )


# ==========================================
# CALIFICAR QUIZ
# ==========================================

@router.post(
    "/calificar",
    response_model=ResultadoQuizBasicoOut
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

    return ResultadoQuizBasicoOut(

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

    db: Session = Depends(get_db)

):

    return validar_respuesta(

        id_intento=
        datos.id_intento,

        id_pregunta=
        datos.id_pregunta,

        respuesta=
        datos.respuesta,

        numero_pregunta=
        datos.numero_pregunta,

        tiempo_respuesta=
        datos.tiempo_respuesta,

        db=db

    )
    
# ==========================================
# Reintentar PREGUNTA
# ==========================================    

@router.post(
    "/reintentar",
    response_model=RespuestaReintentoOut
)
def reintentar_pregunta(

    datos: ReintentarPreguntaRequest,

    db: Session = Depends(get_db)

):

    return consumir_intento(

        id_intento=
        datos.id_intento,

        id_pregunta=
        datos.id_pregunta,

        respuesta=
        datos.respuesta,

        numero_pregunta=
        datos.numero_pregunta,

        tiempo_respuesta=
        datos.tiempo_respuesta,

        db=db

    )
    
# ==========================================
# Continuar PREGUNTA
# ==========================================    
    

@router.post(
    "/continuar",
    response_model=RespuestaPreguntaOut
)
def continuar_pregunta(

    datos: ContinuarPreguntaRequest,

    db: Session = Depends(get_db)

):

    return mostrar_solucion(

        id_intento=
        datos.id_intento,

        id_pregunta=
        datos.id_pregunta,

        numero_pregunta=
        datos.numero_pregunta,

        tiempo_respuesta=
        datos.tiempo_respuesta,

        db=db

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

        dificultad=
        datos.dificultad,

        db=db

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
    id_estudiante: int,
    id_competencia: int,
    id_submodulo: int,

    db: Session = Depends(get_db)

):

    temas = (

        db.query(Tema)

        .filter(

            Tema.id_nivel == id_nivel,
            Tema.estado == True

        )

        .all()

    )

    respuesta = []

    for tema in temas:

        ultimo = (

            db.query(ResultadoQuiz)

            .filter(

                ResultadoQuiz.id_estudiante == id_estudiante,

                ResultadoQuiz.id_competencia == id_competencia,

                ResultadoQuiz.id_submodulo == id_submodulo,

                ResultadoQuiz.id_tema == tema.id_tema

            )

            .order_by(

                ResultadoQuiz.fecha.desc()

            )

            .first()

        )

        respuesta.append({

            "id_tema": tema.id_tema,

            "nombre_tema": tema.nombre_tema,

            "descripcion_tema": tema.descripcion_tema,

            "ultimo_resultado":

                ultimo.porcentaje
                if ultimo else None,

            "fecha":

                ultimo.fecha.strftime("%d/%m/%Y")
                if ultimo else None

        })
        
    print(respuesta)

    return respuesta


# ==========================================
# ESTADÍSTICAS DEL TEMA
# ==========================================

@router.get(
    "/estadisticas-tema",
    response_model=EstadisticasTemaOut
)
def obtener_estadisticas_tema(

    id_estudiante: int,

    id_competencia: int,

    id_submodulo: int,

    id_tema: int,

    db: Session = Depends(get_db)

):

    resultados = (

        db.query(ResultadoQuiz)

        .filter(

            ResultadoQuiz.id_estudiante == id_estudiante,

            ResultadoQuiz.id_competencia == id_competencia,

            ResultadoQuiz.id_submodulo == id_submodulo,

            ResultadoQuiz.id_tema == id_tema

        )

        .all()

    )

    if not resultados:

        return {

            "precision_promedio": None,

            "intentos_realizados": 0,

            "tiempo_promedio": None

        }

    precision = (

        sum(r.porcentaje for r in resultados)

        / len(resultados)

    )

    tiempo = (

        sum(r.tiempo_segundos for r in resultados)

        / len(resultados)

    )

    return {

        "precision_promedio": round(precision, 1),

        "intentos_realizados": len(resultados),

        "tiempo_promedio": int(tiempo)

    }
    
    
# ==========================================
# FINALIZAR QUIZ
# ==========================================

@router.post(

    "/finalizar",

    response_model=FinalizarQuizOut

)

def finalizar_quiz(

    datos: FinalizarQuizRequest,

    db: Session = Depends(get_db)

):

    resultado = guardar_resultado_quiz(

        id_intento=
        datos.id_intento,

        tiempo_total=
        datos.tiempo_total,

        db=db

    )

    return {

        "id_resultado":

        resultado.id_resultado

    }
    
# ==========================================
# OBTENER RESUMEN DEL QUIZ
# ==========================================

@router.get(

    "/resultado/{id_resultado}",

    response_model=ResumenQuizOut

)

def obtener_resultado_quiz(

    id_resultado: int,

    db: Session = Depends(get_db)

):

    resultado = obtener_resumen_quiz(

        id_resultado=id_resultado,

        db=db

    )

    if not resultado:

        raise HTTPException(

            status_code=404,

            detail="Resultado no encontrado"

        )

    return resultado


#@router.get(
 #   "/quiz-estudiante",
  #  response_model=ConfiguracionQuizResponse | None
#)
#def obtener_configuracion_estudiante(
#    id_competencia: int,
#    id_submodulo: int,
#    id_tema: int,
#    dificultad: str,
#    db: Session = Depends(get_db)
#):

#    return ConfiguracionQuizService.obtener_configuracion_estudiante(
#        db=db,
#        id_competencia=id_competencia,
#        id_submodulo=id_submodulo,
#        id_tema=id_tema,
#        dificultad=dificultad
#    )