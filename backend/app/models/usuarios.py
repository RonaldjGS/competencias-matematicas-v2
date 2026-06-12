from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    ForeignKey
)

from sqlalchemy.sql import func

from app.database.base import Base
# ==========================================
# admin
# ==========================================

class Administrador(Base):

    __tablename__ = "administrador"

    id_admin = Column(
        Integer,
        primary_key=True,
        index=True
    )

    id_rol = Column(
        Integer,
        ForeignKey("roles.id_rol"),
        nullable=False
    )

    nombre_admin = Column(
        String(150),
        nullable=False
    )

    correo_admin = Column(
        String(200),
        nullable=False,
        unique=True
    )

    password_hash_admin = Column(
        String(255),
        nullable=False
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
# estudiante
# ==========================================    
class Estudiante(Base):

    __tablename__ = "estudiantes"

    id_estudiante = Column(
        Integer,
        primary_key=True,
        index=True
    )

    nombre_estudiante = Column(
        String(200),
        nullable=False
    )

    institucion_edu = Column(
        String(200),
        nullable=False
    )

    id_nivel = Column(
        Integer,
        ForeignKey("niveles_educativos.id_nivel"),
        nullable=False
    )

    id_tipo_institucion = Column(
        Integer,
        ForeignKey("tipos_institucion.id_tipo"),
        nullable=True
    )

    id_carrera = Column(
        Integer,
        ForeignKey("carreras.id_carrera"),
        nullable=True
    )

    id_ciudad = Column(
        Integer,
        ForeignKey("ciudades.id_ciudad"),
        nullable=False
    )

    correo_estudiante = Column(
        String(200),
        nullable=False,
        unique=True,
        index=True
    )

    password_hash = Column(
        String(255),
        nullable=False
    )

    id_rol = Column(
        Integer,
        ForeignKey("roles.id_rol"),
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

    ultimo_acceso = Column(
        DateTime(timezone=True),
        nullable=True
    )

    update_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

# ==========================================
# profesor
# ==========================================    
class Profesor(Base):

    __tablename__ = "profesores"

    id_profesor = Column(
        Integer,
        primary_key=True,
        index=True
    )

    nombre_profesor = Column(
        String(200),
        nullable=False
    )

    institucion_educativa = Column(
        String(200),
        nullable=False
    )

    id_nivel = Column(
        Integer,
        ForeignKey("niveles_educativos.id_nivel"),
        nullable=False
    )

    id_tipo_institucion = Column(
        Integer,
        ForeignKey("tipos_institucion.id_tipo"),
        nullable=True
    )

    id_carrera = Column(
        Integer,
        ForeignKey("carreras.id_carrera"),
        nullable=True
    )

    id_provincia = Column(
        Integer,
        ForeignKey("provincia.id_provincia"),
        nullable=False
    )

    id_ciudad = Column(
        Integer,
        ForeignKey("ciudades.id_ciudad"),
        nullable=False
    )

    correo = Column(
        String(200),
        nullable=False,
        unique=True,
        index=True
    )

    password_hash = Column(
        String(255),
        nullable=False
    )

    id_rol = Column(
        Integer,
        ForeignKey("roles.id_rol"),
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

    ultimo_acceso = Column(
        DateTime(timezone=True),
        nullable=True
    )

    update_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )