from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.catalogos import (
    NivelEducativo,
    Carrera,
    Ciudad,
    TipoInstitucion,
    Provincia
)

from app.models.academico import (
    Competencia,
    Submodulo,
    Tema
)

from app.schemas.catalogos import (
    NivelOut,
    CarreraOut,
    CiudadOut,
    TipoInstitucionOut,
    CompetenciaOut,
    SubmoduloOut,
    TemaOut,
    ProvinciaOut
)


router = APIRouter(
    prefix="/catalogos",
    tags=["Catálogos"]
)

# ==========================================
# NIVELES
# ==========================================

@router.get(
    "/niveles",
    response_model=list[NivelOut]
)
def listar_niveles(
    db: Session = Depends(get_db)
):

    return (
        db.query(
            NivelEducativo
        )
        .filter(
            NivelEducativo.estado == True
        )
        .all()
    )
    
# ==========================================
# CARRERAS
# ==========================================
    
@router.get(
    "/carreras",
    response_model=list[CarreraOut]
)
def listar_carreras(
    db: Session = Depends(get_db)
):

    return (
        db.query(
            Carrera
        )
        .all()
    )
    
# ==========================================
# CIUDADES
# ==========================================

@router.get(
    "/ciudades",
    response_model=list[CiudadOut]
)
def listar_ciudades(
    db: Session = Depends(get_db)
):

    return (
        db.query(
            Ciudad
        )
        .all()
    )

# ==========================================
# INTITUCIONES
# ==========================================

@router.get(
    "/tipos-institucion",
    response_model=list[TipoInstitucionOut]
)
def listar_tipos_institucion(
    db: Session = Depends(get_db)
):

    return (
        db.query(
            TipoInstitucion
        )
        .filter(
            TipoInstitucion.estado == True
        )
        .all()
    )

# ==========================================
# COMPETENCIAS
# ==========================================

@router.get(
    "/competencias",
    response_model=list[CompetenciaOut]
)
def listar_competencias(
    db: Session = Depends(get_db)
):

    return (
        db.query(
            Competencia
        )
        .filter(
            Competencia.activo == True
        )
        .all()
    )

# ==========================================
# SUBMODULOS
# ==========================================
    
@router.get(
    "/submodulos",
    response_model=list[SubmoduloOut]
)
def listar_submodulos(
    db: Session = Depends(get_db)
):

    return (
        db.query(
            Submodulo
        )
        .filter(
            Submodulo.estado == True
        )
        .all()
    )

# ==========================================
# TEMAS
# ==========================================

@router.get(
    "/temas",
    response_model=list[TemaOut]
)
def listar_temas(
    db: Session = Depends(get_db)
):

    return (
        db.query(
            Tema
        )
        .filter(
            Tema.estado == True
        )
        .all()
    )

# ==========================================
# TEMAS - NIVELES
# ==========================================
    
@router.get(
    "/temas/{id_nivel}",
    response_model=list[TemaOut]
)
def listar_temas_por_nivel(
    id_nivel: int,
    db: Session = Depends(get_db)
):

    return (
        db.query(
            Tema
        )
        .filter(
            Tema.id_nivel == id_nivel,
            Tema.estado == True
        )
        .all()
    )
    

# ==========================================

# PROVINCIAS

# ==========================================

@router.get(
"/provincias",
response_model=list[ProvinciaOut]
)
def listar_provincias(
    db: Session = Depends(get_db)
):


    return (
        db.query(
            Provincia
        )
        .filter(
            Provincia.estado == True
        )
        .all()
    )

# ==========================================
# CIUDADES POR PROVINCIA
# ==========================================

@router.get(
    "/ciudades/provincia/{id_provincia}",
    response_model=list[CiudadOut]
)
def listar_ciudades_por_provincia(
    id_provincia: int,
    db: Session = Depends(get_db)
):

    return (
        db.query(
            Ciudad
        )
        .filter(
            Ciudad.id_provincia ==
            id_provincia
        )
        .all()
    )
