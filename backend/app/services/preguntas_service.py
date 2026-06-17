from sqlalchemy.orm import Session

from app.models.evaluaciones import (
    PreguntaCompetencia
)

# ==========================================
# PREGUNTAS DEL PROFESOR
# ==========================================

def obtener_preguntas_profesor(
    id_profesor: int,
    db: Session
):

    preguntas = (
        db.query(
            PreguntaCompetencia
        )
        .filter(
            PreguntaCompetencia.id_profesor ==
            id_profesor
        )
        .all()
    )

    return preguntas

# ==========================================
# BUSCAR PREGUNTAS
# ==========================================

def buscar_preguntas_profesor(
    id_profesor: int,
    id_competencia: int,
    id_submodulo: int,
    id_tema: int,
    db: Session
):

    preguntas = (
        db.query(
            PreguntaCompetencia
        )
        .filter(
            PreguntaCompetencia.id_profesor ==
            id_profesor,

            PreguntaCompetencia.id_competencia ==
            id_competencia,

            PreguntaCompetencia.id_submodulo ==
            id_submodulo,

            PreguntaCompetencia.id_tema ==
            id_tema
        )
        .all()
    )

    return preguntas

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