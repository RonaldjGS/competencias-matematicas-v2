from sqlalchemy import (
    Column,
    Integer,
    Boolean,
    DateTime,
    ForeignKey
)

from sqlalchemy.sql import func

from app.database.base import Base


class EstudianteSubmodulo(Base):

    __tablename__ = (
        "estudiante_submodulo"
    )

    id_estudiante_submodulo = Column(
        Integer,
        primary_key=True,
        index=True
    )

    id_estudiante = Column(
        Integer,
        ForeignKey(
            "estudiantes.id_estudiante"
        )
    )

    id_competencia = Column(
        Integer,
        ForeignKey(
            "competencias.id_competencia"
        )
    )

    id_submodulo = Column(
        Integer,
        ForeignKey(
            "submodulos.id_submodulo"
        )
    )

    completado = Column(
        Boolean,
        default=False
    )

    fecha_completado = Column(
        DateTime,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=func.now()
    )

    updated_at = Column(
        DateTime,
        default=func.now(),
        onupdate=func.now()
    )