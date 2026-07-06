from fastapi import (

    APIRouter,

    Depends,

    HTTPException

)

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.services.dashboard_profesor_service import (

    obtener_resumen_dashboard_profesor,
    
    obtener_rendimiento_competencias,
    
    obtener_preguntas_error,
    
    obtener_precision_dificultad,
    
    obtener_rendimiento_submodulos,
    
    obtener_rendimiento_temas,
    
    obtener_actividad_reciente

)

router = APIRouter(

    prefix="/dashboard-profesor",

    tags=["Dashboard Profesor"]

)

# ==========================================
# RESUMEN DASHBOARD
# ==========================================

@router.get(

    "/resumen/{id_profesor}"

)

def resumen_dashboard(

    id_profesor:int,

    db:Session = Depends(get_db)

):

    datos = obtener_resumen_dashboard_profesor(

        db,

        id_profesor

    )

    if datos is None:

        raise HTTPException(

            status_code=404,

            detail="Profesor no encontrado"

        )

    return datos

# ==========================================
# Obtener Rendimiento Competencia
# ==========================================


@router.get(
    "/competencias/{id_profesor}"
)
def rendimiento_competencias(
    id_profesor:int,
    db:Session=Depends(get_db)
):

    return obtener_rendimiento_competencias(

        db,

        id_profesor

    )
    
# ==========================================
# Preguntas Con Mas Herrores
# ==========================================    
    
@router.get(
    "/preguntas-error/{id_profesor}"
)
def preguntas_error(
    id_profesor:int,
    db:Session=Depends(get_db)
):

    return obtener_preguntas_error(

        db,

        id_profesor

    )
 
# ==========================================
# RENDIMIENTO POR Dificultad
# ==========================================    

@router.get(
    "/precision-dificultad/{id_profesor}"
)
def precision_dificultad(

    id_profesor:int,

    db:Session=Depends(get_db)

):

    return obtener_precision_dificultad(

        db,

        id_profesor

    )
    
# ==========================================
# RENDIMIENTO POR SUBMÓDULO
# ==========================================

@router.get(
    "/rendimiento-submodulos/{id_profesor}"
)
def rendimiento_submodulos(

    id_profesor:int,

    db:Session=Depends(get_db)

):

    return obtener_rendimiento_submodulos(

        db,

        id_profesor

    )
    
# ==========================================
# RENDIMIENTO POR TEMAS
# ==========================================

@router.get(
    "/rendimiento-temas/{id_profesor}"
)
def rendimiento_temas(

    id_profesor:int,

    db:Session=Depends(get_db)

):

    return obtener_rendimiento_temas(

        db,

        id_profesor

    )
    

# ==========================================
# ACTIVIDAD RECIENTE
# ==========================================

@router.get(
    "/actividad-reciente/{id_profesor}"
)
def actividad_reciente(

    id_profesor:int,

    db:Session=Depends(get_db)

):

    return obtener_actividad_reciente(

        db,

        id_profesor

    )