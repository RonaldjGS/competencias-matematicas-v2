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