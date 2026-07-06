from sqlalchemy.orm import Session

from app.models.academico import (

    Video,

    VideoEstudiante

)

# ==========================================
# REGISTRAR VIDEO VISTO
# ==========================================

def registrar_video_visto(

    db: Session,

    id_estudiante: int,

    id_video: int

):
    
    video = (

        db.query(

            Video

        )

        .filter(

            Video.id_video == id_video

        )

        .first()

    )

    if video is None:

        return {

            "error":

            "El video no existe"

        }

    registro = VideoEstudiante(

        id_estudiante=id_estudiante,

        id_video=id_video,

        visto_completo=True,

        omitido=False

    )

    db.add(

        registro

    )

    db.commit()

    db.refresh(

        registro

    )

    return {

        "mensaje":

        "Visualización registrada correctamente"

    }
    
# ==========================================
# REGISTRAR VIDEO OMITIDO
# ==========================================

def registrar_video_omitido(

    db: Session,

    id_estudiante: int,

    id_video: int

):
    
    video = (

        db.query(

            Video

        )

        .filter(

            Video.id_video == id_video

        )

        .first()

    )

    if video is None:

        return {

            "error":

            "El video no existe"

        }

    registro = VideoEstudiante(

        id_estudiante=id_estudiante,

        id_video=id_video,

        visto_completo=False,

        omitido=True

    )

    db.add(

        registro

    )

    db.commit()

    db.refresh(

        registro

    )

    return {

        "mensaje":

        "Video omitido correctamente"

    }
    
    