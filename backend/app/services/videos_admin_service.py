from sqlalchemy.orm import Session

from app.services.videos_service import (
    obtener_resumen_videos,
    obtener_videos,
    obtener_video,
    actualizar_video,
    actualizar_estado_video,
    eliminar_video
)

# ==========================================
# RESUMEN
# ==========================================

def obtener_resumen_videos_admin(
    db: Session
):

    return obtener_resumen_videos(db)


# ==========================================
# LISTA
# ==========================================

def obtener_videos_admin(
    db: Session
):

    return obtener_videos(db)


# ==========================================
# DETALLE
# ==========================================

def obtener_video_admin(
    db: Session,
    id_video: int
):

    return obtener_video(
        db,
        id_video
    )


# ==========================================
# ACTUALIZAR
# ==========================================

def actualizar_video_admin(
    db: Session,
    id_video: int,
    datos
):

    return actualizar_video(
        db,
        id_video,
        datos
    )


# ==========================================
# CAMBIAR ESTADO
# ==========================================

def actualizar_estado_video_admin(
    db: Session,
    id_video: int
):

    return actualizar_estado_video(
        db,
        id_video
    )


# ==========================================
# ELIMINAR
# ==========================================

def eliminar_video_admin(
    db: Session,
    id_video: int
):

    return eliminar_video(
        db,
        id_video
    )