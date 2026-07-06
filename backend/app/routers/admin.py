from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from typing import List

from app.database.database import get_db

from app.services.admin_service import (
    obtener_resumen_dashboard,
    obtener_usuarios
)

from app.schemas.admin import (
    DashboardResumen,
    UsuarioAdmin
)

# ==========================================
# ROUTER
# ==========================================

router = APIRouter(

    prefix="/admin",

    tags=["Administrador"]

)

# ==========================================
# RESUMEN DASHBOARD
# ==========================================

@router.get(

    "/dashboard/resumen",

    response_model=DashboardResumen

)

def resumen_dashboard(

    db: Session = Depends(get_db)

):

    return obtener_resumen_dashboard(db)


# ==========================================
# LISTA USUARIOS
# ==========================================

@router.get(

    "/usuarios",

    response_model=List[UsuarioAdmin]

)

def lista_usuarios(

    db: Session = Depends(

        get_db

    )

):

    return obtener_usuarios(

        db

    )