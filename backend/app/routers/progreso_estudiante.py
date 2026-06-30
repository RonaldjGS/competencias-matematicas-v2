from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.schemas.progreso import ResumenProgresoOut

from app.services.progreso_estudiante_service import (

    obtener_resumen_progreso

)

from app.services.dashboard_estudiante_service import (

    obtener_rendimiento_temas,
    obtener_evolucion_rendimiento,
    obtener_rendimiento_competencias,
    obtener_rendimiento_submodulos,
    obtener_rendimiento_dificultad,
    obtener_historial_completo

)


router = APIRouter(

    prefix="/progreso",

    tags=["Progreso"]

)


@router.get(

    "/resumen/{id_estudiante}",

    response_model=ResumenProgresoOut

)

def resumen(

    id_estudiante: int,

    db: Session = Depends(get_db)

):

    return obtener_resumen_progreso(

        db,

        id_estudiante

    )
    
@router.get(

    "/temas/{id_estudiante}"

)

def rendimiento_temas(

    id_estudiante:int,

    db:Session=Depends(get_db)

):

    return obtener_rendimiento_temas(

        db,

        id_estudiante

    )
    
# ==========================================
# EVOLUCIÓN DEL RENDIMIENTO
# ==========================================

@router.get(

    "/evolucion/{id_estudiante}"

)

def evolucion_rendimiento(

    id_estudiante:int,
    
    dias:int=7,

    db:Session=Depends(get_db)

):

    return obtener_evolucion_rendimiento(

        db,

        id_estudiante,
        
        dias

    )
    
# ==========================================
# RENDIMIENTO POR COMPETENCIA
# ==========================================

@router.get(

    "/rendimiento-competencias/{id_estudiante}"

)

def rendimiento_competencias(

    id_estudiante:int,

    db:Session=Depends(get_db)

):

    return obtener_rendimiento_competencias(

        db,

        id_estudiante

    )
    
# ==========================================
# RENDIMIENTO POR SUBMÓDULO
# ==========================================

@router.get(

    "/rendimiento-submodulos/{id_estudiante}"

)

def rendimiento_submodulos(

    id_estudiante:int,

    db:Session=Depends(get_db)

):

    return obtener_rendimiento_submodulos(

        db,

        id_estudiante

    )
    
@router.get("/rendimiento-dificultad/{id_estudiante}")
def rendimiento_dificultad(

    id_estudiante:int,

    id_competencia:int | None = None,

    id_submodulo:int | None = None,

    id_tema:int | None = None,

    db:Session = Depends(get_db)

):

    return obtener_rendimiento_dificultad(

        db,

        id_estudiante,

        id_competencia,

        id_submodulo,

        id_tema

    )
    
# ==========================================
# HISTORIAL COMPLETO
# ==========================================

@router.get(

    "/historial/{id_estudiante}"

)

def historial(

    id_estudiante:int,

    db:Session=Depends(get_db)

):

    return obtener_historial_completo(

        db,

        id_estudiante

    )