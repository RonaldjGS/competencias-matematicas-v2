from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Boolean,
    DateTime,
    Date,
    ForeignKey
)

from sqlalchemy.sql import func

from sqlalchemy.orm import relationship

from app.database.base import Base


# ======================================
# ROLES
# ======================================

class Rol(Base):

    __tablename__ = "roles"

    id_rol = Column(
        Integer,
        primary_key=True,
        index=True
    )

    nombre_rol = Column(
        String(100),
        nullable=False
    )

    descripcion_rol = Column(
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


# ======================================
# NIVELES EDUCATIVOS
# ======================================

class NivelEducativo(Base):

    __tablename__ = "niveles_educativos"

    id_nivel = Column(
        Integer,
        primary_key=True,
        index=True
    )

    nombre_nivel = Column(
        String(150),
        nullable=False
    )

    descripcion = Column(
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


class PeriodoAcademico(Base):

    __tablename__ = "periodos_academicos"

    id_periodo = Column(
        Integer,
        primary_key=True,
        index=True
    )

    id_nivel = Column(
        Integer,
        ForeignKey("niveles_educativos.id_nivel"),
        nullable=False
    )

    nombre_periodo = Column(
        String(80),
        nullable=False
    )

    descripcion = Column(
        String(200)
    )

    fecha_inicio = Column(Date)

    fecha_fin = Column(Date)

    estado = Column(
        Boolean,
        default=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    nivel = relationship(
        "NivelEducativo"
    )

# ======================================
# TIPOS DE INSTITUCION
# ======================================

class TipoInstitucion(Base):

    __tablename__ = "tipos_institucion"

    id_tipo = Column(
        Integer,
        primary_key=True,
        index=True
    )

    nombre_tipo = Column(
        String(150),
        nullable=False
    )

    descripcion_tipo = Column(
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
    
class Carrera(Base):

    __tablename__ = "carreras"

    id_carrera = Column(
        Integer,
        primary_key=True,
        index=True
    )

    nombre_carrera = Column(
        String(200),
        nullable=False
    )

    descripcion = Column(
        Text,
        nullable=False
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
# provincia
# ==========================================

class Provincia(Base):

    __tablename__ = "provincia"

    id_provincia = Column(
        Integer,
        primary_key=True,
        index=True
    )

    nombre_provincia = Column(
        String(150),
        nullable=False
    )

    descripcion_provincia = Column(
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
    
# ==========================================
# CIUDAD
# ==========================================
    
class Ciudad(Base):

    __tablename__ = "ciudades"

    id_ciudad = Column(
        Integer,
        primary_key=True,
        index=True
    )

    id_provincia = Column(
        Integer,
        ForeignKey("provincia.id_provincia"),
        nullable=False
    )

    nombre_ciudad = Column(
        String(150),
        nullable=False
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
    
