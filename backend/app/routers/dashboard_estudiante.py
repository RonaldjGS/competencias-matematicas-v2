from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.schemas.dashboard_schema import (
    DashboardResumen
)

from app.services.dashboard_estudiante_service import (
    obtener_resumen_dashboard,
    obtener_actividad_reciente
)
from app.schemas.dashboard_schema import RankingResponse

from app.schemas.dashboard_schema import (
    ActividadRecienteResponse
)

from app.services.dashboard_estudiante_service import obtener_ranking_semanal

router = APIRouter(

    prefix="/dashboard-estudiante",

    tags=["Dashboard Estudiante"]
    
    

)

@router.get(
    "/resumen/{id_estudiante}",
    response_model=DashboardResumen
)

def resumen_dashboard(
    id_estudiante: int,
    db: Session = Depends(get_db)
):

    return obtener_resumen_dashboard(
        db,
        id_estudiante
    )
    
@router.get(

    "/ranking/{id_estudiante}",

    response_model=RankingResponse

)

def ranking_dashboard(

    id_estudiante: int,

    db: Session = Depends(get_db)

):

    return obtener_ranking_semanal(

        db,

        id_estudiante

    )
    
@router.get(

    "/actividad/{id_estudiante}",

    response_model=ActividadRecienteResponse

)

def actividad_reciente(

    id_estudiante: int,

    db: Session = Depends(get_db)

):

    return obtener_actividad_reciente(

        db,

        id_estudiante

    )