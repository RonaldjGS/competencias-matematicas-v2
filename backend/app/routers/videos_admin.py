from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database.database import (
    get_db
)

from app.schemas.videos import (
    VideoUpdate
)

from app.services.videos_admin_service import (

    obtener_resumen_videos_admin,

    obtener_videos_admin,

    obtener_video_admin,

    actualizar_video_admin,

    actualizar_estado_video_admin,

    eliminar_video_admin

)

router = APIRouter(

    prefix="/admin/videos",

    tags=["Administrador - Videos"]

)

# ==========================================
# RESUMEN
# ==========================================

@router.get(

    "/resumen"

)
def resumen_videos(

    db: Session = Depends(get_db)

):

    return obtener_resumen_videos_admin(db)


# ==========================================
# LISTA
# ==========================================

@router.get(

    "/lista"

)
def lista_videos(

    db: Session = Depends(get_db)

):

    return obtener_videos_admin(db)


# ==========================================
# DETALLE
# ==========================================

@router.get(

    "/{id_video}"

)
def detalle_video(

    id_video: int,

    db: Session = Depends(get_db)

):

    video = obtener_video_admin(

        db,

        id_video

    )

    if video is None:

        raise HTTPException(

            status_code=404,

            detail="Video no encontrado"

        )

    return video


# ==========================================
# ACTUALIZAR
# ==========================================

@router.put(

    "/actualizar/{id_video}"

)
def actualizar_video(

    id_video: int,

    datos: VideoUpdate,

    db: Session = Depends(get_db)

):

    respuesta = actualizar_video_admin(

        db,

        id_video,

        datos

    )

    if "error" in respuesta:

        raise HTTPException(

            status_code=400,

            detail=respuesta["error"]

        )

    return respuesta


# ==========================================
# CAMBIAR ESTADO
# ==========================================

@router.patch(

    "/estado/{id_video}"

)
def cambiar_estado(

    id_video: int,

    db: Session = Depends(get_db)

):

    respuesta = actualizar_estado_video_admin(

        db,

        id_video

    )

    if respuesta is None:

        raise HTTPException(

            status_code=404,

            detail="Video no encontrado"

        )

    return respuesta


# ==========================================
# ELIMINAR
# ==========================================

@router.delete(

    "/eliminar/{id_video}"

)
def eliminar_video(

    id_video: int,

    db: Session = Depends(get_db)

):

    respuesta = eliminar_video_admin(

        db,

        id_video

    )

    if respuesta is None:

        raise HTTPException(

            status_code=404,

            detail="Video no encontrado"

        )

    return respuesta