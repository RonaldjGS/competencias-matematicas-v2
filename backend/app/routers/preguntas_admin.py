from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from typing import Optional

from app.database.database import (
    get_db
)

from app.schemas.preguntas import (
    PreguntaBancoAdminOut,
    PreguntaDetalleAdminOut,
    PreguntaUpdate,
    PreguntaDetalleAdminOut
)

from app.models.evaluaciones import (
    PreguntaCompetencia
)

from app.services.preguntas_admin_service import (
    obtener_preguntas_admin,
    obtener_detalle_pregunta_admin,
    actualizar_pregunta_admin,
    cambiar_estado_pregunta_admin,
    eliminar_pregunta_admin
)

router = APIRouter(

    prefix="/admin/preguntas",

    tags=["Administrador - Preguntas"]

)

# ==========================================
# BANCO GENERAL DE PREGUNTAS
# ==========================================

@router.get(

    "",

    response_model=list[PreguntaBancoAdminOut]

)

def listar_preguntas(

    id_nivel: Optional[int] = None,

    id_profesor: Optional[int] = None,

    id_competencia: Optional[int] = None,

    id_submodulo: Optional[int] = None,

    id_tema: Optional[int] = None,

    db: Session = Depends(get_db)

):

    return obtener_preguntas_admin(

        db,

        id_nivel,

        id_profesor,

        id_competencia,

        id_submodulo,

        id_tema

    )
    

# ==========================================
# DETALLE PREGUNTA
# ==========================================

@router.get(

    "/{id_pregunta}",

    response_model=PreguntaDetalleAdminOut

)

def detalle_pregunta(

    id_pregunta:int,

    db:Session=Depends(get_db)

):

    return obtener_detalle_pregunta_admin(

        db,

        id_pregunta

    )
    
# ==========================================
# ACTUALIZAR PREGUNTA
# ==========================================

@router.put(

    "/{id_pregunta}",

    response_model=PreguntaDetalleAdminOut

)
def editar_pregunta(

    id_pregunta: int,

    datos: PreguntaUpdate,

    db: Session = Depends(get_db)

):

    pregunta = (

        db.query(

            PreguntaCompetencia

        )

        .filter(

            PreguntaCompetencia.id_pregunta ==

            id_pregunta

        )

        .first()

    )

    if not pregunta:

        raise HTTPException(

            status_code=404,

            detail="Pregunta no encontrada."

        )

    try:

        return actualizar_pregunta_admin(

            pregunta,

            datos,

            db

        )

    except ValueError as e:

        raise HTTPException(

            status_code=400,

            detail=str(e)

        )
        
        
# ==========================================
# CAMBIAR ESTADO
# ==========================================

@router.patch(

    "/{id_pregunta}/estado"

)

def cambiar_estado_pregunta(

    id_pregunta: int,

    db: Session = Depends(get_db)

):

    return cambiar_estado_pregunta_admin(

        db,

        id_pregunta

    )
    
# ==========================================
# ELIMINAR PREGUNTA
# ==========================================

@router.delete(

    "/{id_pregunta}"

)

def eliminar_pregunta(

    id_pregunta:int,

    db:Session = Depends(get_db)

):

    return eliminar_pregunta_admin(

        db,

        id_pregunta

    )