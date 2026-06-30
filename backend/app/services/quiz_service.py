from sqlalchemy.orm import Session

from app.models.evaluaciones import (
    IntentoQuiz,
    IntentoDetalle,
    PreguntaCompetencia
)

from datetime import datetime

from sqlalchemy import DateTime

# ==========================================
# CONFIGURACIÓN
# ==========================================

MAX_INTENTOS = 3


# ==========================================
# OBTENER INTENTO QUIZ
# ==========================================

def obtener_intento(
    id_estudiante: int,
    id_competencia: int,
    id_submodulo: int,
    id_tema: int,
    dificultad:str,
    db: Session
):

    intento = (
        db.query(
            IntentoQuiz
        )
        .filter(
            IntentoQuiz.id_estudiante ==
            id_estudiante,

            IntentoQuiz.id_competencia ==
            id_competencia,

            IntentoQuiz.id_submodulo ==
            id_submodulo,

            IntentoQuiz.id_tema ==
            id_tema,
            
            IntentoQuiz.dificultad == dificultad,

            IntentoQuiz.completado ==
            False
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

        abandonado=False

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
    intentos_usados: int
):

    return max(
        0,
        MAX_INTENTOS - intentos_usados
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
# EVALUAR RESPUESTA
# ==========================================

def evaluar_respuesta(


    id_intento: int,

    id_pregunta: int,

    respuesta: str,

    usar_intento: bool,

    db: Session
):

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

    correcta = (
        respuesta
        ==
        pregunta.respuesta_correcta.upper()
    )

    # ======================================
    # RESPUESTA CORRECTA
    # ======================================

    if correcta:

        db.query(
            IntentoDetalle
        ).filter(
            IntentoDetalle.id_intento ==
            intento.id_intento,

            IntentoDetalle.id_pregunta ==
            pregunta.id_pregunta
        ).delete()

        db.commit()

        return {

            "correcta": True,

            "mostrar_solucion": True,
            
            "puede_reintentar": False,

            "respuesta_correcta":
            pregunta.respuesta_correcta,

            "justificacion":
            pregunta.justificacion,

            "intentos_restantes":
            obtener_intentos_restantes(
                intento.intentos_usados
            )
        }

    # ======================================
    # RESPUESTA INCORRECTA
    # ======================================

    if usar_intento:

        datos = consumir_intento(

            intento,

            pregunta,

            respuesta,

            db

        )

        if datos["intentos_restantes"] == 0:

            return {

                "correcta": False,

                "mostrar_solucion": True,

                "puede_reintentar": False,
                
                "ultimo_intento": True,

                "respuesta_correcta":
                pregunta.respuesta_correcta,

                "justificacion":
                pregunta.justificacion,

                "intentos_restantes":
                0,

                "opciones_bloqueadas":
                datos["opciones_bloqueadas"]

            }

        return {

            "correcta": False,

            "mostrar_solucion": False,

            "puede_reintentar": True,
            
            "ultimo_intento": False,

            "intentos_restantes":
            datos["intentos_restantes"],

            "opciones_bloqueadas":
            datos["opciones_bloqueadas"]

        }

    return mostrar_solucion(

        intento,

        pregunta,

        db

    )

    
# ==========================================
# ESTADO DE INTENTOS
# ==========================================

def obtener_estado_intentos(
    id_estudiante: int,
    id_competencia: int,
    id_submodulo: int,
    id_tema: int,
    db: Session
):

    intento = obtener_intento(
        id_estudiante,
        id_competencia,
        id_submodulo,
        id_tema,
        db
    )

    if not intento:

        return {

            "intentos_usados":
            0,

            "intentos_restantes":
            MAX_INTENTOS,

            "completado":
            False
        }

    return {

        "intentos_usados":
        intento.intentos_usados,

        "intentos_restantes":
        obtener_intentos_restantes(
            intento.intentos_usados
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
    db: Session
):

    intento = obtener_intento(
        id_estudiante,
        id_competencia,
        id_submodulo,
        id_tema,
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

    # ==========================================
    # CREAR DETALLE
    # ==========================================

    if not detalle:

        detalle = IntentoDetalle(

            id_intento=
            intento.id_intento,

            id_pregunta=
            pregunta.id_pregunta,

            numero_pregunta=
            numero_pregunta,

            respuesta_estudiante=
            respuesta,

            es_correcta=False,

            tiempo_respuesta=
            tiempo_respuesta,

            opcion_fallida=
            respuesta

        )

        db.add(
            detalle
        )

    # ==========================================
    # ACTUALIZAR DETALLE
    # ==========================================

    else:

        detalle.respuesta_estudiante = \
            respuesta

        detalle.es_correcta = False

        detalle.opcion_fallida = \
            respuesta
            
        detalle.tiempo_respuesta = tiempo_respuesta

    db.commit()
    
    db.refresh(
        detalle
    )

    intentos_restantes = obtener_intentos_restantes(

        intento.intentos_usados

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
            pregunta.respuesta_correcta,

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

    # =====================================
    # SI NO EXISTE DETALLE LO CREA
    # =====================================

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

        detalle = IntentoDetalle(

            id_intento=
            intento.id_intento,

            id_pregunta=
            pregunta.id_pregunta,

            numero_pregunta=
            numero_pregunta,

            respuesta_estudiante="X",

            es_correcta=False,
            
            tiempo_respuesta=
            tiempo_respuesta,

            opcion_fallida=None

        )

        db.add(detalle)

    else:

        detalle.es_correcta = False

    db.commit()

    # =====================================
    # RESPUESTA
    # =====================================

    return {

        "correcta": False,

        "mostrar_solucion": True,

        "puede_reintentar": False,

        "respuesta_correcta":
        pregunta.respuesta_correcta,

        "justificacion":
        pregunta.justificacion,

        "intentos_restantes":
        obtener_intentos_restantes(
            intento.intentos_usados
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

    correcta = (

        respuesta ==

        pregunta.respuesta_correcta.upper()

    )

    # ======================================
    # RESPUESTA CORRECTA
    # ======================================

    if correcta:

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

        # ----------------------------------
        # NO EXISTE DETALLE
        # ----------------------------------

        if not detalle:

            detalle = IntentoDetalle(

                id_intento=
                intento.id_intento,

                id_pregunta=
                pregunta.id_pregunta,

                numero_pregunta=
                numero_pregunta,

                respuesta_estudiante=
                respuesta,

                es_correcta=True,

                tiempo_respuesta=
                tiempo_respuesta,

                opcion_fallida=None

            )

            db.add(
                detalle
            )

        # ----------------------------------
        # YA EXISTE
        # ----------------------------------

        else:

            detalle.respuesta_estudiante = \
                respuesta

            detalle.es_correcta = True
            
            detalle.opcion_fallida = None
            
            detalle.tiempo_respuesta = \
                tiempo_respuesta

        db.commit()

        db.refresh(
            detalle
        )

        return {

            "correcta": True,

            "mostrar_solucion": True,

            "puede_reintentar": False,

            "respuesta_correcta":
                pregunta.respuesta_correcta,

            "justificacion":
                pregunta.justificacion,

            "intentos_restantes":
                obtener_intentos_restantes(
                    intento.intentos_usados
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

        intento.intentos_usados

    )

    # Ya no tiene intentos disponibles
    if intentos_restantes == 0:

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

        # ===============================
        # NO EXISTE
        # ===============================

        if not detalle:

            detalle = IntentoDetalle(

                id_intento=
                intento.id_intento,

                id_pregunta=
                pregunta.id_pregunta,

                numero_pregunta=
                numero_pregunta,

                respuesta_estudiante=
                respuesta,

                es_correcta=False,

                tiempo_respuesta=
                tiempo_respuesta,

                opcion_fallida=
                respuesta

            )

            db.add(
                detalle
            )

        # ===============================
        # YA EXISTE
        # ===============================

        else:

            detalle.numero_pregunta = \
                numero_pregunta

            detalle.respuesta_estudiante = \
                respuesta

            detalle.es_correcta = False

            detalle.tiempo_respuesta = \
                tiempo_respuesta

            detalle.opcion_fallida = \
                respuesta

        db.commit()

        db.refresh(
            detalle
        )

        return {

            "correcta": False,

            "mostrar_solucion": True,

            "puede_reintentar": False,

            "respuesta_correcta":
                pregunta.respuesta_correcta,

            "justificacion":
                pregunta.justificacion,

            "intentos_restantes":
                0,

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