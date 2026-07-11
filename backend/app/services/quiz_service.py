from sqlalchemy.orm import Session

from app.models.evaluaciones import (
    IntentoQuiz,
    IntentoDetalle,
    PreguntaCompetencia
)

from datetime import datetime

from app.services.configuracion_quiz_service import ConfiguracionQuizService

import random
import copy


# ==========================================
# OBTENER INTENTO QUIZ
# ==========================================

def obtener_intento(
    id_estudiante: int,
    id_competencia: int,
    id_submodulo: int,
    id_tema: int,
    dificultad: str,
    db: Session
):

    intento = (

        db.query(
            IntentoQuiz
        )

        .filter(

            IntentoQuiz.id_estudiante == id_estudiante,

            IntentoQuiz.id_competencia == id_competencia,

            IntentoQuiz.id_submodulo == id_submodulo,

            IntentoQuiz.id_tema == id_tema,

            IntentoQuiz.dificultad == dificultad,

            IntentoQuiz.completado == False

        )

        .order_by(

            IntentoQuiz.id_intento.desc()

        )

        .first()

    )

    return intento

# ==========================================
# CREAR INTENTO QUIZ
# ==========================================

def crear_intento(
    id_estudiante: int,
    id_competencia: int,
    id_submodulo: int,
    id_tema: int,
    dificultad:str,
    max_intentos: int,
    db: Session
):

    # --------------------------------------
    # Buscar intento abierto
    # --------------------------------------

    intento_abierto = (

        db.query(
            IntentoQuiz
        )

        .filter(

            IntentoQuiz.id_estudiante == id_estudiante,

            IntentoQuiz.id_competencia == id_competencia,

            IntentoQuiz.id_submodulo == id_submodulo,

            IntentoQuiz.id_tema == id_tema,

            IntentoQuiz.completado == False,

            IntentoQuiz.abandonado == False

        )

        .order_by(
            IntentoQuiz.id_intento.desc()
        )

        .first()

    )

    # --------------------------------------
    # Si existe uno abierto,
    # marcarlo como abandonado
    # --------------------------------------

    if intento_abierto:

        intento_abierto.abandonado = True

        intento_abierto.fecha_fin = datetime.utcnow()

    # --------------------------------------
    # Crear nuevo intento
    # --------------------------------------

    nuevo = IntentoQuiz(

        id_estudiante=id_estudiante,

        id_competencia=id_competencia,

        id_submodulo=id_submodulo,

        id_tema=id_tema,
        
        dificultad=dificultad,

        intentos_usados=0,

        fecha_inicio=datetime.utcnow(),

        fecha_fin=None,

        completado=False,

        abandonado=False,
        
        max_intentos=max_intentos,

    )

    db.add(nuevo)

    db.commit()

    db.refresh(nuevo)

    return nuevo


# ==========================================
# ACTUALIZAR INTENTO QUIZ
# ==========================================

def actualizar_intento(
    intento: IntentoQuiz,
    completado: bool,
    db: Session
):

    intento.intentos_usados += 1

    if completado:

        intento.completado = True
        
        intento.fecha_fin = datetime.now()

    db.commit()

    db.refresh(
        intento
    )

    return intento


# ==========================================
# INTENTOS RESTANTES
# ==========================================

def obtener_intentos_restantes(
    intentos_usados: int,
    max_intentos: int
):

    return max(

        0,

        max_intentos -

        intentos_usados

    )

# ==========================================
# OPCIONES BLOQUEADAS
# ==========================================

def obtener_opciones_bloqueadas(

    id_intento: int,

    id_pregunta: int,

    db: Session

):

    opciones = (

        db.query(

            IntentoDetalle

        )

        .filter(

            IntentoDetalle.id_intento ==

            id_intento,

            IntentoDetalle.id_pregunta ==

            id_pregunta

        )

        .all()

    )

    return [

        opcion.opcion_fallida

        for opcion in opciones

        if opcion.opcion_fallida is not None

    ]
    
# ==========================================
# CONSTRUIR PREGUNTAS DEL QUIZ
# ==========================================

def construir_preguntas_quiz(

    preguntas,

    mezclar_opciones: bool

):

    preguntas_quiz = []

    for pregunta in preguntas:

        # ======================================
        # COPIA DE LA PREGUNTA
        # ======================================

        pregunta_quiz = copy.copy(

            pregunta

        )

        opciones = [

            {

                "texto": pregunta.opcion_a,

                "correcta":

                    pregunta.respuesta_correcta.upper() == "A"

            },

            {

                "texto": pregunta.opcion_b,

                "correcta":

                    pregunta.respuesta_correcta.upper() == "B"

            },

            {

                "texto": pregunta.opcion_c,

                "correcta":

                    pregunta.respuesta_correcta.upper() == "C"

            },

            {

                "texto": pregunta.opcion_d,

                "correcta":

                    pregunta.respuesta_correcta.upper() == "D"

            }

        ]

        # ======================================
        # MEZCLAR OPCIONES
        # ======================================

        if mezclar_opciones:

            random.shuffle(

                opciones

            )

        letras = [

            "A",

            "B",

            "C",

            "D"

        ]

        nueva_respuesta = ""

        # ======================================
        # REASIGNAR OPCIONES
        # ======================================

        for i, opcion in enumerate(opciones):

            if i == 0:

                pregunta_quiz.opcion_a = opcion["texto"]

            elif i == 1:

                pregunta_quiz.opcion_b = opcion["texto"]

            elif i == 2:

                pregunta_quiz.opcion_c = opcion["texto"]

            else:

                pregunta_quiz.opcion_d = opcion["texto"]

            if opcion["correcta"]:

                nueva_respuesta = letras[i]

        # ======================================
        # NUEVA RESPUESTA CORRECTA
        # ======================================

        pregunta_quiz.respuesta_correcta_quiz = (

            nueva_respuesta

        )

        preguntas_quiz.append(

            pregunta_quiz

        )

    return preguntas_quiz
    
# ==========================================
# ESTADO DE INTENTOS
# ==========================================

def obtener_estado_intentos(

    id_estudiante: int,
    id_competencia: int,
    id_submodulo: int,
    id_tema: int,
    dificultad: str,
    db: Session
):

    intento = obtener_intento(
        id_estudiante,
        id_competencia,
        id_submodulo,
        id_tema,
        dificultad,
        db
    )

    if not intento:

        configuracion = (

            ConfiguracionQuizService

            .obtener_configuracion_estudiante(

                db=db,

                id_competencia=id_competencia,

                id_submodulo=id_submodulo,

                id_tema=id_tema,

                dificultad=dificultad

            )

        )

        max_intentos = 3

        if configuracion:

            max_intentos = configuracion.intentos

        return {

            "intentos_usados": 0,

            "intentos_restantes": max_intentos,

            "completado": False

        }

    return {

        "intentos_usados":

            intento.intentos_usados,

        "intentos_restantes":

            obtener_intentos_restantes(

                intento.intentos_usados,

                intento.max_intentos

            ),

        "completado":

            intento.completado

    }
    
# ==========================================
# FINALIZAR QUIZ
# ==========================================

def finalizar_intento_quiz(

    id_estudiante: int,
    id_competencia: int,
    id_submodulo: int,
    id_tema: int,
    dificultad: str,
    db: Session
):

    intento = obtener_intento(

        id_estudiante,

        id_competencia,

        id_submodulo,

        id_tema,

        dificultad,

        db

    )

    if intento:

        intento.completado = True

        db.commit()

        db.refresh(intento)

    return intento

# ==========================================
# CONSUMIR INTENTO
# ==========================================

def consumir_intento(

    id_intento:int,

    id_pregunta:int,

    respuesta:str,

    numero_pregunta:int,

    tiempo_respuesta:int,

    db:Session

):

    intento = (

        db.query(
            IntentoQuiz
        )

        .filter(
            IntentoQuiz.id_intento ==
            id_intento
        )

        .first()

    )

    if not intento:

        return {

            "mensaje":

            "Intento no encontrado"

        }

    pregunta = (

        db.query(
            PreguntaCompetencia
        )

        .filter(
            PreguntaCompetencia.id_pregunta ==
            id_pregunta
        )

        .first()

    )

    if not pregunta:

        return {

            "mensaje":

            "Pregunta no encontrada"

        }

    respuesta = respuesta.upper()

    actualizar_intento(

        intento,

        False,

        db

    )

    # ==========================================
    # BUSCAR SI YA EXISTE EL DETALLE
    # ==========================================

    detalle = (

        db.query(
            IntentoDetalle
        )

        .filter(

            IntentoDetalle.id_intento ==
            intento.id_intento,

            IntentoDetalle.id_pregunta ==
            pregunta.id_pregunta

        )

        .first()

    )

    if not detalle:

        return {

            "mensaje":

            "Detalle del intento no encontrado"

        }

    # ==========================================
    # ACTUALIZAR DETALLE
    # ==========================================

    detalle.respuesta_estudiante = respuesta

    detalle.es_correcta = False

    detalle.opcion_fallida = respuesta

    detalle.tiempo_respuesta = tiempo_respuesta
    
    db.commit()

    db.refresh(detalle)

    intentos_restantes = obtener_intentos_restantes(

        intento.intentos_usados,
        intento.max_intentos

    )

    opciones_bloqueadas = obtener_opciones_bloqueadas(

        intento.id_intento,

        pregunta.id_pregunta,

        db

    )

    if intentos_restantes == 0:

        return {

            "correcta": False,
            
            "es_correcta": False,

            "mostrar_solucion": True,

            "puede_reintentar": False,

            "respuesta_correcta":

                detalle.respuesta_correcta_quiz,

            "justificacion":
            pregunta.justificacion,

            "intentos_restantes":
            0,

            "opciones_bloqueadas":
            opciones_bloqueadas

        }

    return {

        "correcta": False,

        "mostrar_solucion": False,

        "puede_reintentar": True,

        "intentos_restantes":
        intentos_restantes,

        "opciones_bloqueadas":
        opciones_bloqueadas

    }
    
# ==========================================
# MOSTRAR SOLUCIÓN
# ==========================================

def mostrar_solucion(

    id_intento:int,

    id_pregunta:int,

    numero_pregunta:int,

    tiempo_respuesta:int,

    db:Session
):

    intento = (

        db.query(
            IntentoQuiz
        )

        .filter(
            IntentoQuiz.id_intento ==
            id_intento
        )

        .first()

    )

    if not intento:

        return {

            "mensaje":

            "Intento no encontrado"

        }

    pregunta = (

        db.query(
            PreguntaCompetencia
        )

        .filter(
            PreguntaCompetencia.id_pregunta ==
            id_pregunta
        )

        .first()

    )

    if not pregunta:

        return {

            "mensaje":

            "Pregunta no encontrada"

        }
        
    # ======================================
    # DETALLE DEL INTENTO
    # ======================================

    detalle = (

        db.query(
            IntentoDetalle
        )

        .filter(

            IntentoDetalle.id_intento ==
            id_intento,

            IntentoDetalle.id_pregunta ==
            id_pregunta

        )

        .first()

    )

    if not detalle:

        return {

            "mensaje":

            "Detalle del intento no encontrado"

        }

    # =====================================
    # RESPUESTA
    # =====================================

    return {

        "correcta": False,

        "mostrar_solucion": True,

        "puede_reintentar": False,

        "respuesta_correcta":

            detalle.respuesta_correcta_quiz,

        "justificacion":
        pregunta.justificacion,

        "intentos_restantes":
        obtener_intentos_restantes(
            intento.intentos_usados,
            intento.max_intentos
        ),

        "opciones_bloqueadas":
        obtener_opciones_bloqueadas(
            intento.id_intento,
            pregunta.id_pregunta,
            db
        )

    }
    
# ==========================================
# VALIDAR RESPUESTA
# ==========================================

def validar_respuesta(

    id_intento:int,

    id_pregunta:int,

    respuesta:str,

    numero_pregunta:int,

    tiempo_respuesta:int,

    db:Session

):

    # ======================================
    # PREGUNTA
    # ======================================

    pregunta = (

        db.query(
            PreguntaCompetencia
        )

        .filter(
            PreguntaCompetencia.id_pregunta ==
            id_pregunta
        )

        .first()

    )

    if not pregunta:

        return {

            "mensaje":

            "Pregunta no encontrada"

        }

    # ======================================
    # RESPUESTA
    # ======================================

    respuesta = respuesta.upper()

    if respuesta not in [

        "A",

        "B",

        "C",

        "D"

    ]:

        return {

            "mensaje":

            "Respuesta inválida"

        }

    # ======================================
    # INTENTO
    # ======================================

    intento = (

        db.query(
            IntentoQuiz
        )

        .filter(
            IntentoQuiz.id_intento ==
            id_intento
        )

        .first()

    )

    if not intento:

        return {

            "mensaje":

            "Intento no encontrado"

        }

    # ======================================
    # DETALLE
    # ======================================

    detalle = (

        db.query(

            IntentoDetalle

        )

        .filter(

            IntentoDetalle.id_intento ==

            id_intento,

            IntentoDetalle.id_pregunta ==

            id_pregunta

        )

        .first()

    )

    if not detalle:

        return {

            "mensaje":

            "Detalle del intento no encontrado"

        }

    # ======================================
    # COMPARAR RESPUESTA
    # ======================================

    correcta = (

        respuesta ==

        detalle.respuesta_correcta_quiz

    )

    # ======================================
    # RESPUESTA CORRECTA
    # ======================================

    if correcta:

        detalle.respuesta_estudiante = respuesta

        detalle.es_correcta = True

        detalle.opcion_fallida = None

        detalle.tiempo_respuesta = tiempo_respuesta

        db.commit()

        db.refresh(detalle)
    
        return {

            "correcta": True,

            "mostrar_solucion": True,

            "puede_reintentar": False,

            "respuesta_correcta":

                detalle.respuesta_correcta_quiz,

            "justificacion":

                pregunta.justificacion,

            "intentos_restantes":

                obtener_intentos_restantes(

                    intento.intentos_usados,

                    intento.max_intentos

                ),

            "opciones_bloqueadas":

                obtener_opciones_bloqueadas(

                    intento.id_intento,

                    pregunta.id_pregunta,

                    db

                )

        }

    # ======================================
    # RESPUESTA INCORRECTA
    # ======================================

    intentos_restantes = obtener_intentos_restantes(

        intento.intentos_usados,
        intento.max_intentos

    )

    # Ya no tiene intentos disponibles
    if intentos_restantes == 0:

        return {

            "correcta": False,

            "mostrar_solucion": True,

            "puede_reintentar": False,

            "respuesta_correcta":

                detalle.respuesta_correcta_quiz,

            "justificacion":

                pregunta.justificacion,

            "intentos_restantes": 0,

            "opciones_bloqueadas":

                obtener_opciones_bloqueadas(

                    intento.id_intento,

                    pregunta.id_pregunta,

                    db

                )

        }

    # Aún puede decidir si gastar un intento

    return {

        "correcta": False,

        "mostrar_solucion": False,

        "puede_reintentar": True,

        "intentos_restantes":
            intentos_restantes,

        "opciones_bloqueadas":
            obtener_opciones_bloqueadas(

                intento.id_intento,

                pregunta.id_pregunta,

                db

            )

    }
    