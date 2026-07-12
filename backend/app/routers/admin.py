from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from typing import List

from app.database.database import get_db

from app.services.admin_service import (
    obtener_resumen_dashboard,
    obtener_usuarios,
    obtener_detalle_usuario,
    actualizar_usuario_admin
)

from app.schemas.admin import (
    DashboardResumen,
    UsuarioAdmin,
    UsuarioDetalle,
    UsuarioActualizar
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
    
# ==========================================
# DETALLE USUARIO
# ==========================================

@router.get(

    "/usuarios/{tipo_usuario}/{id}",

    response_model=UsuarioDetalle

)

def detalle_usuario(

    tipo_usuario: str,

    id: int,

    db: Session = Depends(get_db)

):

    return obtener_detalle_usuario(

        db,

        tipo_usuario,

        id

    )
    
@router.put(
    "/usuarios/{tipo_usuario}/{id_usuario}"
)

def actualizar_usuario(

    tipo_usuario: str,

    id_usuario: int,

    datos: UsuarioActualizar,

    db: Session = Depends(get_db)

):

    return actualizar_usuario_admin(

        db,

        tipo_usuario,

        id_usuario,

        datos

    )