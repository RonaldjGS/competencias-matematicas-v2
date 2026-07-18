from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Boolean,
    DateTime,
    ForeignKey,
    Enum
)

from sqlalchemy.sql import func

from sqlalchemy.orm import (

    relationship

)

from app.database.base import Base


# ==========================================
# COMPETENCIAS
# ==========================================

class Competencia(Base):

    __tablename__ = "competencias"

    id_competencia = Column(
        Integer,
        primary_key=True,
        index=True
    )

    nombre_competencia = Column(
        String(200),
        nullable=False
    )

    descripcion = Column(
        Text,
        nullable=False
    )

    activo = Column(
        Boolean,
        nullable=False,
        default=True
    )

    create_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    update_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )


# ==========================================
# SUBMODULOS
# ==========================================

class Submodulo(Base):

    __tablename__ = "submodulos"

    id_submodulo = Column(
        Integer,
        primary_key=True,
        index=True
    )

    nombre_submodulo = Column(
        String(100),
        nullable=False
    )

    codigo = Column(
        String(50),
        nullable=False
    )

    descripcion_submodulo = Column(
        Text,
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
# TEMAS
# ==========================================

class Tema(Base):

    __tablename__ = "temas"

    id_tema = Column(
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

    nombre_tema = Column(
        String(200),
        nullable=False
    )

    codigo = Column(
        String(50),
        nullable=False
    )

    descripcion_tema = Column(
        Text,
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
    
class Video(Base):
    __tablename__ = "videos"

    id_video = Column(
        Integer,
        primary_key=True,
        index=True
    )

    titulo = Column(
        String(200),
        nullable=False
    )

    descripcion = Column(
        Text,
        nullable=True
    )

    id_competencia = Column(
        Integer,
        nullable=False
    )

    id_submodulo = Column(
        Integer,
        nullable=False
    )

    id_tema = Column(
        Integer,
        nullable=False
    )

    youtube_id = Column(
        String(50),
        nullable=False
    )

    tipo = Column(
        Enum("DIAGNOSTICO", "REFUERZO", name="tipo_video"),
        nullable=False,
        server_default="REFUERZO"
    )

    estado = Column(
        Boolean,
        nullable=False,
        default=True
    )

    actualizado_por = Column(
        Integer,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )
    
    videos_estudiante = relationship(

        "VideoEstudiante",

        back_populates="video"

    )
    

class VideoEstudiante(Base):

    __tablename__ = "videos_estudiantes"

    id_video_estudiante = Column(

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

    id_video = Column(

        Integer,

        ForeignKey(

            "videos.id_video"

        ),

        nullable=False

    )

    visto_completo = Column(

        Boolean,

        default=False,

        nullable=False

    )

    omitido = Column(

        Boolean,

        default=False,

        nullable=False

    )

    fecha_visualizacion = Column(

        DateTime,

        server_default=func.now(),

        nullable=False

    )

    # ==========================
    # RELACIONES
    # ==========================

    estudiante = relationship(

        "Estudiante",

        back_populates="videos_estudiante"

    )

    video = relationship(

        "Video",

        back_populates="videos_estudiante"

    )

    
# ==========================================
# TIPO CONTENIDO ACADÉMICO
# ==========================================

class TipoContenidoAcademico(Base):

    __tablename__ = "tipo_contenido_academico"

    id_tipo_contenido = Column(

        Integer,

        primary_key=True,

        index=True

    )

    nombre_tipo = Column(

        String(100),

        nullable=False

    )

    descripcion = Column(

        Text,

        nullable=True

    )

    estado = Column(

        Boolean,

        default=True

    )


# ==========================================
# CONTENIDO ACADÉMICO
# ==========================================

class ContenidoAcademico(Base):

    __tablename__ = "contenido_academico"

    id_contenido = Column(

        Integer,

        primary_key=True,

        index=True

    )

    id_profesor = Column(

        Integer,

        ForeignKey(

            "profesores.id_profesor"

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

    id_tipo_contenido = Column(

        Integer,

        ForeignKey(

            "tipo_contenido_academico.id_tipo_contenido"

        ),

        nullable=False

    )

    nombre_contenido = Column(

        String(250),

        nullable=False

    )

    descripcion_contenido = Column(

        Text,

        nullable=True

    )

    archivo = Column(

        String(300),

        nullable=False

    )

    extension = Column(

        String(20),

        nullable=True

    )

    tamano_archivo = Column(

        Integer,

        nullable=True

    )

    estado = Column(

        Boolean,

        default=True

    )

    created_at = Column(

        DateTime(timezone=True),

        server_default=func.now()

    )

    updated_at = Column(

        DateTime(timezone=True),

        server_default=func.now(),

        onupdate=func.now()

    )

    profesor = relationship(

        "Profesor"

    )

    competencia = relationship(

        "Competencia"

    )

    submodulo = relationship(

        "Submodulo"

    )

    tema = relationship(

        "Tema"

    )

    tipo = relationship(

        "TipoContenidoAcademico"

    )    