from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.catalogos import (
    NivelEducativo,
    Carrera,
    Ciudad,
    TipoInstitucion
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
    TemaOut
)

router = APIRouter(
    prefix="/catalogos",
    tags=["Catálogos"]
)

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
    
