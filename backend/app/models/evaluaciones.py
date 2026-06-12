from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Boolean,
    DateTime,
    ForeignKey
)

from sqlalchemy.sql import func

from app.database.base import Base


# ==========================================
# PREGUNTAS DE COMPETENCIAS
# ==========================================

class PreguntaCompetencia(Base):

    __tablename__ = "preguntas_competencias"

    id_pregunta = Column(
        Integer,
        primary_key=True,
        index=True
    )

    id_competencia = Column(
        Integer,
        ForeignKey(
            "competencias.id_competencia"
        ),
        nullable=False
    )

    id_tema = Column(
        Integer,
        ForeignKey(
            "temas.id_tema"
        ),
        nullable=False
    )

    id_submodulo = Column(
        Integer,
        ForeignKey(
            "submodulos.id_submodulo"
        ),
        nullable=False
    )

    dificultad = Column(
        String(20),
        nullable=False
    )

    pregunta = Column(
        Text,
        nullable=False
    )

    opcion_a = Column(
        Text,
        nullable=False
    )

    opcion_b = Column(
        Text,
        nullable=False
    )

    opcion_c = Column(
        Text,
        nullable=False
    )

    opcion_d = Column(
        Text,
        nullable=False
    )

    respuesta_correcta = Column(
        String(1),
        nullable=False
    )

    justificacion = Column(
        Text,
        nullable=False
    )

    tiempo_estimado = Column(
        Integer,
        nullable=False
    )

    estado = Column(
        Boolean,
        nullable=False,
        default=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    update_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )


# ==========================================
# VIDEOS
# ==========================================

class Video(Base):

    __tablename__ = "videos"

    id_video = Column(
        Integer,
        primary_key=True,
        index=True
    )

    id_nivel = Column(
        Integer,
        ForeignKey(
            "niveles_educativos.id_nivel"
        ),
        nullable=False
    )

    id_tema = Column(
        Integer,
        ForeignKey(
            "temas.id_tema"
        ),
        nullable=False
    )

    id_submodulo = Column(
        Integer,
        ForeignKey(
            "submodulos.id_submodulo"
        ),
        nullable=False
    )

    id_competencia = Column(
        Integer,
        ForeignKey(
            "competencias.id_competencia"
        ),
        nullable=False
    )

    tema_codigo = Column(
        String(50),
        nullable=False
    )

    tema_nombre = Column(
        String(150),
        nullable=False
    )

    video_url = Column(
        String(500),
        nullable=False
    )

    actualizado_por = Column(
        Integer,
        nullable=False
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )


# ==========================================
# RESULTADOS DE QUIZ
# ==========================================

class ResultadoQuiz(Base):

    __tablename__ = "resultados_quiz"

    id_resultado = Column(
        Integer,
        primary_key=True,
        index=True
    )

    id_estudiante = Column(
        Integer,
        ForeignKey(
            "estudiantes.id_estudiante"
        ),
        nullable=False
    )

    id_competencia = Column(
        Integer,
        ForeignKey(
            "competencias.id_competencia"
        ),
        nullable=False
    )

    id_submodulo = Column(
        Integer,
        ForeignKey(
            "submodulos.id_submodulo"
        ),
        nullable=False
    )

    id_tema = Column(
        Integer,
        ForeignKey(
            "temas.id_tema"
        ),
        nullable=False
    )

    puntaje = Column(
        Integer,
        nullable=False
    )

    correctas = Column(
        Integer,
        nullable=False
    )

    incorrectas = Column(
        Integer,
        nullable=False
    )

    total_preguntas = Column(
        Integer,
        nullable=False
    )

    tiempo_segundos = Column(
        Integer,
        nullable=False
    )

    intento = Column(
        Integer,
        nullable=False,
        default=1
    )

    fecha = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


# ==========================================
# RECUPERACION DE CONTRASEÑA
# ==========================================

class PasswordReset(Base):

    __tablename__ = "password_resets"

    id_password = Column(
        Integer,
        primary_key=True,
        index=True
    )

    correo = Column(
        String(200),
        nullable=False
    )

    token = Column(
        String(255),
        nullable=False
    )

    expires_at = Column(
        DateTime(timezone=True),
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )