from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database.database import (
    get_db
)

from app.services.videos_service import (
    obtener_resumen_videos,
    obtener_videos,
    crear_video,
    obtener_video,
    actualizar_estado_video,
    eliminar_video,
    actualizar_video,
    obtener_video_intro
)

from app.schemas.videos import (

    VideoCreate,

    VideoEdit,
    
    VideoUpdate,
    
    VideoVisualizado,

    VideoOmitido

)

from app.services.video_estudiante_service import (

    registrar_video_visto,

    registrar_video_omitido

)


router = APIRouter(

    prefix="/videos",

    tags=["Videos"]

)

# ==========================================
# RESUMEN VIDEOS
# ==========================================

@router.get(

    "/resumen"

)

def resumen_videos(

    db: Session = Depends(

        get_db

    )

):

    return obtener_resumen_videos(

        db

    )
    

# ==========================================
# LISTA VIDEOS
# ==========================================

@router.get(

    "/lista"

)

def lista_videos(

    db: Session = Depends(

        get_db

    )

):

    return obtener_videos(

        db

    )
    
# ==========================================
# CREAR VIDEO
# ==========================================

@router.post(

    "/crear"

)

def registrar_video(

    datos: VideoCreate,

    db: Session = Depends(

        get_db

    )

):

    respuesta = crear_video(

        db,

        datos

    )

    if "error" in respuesta:

        raise HTTPException(

            status_code=400,

            detail=respuesta["error"]

        )

    return respuesta

# ==========================================
# VIDEO INTRODUCTORIO
# ==========================================

@router.get("/intro")

def obtener_video_introductorio(

    id_competencia: int,

    id_submodulo: int,

    id_tema: int,

    db: Session = Depends(get_db)

):

    respuesta = obtener_video_intro(

        db,

        id_competencia,

        id_submodulo,

        id_tema

    )

    if respuesta is None:

        raise HTTPException(

            status_code=404,

            detail="No existe un video para esta configuración"

        )

    return respuesta

# ==========================================
# OBTENER VIDEO
# ==========================================

@router.get(

    "/{id_video}"

)

def detalle_video(

    id_video: int,

    db: Session = Depends(

        get_db

    )

):

    video = obtener_video(

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
# ACTUALIZAR ESTADO VIDEO
# ==========================================

@router.patch(

    "/estado/{id_video}"

)

def cambiar_estado_video(

    id_video: int,

    db: Session = Depends(

        get_db

    )

):

    respuesta = actualizar_estado_video(

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
# ELIMINAR VIDEO
# ==========================================

@router.delete(

    "/eliminar/{id_video}"

)

def eliminar_video_router(

    id_video: int,

    db: Session = Depends(

        get_db

    )

):

    respuesta = eliminar_video(

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
# ACTUALIZAR VIDEO
# ==========================================

@router.put(

    "/actualizar/{id_video}"

)

def actualizar(

    id_video: int,

    datos: VideoUpdate,

    db: Session = Depends(get_db)

):

    respuesta = actualizar_video(

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
# REGISTRAR VIDEO VISTO
# ==========================================

@router.post(

    "/visualizado"

)

def registrar_visualizacion(

    datos: VideoVisualizado,

    db: Session = Depends(

        get_db

    )

):

    respuesta = registrar_video_visto(

        db,

        datos.id_estudiante,

        datos.id_video

    )

    if "error" in respuesta:

        raise HTTPException(

            status_code=400,

            detail=respuesta["error"]

        )

    return respuesta

# ==========================================
# REGISTRAR VIDEO OMITIDO
# ==========================================

@router.post(

    "/omitido"

)

def registrar_omision(

    datos: VideoOmitido,

    db: Session = Depends(

        get_db

    )

):

    respuesta = registrar_video_omitido(

        db,

        datos.id_estudiante,

        datos.id_video

    )

    if "error" in respuesta:

        raise HTTPException(

            status_code=400,

            detail=respuesta["error"]

        )

    return respuesta