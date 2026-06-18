from sqlalchemy.orm import Session

from app.models.evaluaciones import (
    IntentoQuiz,
    IntentoDetalle,
    PreguntaCompetencia
)

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
            id_tema
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
    db: Session
):

    nuevo_intento = IntentoQuiz(

        id_estudiante=
        id_estudiante,

        id_competencia=
        id_competencia,

        id_submodulo=
        id_submodulo,

        id_tema=
        id_tema,

        intentos_usados=
        0,

        completado=
        False
    )

    db.add(
        nuevo_intento
    )

    db.commit()

    db.refresh(
        nuevo_intento
    )

    return nuevo_intento


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

    ]


# ==========================================
# EVALUAR RESPUESTA
# ==========================================

def evaluar_respuesta(
    estudiante,
    id_competencia: int,
    id_submodulo: int,
    id_tema: int,
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

    intento = obtener_intento(
        estudiante.id_estudiante,
        id_competencia,
        id_submodulo,
        id_tema,
        db
    )

    if not intento:

        intento = crear_intento(
            estudiante.id_estudiante,
            id_competencia,
            id_submodulo,
            id_tema,
            db
        )

    correcta = (
        respuesta
        ==
        pregunta.respuesta_correcta.upper()
    )

    # ======================================
    # RESPUESTA CORRECTA
    # ======================================

    if correcta:

        return {

            "correcta": True,

            "mostrar_solucion":
            True,

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

    intentos_restantes = (
        obtener_intentos_restantes(
            intento.intentos_usados
        )
    )

    # Ya no tiene intentos

    if intentos_restantes == 0:

        return {

            "correcta": False,

            "mostrar_solucion":
            True,

            "respuesta_correcta":
            pregunta.respuesta_correcta,

            "justificacion":
            pregunta.justificacion,

            "intentos_restantes":
            0
        }

    # Quiere usar un intento

    if usar_intento:

        actualizar_intento(
            intento,
            False,
            db
        )

        opcion_existente = (
            db.query(
                IntentoDetalle
            )
            .filter(
                IntentoDetalle.id_intento ==
                intento.id_intento,

                IntentoDetalle.id_pregunta ==
                pregunta.id_pregunta,

                IntentoDetalle.opcion_fallida ==
                respuesta
            )
            .first()
        )

        if not opcion_existente:

            detalle = IntentoDetalle(

                id_intento=
                intento.id_intento,

                id_pregunta=
                pregunta.id_pregunta,

                opcion_fallida=
                respuesta
            )

            db.add(
                detalle
            )

            db.commit()

        return {

            "correcta": False,

            "mostrar_solucion":
            False,

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

    # No quiere usar intento

    return {

        "correcta": False,

        "mostrar_solucion":
        True,

        "respuesta_correcta":
        pregunta.respuesta_correcta,

        "justificacion":
        pregunta.justificacion,

        "intentos_restantes":
        intentos_restantes
    }