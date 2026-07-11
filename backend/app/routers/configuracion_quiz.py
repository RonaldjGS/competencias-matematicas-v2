from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.schemas.configuracion_quiz import (
    ConfiguracionQuizCreate,
    ConfiguracionQuizResponse
)
from app.services.configuracion_quiz_service import ConfiguracionQuizService

from app.core.auth import get_current_profesor

from app.models.usuarios import Profesor

router = APIRouter(
    prefix="/configuracion-quiz",
    tags=["Configuración Quiz"]
)

@router.post(
    "/guardar",
    response_model=ConfiguracionQuizResponse
)
def guardar_configuracion(
    datos: ConfiguracionQuizCreate,
    profesor: Profesor = Depends(get_current_profesor),
    db: Session = Depends(get_db)
):

    return ConfiguracionQuizService.guardar_configuracion(
        db=db,
        id_profesor=profesor.id_profesor,
        datos=datos
    )

@router.get(
    "/obtener",
    response_model=ConfiguracionQuizResponse | None
)
def obtener_configuracion(
    id_competencia: int,
    id_submodulo: int,
    id_tema: int,
    dificultad: str,
    profesor: Profesor = Depends(get_current_profesor),
    db: Session = Depends(get_db)
):

    return ConfiguracionQuizService.obtener_configuracion(
        db=db,
        id_profesor=profesor.id_profesor,
        id_competencia=id_competencia,
        id_submodulo=id_submodulo,
        id_tema=id_tema,
        dificultad=dificultad
    )
    
@router.patch(
    "/estado/{id_configuracion}",
    response_model=ConfiguracionQuizResponse
)
def cambiar_estado(
    id_configuracion: int,
    profesor: Profesor = Depends(get_current_profesor),
    db: Session = Depends(get_db)
):

    return ConfiguracionQuizService.cambiar_estado(
        db=db,
        id_configuracion=id_configuracion
    )