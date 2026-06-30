from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Boolean,
    DateTime,
    ForeignKey,
    Float
)

from sqlalchemy.sql import func

from app.database.base import Base

from datetime import datetime

from sqlalchemy import DateTime




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

    id_profesor = Column(
        Integer,
        nullable=False
    )

    id_nivel = Column(
        Integer,
        nullable=False
    )

    id_competencia = Column(
        Integer,
        nullable=False
    )

    id_tema = Column(
        Integer,
        nullable=False
    )

    id_submodulo = Column(
        Integer,
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
        nullable=True
    )

    tiempo_estimado = Column(
        Integer,
        nullable=False,
        default=60
    )

    estado = Column(
        Boolean,
        default=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    update_at = Column(
        DateTime(timezone=True),
        nullable=True
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
    
    id_intento = Column(
        Integer,
        ForeignKey(
            "intentos_quiz.id_intento"
        ),
        nullable=False
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
    
    dificultad = Column(
        String(20),
        nullable=False
    )

    puntaje = Column(
        Float,
        nullable=False
    )
    
        
    porcentaje = Column(
        Float,
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
        nullable=False,
        default=0
    )

    intento = Column(
        Integer,
        nullable=False,
        default=1
    )
    
    nivel_desempeno = Column(
        String(40),
        nullable=False
    )
    
    retroalimentacion = Column(
        String(255),
        nullable=True
    )

    fecha = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

# ==========================================
# Resultado detalles
# ==========================================

class ResultadoDetalle(Base):

    __tablename__ = "resultado_detalle"

    id_detalle = Column(
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

    id_resultado = Column(
        Integer,
        ForeignKey(
            "resultados_quiz.id_resultado"
        ),
        nullable=False
    )

    id_pregunta = Column(
        Integer,
        ForeignKey(
            "preguntas_competencias.id_pregunta"
        ),
        nullable=False
    )
    
    numero_pregunta = Column(
        Integer,
        nullable=False
    )

    respuesta_estudiante = Column(
        String(1),
        nullable=False
    )

    respuesta_correcta = Column(
        String(1),
        nullable=False
    )

    es_correcta = Column(
        Boolean,
        nullable=False
    )
    
    tiempo_respuesta = Column(
        Integer,
        nullable=False,
        default=0
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

# ==========================================
# DETALLE DE INTENTOS
# ==========================================

class IntentoDetalle(Base):

    __tablename__ = "intentos_detalle"

    id_detalle = Column(
        Integer,
        primary_key=True,
        index=True
    )

    id_intento = Column(
        Integer,
        ForeignKey(
            "intentos_quiz.id_intento"
        ),
        nullable=False
    )

    id_pregunta = Column(
        Integer,
        ForeignKey(
            "preguntas_competencias.id_pregunta"
        ),
        nullable=False
    )
    
    numero_pregunta = Column(
        Integer,
        nullable=False
    )

    respuesta_estudiante = Column(
        String(1),
        nullable=False
    )

    es_correcta = Column(
        Boolean,
        nullable=False,
        default=False
    )

    tiempo_respuesta = Column(
        Integer,
        nullable=False,
        default=0
    )

    opcion_fallida = Column(
        String(1),
        nullable=True
    )

    fecha = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

# ==========================================
# INTENTOS
# ==========================================
class IntentoQuiz(Base):

    __tablename__ = "intentos_quiz"

    id_intento = Column(
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
    
    dificultad = Column(
        String(20),
        nullable=False
    )

    intentos_usados = Column(
        Integer,
        nullable=False,
        default=0
    )

    completado = Column(
        Boolean,
        nullable=False,
        default=False
    )

    fecha_inicio = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
    
    fecha_fin = Column(
        DateTime,
        nullable=True
    )

    abandonado = Column(
        Boolean,
        default=False,
        nullable=False
    )

    fecha_actualizacion = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
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