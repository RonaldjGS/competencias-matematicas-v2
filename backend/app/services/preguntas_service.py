from sqlalchemy.orm import Session

from app.models.evaluaciones import (
    PreguntaCompetencia
)

from app.models.academico import (
    Competencia,
    Submodulo,
    Tema
)

from datetime import datetime

# ==========================================
# PREGUNTAS DEL PROFESOR
# ==========================================

def obtener_preguntas_profesor(
    id_profesor: int,
    db: Session
):

    preguntas = (

        db.query(

            PreguntaCompetencia.id_pregunta,

            PreguntaCompetencia.pregunta,

            Competencia.nombre_competencia.label(
                "competencia"
            ),

            Submodulo.nombre_submodulo.label(
                "submodulo"
            ),

            Tema.nombre_tema.label(
                "tema"
            ),

            PreguntaCompetencia.dificultad,

            PreguntaCompetencia.estado

        )

        .join(

            Competencia,

            Competencia.id_competencia ==

            PreguntaCompetencia.id_competencia

        )

        .join(

            Submodulo,

            Submodulo.id_submodulo ==

            PreguntaCompetencia.id_submodulo

        )

        .join(

            Tema,

            Tema.id_tema ==

            PreguntaCompetencia.id_tema

        )

        .filter(

            PreguntaCompetencia.id_profesor ==

            id_profesor

        )

        .order_by(

            PreguntaCompetencia.id_pregunta.desc()

        )

        .all()

    )

    return preguntas



# ==========================================
# ACTUALIZAR PREGUNTA
# ==========================================

def actualizar_pregunta_profesor(

    pregunta: PreguntaCompetencia,

    datos,

    db: Session

):
    # ==========================================
    # VALIDAR DUPLICADO
    # ==========================================

    duplicada = (

        db.query(

            PreguntaCompetencia

        )

        .filter(

            PreguntaCompetencia.id_profesor ==

            pregunta.id_profesor,

            PreguntaCompetencia.id_competencia ==

            datos.id_competencia,

            PreguntaCompetencia.id_submodulo ==

            datos.id_submodulo,

            PreguntaCompetencia.id_tema ==

            datos.id_tema,

            PreguntaCompetencia.pregunta ==

            datos.pregunta,

            PreguntaCompetencia.id_pregunta !=

            pregunta.id_pregunta

        )

        .first()

    )

    if duplicada:

        raise ValueError(

            "Ya existe una pregunta con el mismo enunciado para la competencia, submódulo y tema seleccionados."

        )
        
    # ==========================================
    # VALIDAR ENUNCIADO
    # ==========================================

    if datos.pregunta.strip() == "":

        raise ValueError(

            "La pregunta no puede estar vacía."

        )

    # ==========================================
    # VALIDAR OPCIONES
    # ==========================================

    opciones = [

        datos.opcion_a.strip(),

        datos.opcion_b.strip(),

        datos.opcion_c.strip(),

        datos.opcion_d.strip()

    ]

    if "" in opciones:

        raise ValueError(

            "Todas las opciones deben tener contenido."

        )

    if len(set(opciones)) != 4:

        raise ValueError(

            "Las opciones de respuesta no pueden estar repetidas."

        )

    # ==========================================
    # VALIDAR RESPUESTA
    # ==========================================

    if datos.respuesta_correcta not in [

        "A",

        "B",

        "C",

        "D"

    ]:

        raise ValueError(

            "La respuesta correcta debe ser A, B, C o D."

        )

    # ==========================================
    # VALIDAR JUSTIFICACIÓN
    # ==========================================

    if datos.justificacion is None or datos.justificacion.strip() == "":

        raise ValueError(

            "La justificación no puede estar vacía."

        )

    # ==========================================
    # VALIDAR DIFICULTAD
    # ==========================================

    if datos.dificultad not in [

        "Basico",

        "Intermedio",

        "Avanzado"

    ]:

        raise ValueError(

            "La dificultad debe ser Básico, Intermedio o Avanzado."

        )

    pregunta.id_competencia = datos.id_competencia

    pregunta.id_submodulo = datos.id_submodulo

    pregunta.id_tema = datos.id_tema

    pregunta.dificultad = datos.dificultad

    pregunta.pregunta = datos.pregunta

    pregunta.opcion_a = datos.opcion_a

    pregunta.opcion_b = datos.opcion_b

    pregunta.opcion_c = datos.opcion_c

    pregunta.opcion_d = datos.opcion_d

    pregunta.respuesta_correcta = datos.respuesta_correcta

    pregunta.justificacion = datos.justificacion

    pregunta.update_at = datetime.now()
    
    db.commit()

    db.refresh(pregunta)

    return pregunta

# ==========================================
# CAMBIAR ESTADO
# ==========================================

from datetime import datetime

def cambiar_estado_pregunta(

    pregunta: PreguntaCompetencia,

    db: Session

):

    pregunta.estado = not pregunta.estado

    pregunta.update_at = datetime.now()

    db.commit()

    db.refresh(pregunta)

    return pregunta

# ==========================================
# BUSCAR PREGUNTAS
# ==========================================

def buscar_preguntas_profesor(
    id_profesor: int,
    id_competencia: int | None,
    id_submodulo: int | None,
    id_tema: int | None,
    db: Session
):

    consulta = (

        db.query(

            PreguntaCompetencia.id_pregunta,

            PreguntaCompetencia.pregunta,

            Competencia.nombre_competencia.label(
                "competencia"
            ),

            Submodulo.nombre_submodulo.label(
                "submodulo"
            ),

            Tema.nombre_tema.label(
                "tema"
            ),

            PreguntaCompetencia.dificultad,

            PreguntaCompetencia.estado

        )

        .join(

            Competencia,

            Competencia.id_competencia ==

            PreguntaCompetencia.id_competencia

        )

        .join(

            Submodulo,

            Submodulo.id_submodulo ==

            PreguntaCompetencia.id_submodulo

        )

        .join(

            Tema,

            Tema.id_tema ==

            PreguntaCompetencia.id_tema

        )

        .filter(

            PreguntaCompetencia.id_profesor ==

            id_profesor

        )

    )

    if id_competencia:

        consulta = consulta.filter(

            PreguntaCompetencia.id_competencia ==

            id_competencia

        )

    if id_submodulo:

        consulta = consulta.filter(

            PreguntaCompetencia.id_submodulo ==

            id_submodulo

        )

    if id_tema:

        consulta = consulta.filter(

            PreguntaCompetencia.id_tema ==

            id_tema

        )

    return (

        consulta

        .order_by(

            PreguntaCompetencia.id_pregunta.desc()

        )

        .all()

    )

# ==========================================
# OBTENER PREGUNTA
# ==========================================

def obtener_pregunta_profesor(
    id_pregunta: int,
    id_profesor: int,
    db: Session
):

    pregunta = (
        db.query(
            PreguntaCompetencia
        )
        .filter(
            PreguntaCompetencia.id_pregunta ==
            id_pregunta,

            PreguntaCompetencia.id_profesor ==
            id_profesor
        )
        .first()
    )

    return pregunta