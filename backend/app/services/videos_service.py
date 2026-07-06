from sqlalchemy.orm import Session

from sqlalchemy import (
    func,
    desc
)

from app.models.academico import (
    Video,
    Competencia,
    Submodulo,
    Tema
)

from app.models.usuarios import (
    Profesor
)

import re

# ==========================================
# RESUMEN VIDEOS
# ==========================================

def obtener_resumen_videos(

    db: Session

):

    # ======================================
    # TOTAL VIDEOS
    # ======================================

    total_videos = (

        db.query(

            func.count(

                Video.id_video

            )

        )

        .scalar()

    )

    # ======================================
    # VIDEOS ACTIVOS
    # ======================================

    videos_activos = (

        db.query(

            func.count(

                Video.id_video

            )

        )

        .filter(

            Video.estado == True

        )

        .scalar()

    )

    # ======================================
    # COMPETENCIAS CUBIERTAS
    # ======================================

    competencias = (

        db.query(

            func.count(

                func.distinct(

                    Video.id_competencia

                )

            )

        )

        .scalar()

    )

    # ======================================
    # ÚLTIMA ACTUALIZACIÓN
    # ======================================

    ultima_actualizacion = (

        db.query(

            Video.updated_at

        )

        .order_by(

            desc(

                Video.updated_at

            )

        )

        .first()

    )

    return {

        "total_videos":

        total_videos,

        "videos_activos":

        videos_activos,

        "competencias":

        competencias,

        "ultima_actualizacion":

        ultima_actualizacion.updated_at

        if ultima_actualizacion

        else

        None

    }
    
# ==========================================
# LISTA DE VIDEOS
# ==========================================

def obtener_videos(

    db: Session

):

    videos = (

        db.query(

            Video.id_video,

            Video.titulo,

            Video.descripcion,

            Video.youtube_id,

            Video.tipo,

            Video.estado,

            Video.created_at,

            Video.updated_at,

            Video.id_competencia,

            Video.id_submodulo,

            Video.id_tema,

        )

        .join(

            Competencia,

            Competencia.id_competencia
            ==
            Video.id_competencia

        )

        .join(

            Submodulo,

            Submodulo.id_submodulo
            ==
            Video.id_submodulo

        )

        .join(

            Tema,

            Tema.id_tema
            ==
            Video.id_tema

        )

        .order_by(

            desc(

                Video.updated_at

            )

        )

        .all()

    )

    resultado = []

    for fila in videos:

        resultado.append({

            "id_video":

            fila.id_video,

            "titulo":

            fila.titulo,

            "descripcion":

            fila.descripcion,

            "id_competencia":

            fila.id_competencia,

            "id_submodulo":

            fila.id_submodulo,

            "id_tema":

            fila.id_tema,

            "youtube_id": 
                
            fila.youtube_id,

            "tipo":

            fila.tipo,

            "estado":

            "Activo"

            if fila.estado

            else

            "Inactivo",

            "created_at":

            fila.created_at,

            "updated_at":

            fila.updated_at
        })

    return resultado

# ==========================================
# EXTRAER ID DE YOUTUBE
# ==========================================

def extraer_youtube_id(

    url: str

):

    patron = (

        r"(?:v=|\/)([0-9A-Za-z_-]{11})"

    )

    resultado = re.search(

        patron,

        url

    )

    if resultado:

        return resultado.group(1)

    return None


# ==========================================
# VALIDAR CATÁLOGOS DEL VIDEO
# ==========================================

def validar_catalogos_video(

    db: Session,

    id_competencia: int,

    id_submodulo: int,

    id_tema: int

):

    competencia = (

        db.query(

            Competencia

        )

        .filter(

            Competencia.id_competencia
            ==
            id_competencia

        )

        .first()

    )

    if not competencia:

        return {

            "error":

            "La competencia no existe"

        }

    submodulo = (

        db.query(

            Submodulo

        )

        .filter(

            Submodulo.id_submodulo
            ==
            id_submodulo

        )

        .first()

    )

    if not submodulo:

        return {

            "error":

            "El submódulo no existe"

        }

    tema = (

        db.query(

            Tema

        )

        .filter(

            Tema.id_tema
            ==
            id_tema

        )

        .first()

    )

    if not tema:

        return {

            "error":

            "El tema no existe"

        }

    return None

# ==========================================
# CREAR VIDEO
# ==========================================


def crear_video(

    db: Session,

    datos

):

    # ======================================
    # VALIDAR CATÁLOGOS
    # ======================================

    validacion = validar_catalogos_video(

        db,

        datos.id_competencia,

        datos.id_submodulo,

        datos.id_tema

    )

    if validacion:

        return validacion

    # ======================================
    # EXTRAER ID DE YOUTUBE
    # ======================================

    youtube_id = extraer_youtube_id(

        datos.youtube_url

    )

    if youtube_id is None:

        return {

            "error":

            "URL de YouTube inválida"

        }
    # ======================================
    # CREAR VIDEO
    # ======================================

    nuevo = Video(

        titulo=datos.titulo,

        descripcion=datos.descripcion,

        id_competencia=datos.id_competencia,

        id_submodulo=datos.id_submodulo,

        id_tema=datos.id_tema,

        youtube_id=youtube_id,

        tipo=datos.tipo,

        estado=datos.estado,

        actualizado_por=datos.actualizado_por

    )

    db.add(

        nuevo

    )

    db.commit()

    db.refresh(

        nuevo

    )

    return {

        "mensaje":

        "Video registrado correctamente",

        "id_video":

        nuevo.id_video

    }
    
# ==========================================
# OBTENER VIDEO POR ID
# ==========================================   

def obtener_video(

    db: Session,

    id_video: int

):

    video = (

        db.query(

            Video.id_video,

            Video.titulo,

            Video.descripcion,

            Video.youtube_id,

            Video.tipo,

            Video.estado,

            Video.created_at,

            Video.updated_at,

            Video.actualizado_por,

            Competencia.id_competencia,

            Competencia.nombre_competencia,

            Submodulo.id_submodulo,

            Submodulo.nombre_submodulo,

            Tema.id_tema,

            Tema.nombre_tema

        )

        .join(

            Competencia,

            Competencia.id_competencia
            ==
            Video.id_competencia

        )

        .join(

            Submodulo,

            Submodulo.id_submodulo
            ==
            Video.id_submodulo

        )

        .join(

            Tema,

            Tema.id_tema
            ==
            Video.id_tema

        )

        .filter(

            Video.id_video
            ==
            id_video

        )

        .first()

    )

    if not video:

        return None

    return {

        "id_video": video.id_video,

        "titulo": video.titulo,

        "descripcion": video.descripcion,

        "youtube_id": video.youtube_id,

        "tipo": video.tipo,

        "estado": video.estado,

        "created_at": video.created_at,

        "updated_at": video.updated_at,

        "actualizado_por": video.actualizado_por,

        "id_competencia": video.id_competencia,

        "competencia": video.nombre_competencia,

        "id_submodulo": video.id_submodulo,

        "submodulo": video.nombre_submodulo,

        "id_tema": video.id_tema,

        "tema": video.nombre_tema

    }
    
# ==========================================
# ACTUALIZAR ESTADO VIDEO
# ==========================================

def actualizar_estado_video(

    db: Session,

    id_video: int

):

    video = (

        db.query(

            Video

        )

        .filter(

            Video.id_video
            ==
            id_video

        )

        .first()

    )

    if not video:

        return None

    video.estado = not video.estado

    db.commit()

    db.refresh(

        video

    )

    return {

        "mensaje":

        "Estado actualizado correctamente",

        "estado":

        video.estado,

        "estado_texto":

        "Activo"

        if video.estado

        else

        "Inactivo"

    }
    
# ==========================================
# ELIMINAR VIDEO
# ==========================================

def eliminar_video(

    db: Session,

    id_video: int

):

    video = (

        db.query(

            Video

        )

        .filter(

            Video.id_video
            ==
            id_video

        )

        .first()

    )

    if not video:

        return None

    db.delete(

        video

    )

    db.commit()

    return {

        "mensaje":

        "Video eliminado correctamente"

    }
    

# ==========================================
# ACTUALIZAR VIDEO
# ==========================================

def actualizar_video(

    db: Session,

    id_video: int,

    datos

):

    video = (

        db.query(Video)

        .filter(

            Video.id_video == id_video

        )

        .first()

    )

    if video is None:

        return {

            "error":

            "Video no encontrado"

        }

    # ======================================
    # VALIDAR CATÁLOGOS
    # ======================================

    validacion = validar_catalogos_video(

        db,

        datos.id_competencia,

        datos.id_submodulo,

        datos.id_tema

    )

    if validacion:

        return validacion

    # ======================================
    # EXTRAER ID YOUTUBE
    # ======================================

    youtube_id = extraer_youtube_id(

        datos.youtube_url

    )

    if youtube_id is None:

        return {

            "error":

            "URL de YouTube inválida"

        }

    # ======================================
    # ACTUALIZAR
    # ======================================

    video.titulo = datos.titulo

    video.descripcion = datos.descripcion

    video.id_competencia = datos.id_competencia

    video.id_submodulo = datos.id_submodulo

    video.id_tema = datos.id_tema

    video.youtube_id = youtube_id

    video.tipo = datos.tipo

    video.actualizado_por = datos.actualizado_por

    db.commit()

    db.refresh(

        video

    )

    return {

        "mensaje":

        "Video actualizado correctamente"

    }
    
# ==========================================
# VIDEO INTRODUCTORIO ALEATORIO
# ==========================================

def obtener_video_intro(

    db: Session,

    id_competencia: int,

    id_submodulo: int,

    id_tema: int

):

    video = (

        db.query(

            Video.id_video,

            Video.titulo,

            Video.descripcion,

            Video.youtube_id,

            Video.tipo,

            Competencia.nombre_competencia,

            Submodulo.nombre_submodulo,

            Tema.nombre_tema

        )

        .join(

            Competencia,

            Competencia.id_competencia == Video.id_competencia

        )

        .join(

            Submodulo,

            Submodulo.id_submodulo == Video.id_submodulo

        )

        .join(

            Tema,

            Tema.id_tema == Video.id_tema

        )

        .filter(

            Video.estado == True,

            Video.id_competencia == id_competencia,

            Video.id_submodulo == id_submodulo,

            Video.id_tema == id_tema

        )

        .order_by(

            func.rand()

        )

        .first()

    )

    if video is None:

        return None

    return {

        "id_video": video.id_video,

        "titulo": video.titulo,

        "descripcion": video.descripcion,

        "youtube_id": video.youtube_id,

        "tipo": video.tipo,

        "competencia": video.nombre_competencia,

        "submodulo": video.nombre_submodulo,

        "tema": video.nombre_tema

    }