from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.usuarios import Profesor

from app.models.catalogos import (
    Competencia,
    Tema,
    Submodulo,
)

from app.models.academico import Video

from app.schemas.videos import (
    VideoCreate,
    VideoOut
)

from app.core.auth import (
    get_current_profesor
)

router = APIRouter(
    prefix="/videos",
    tags=["Videos"]
)

@router.post(
    "",
    response_model=VideoOut
)
def crear_video(
    data: VideoCreate,
    profesor: Profesor = Depends(
        get_current_profesor
    ),
    db: Session = Depends(get_db)
):
    
    competencia = (
        db.query(Competencia)
        .filter(
        Competencia.id_competencia ==
        data.id_competencia
        )
        .first()
    )

    if not competencia:

        raise HTTPException(
            status_code=404,
            detail="Competencia no encontrada"
        )
        
        
    tema = (
        db.query(Tema)
        .filter(
            Tema.id_tema ==
            data.id_tema
        )
        .first()
    )

    if not tema:

        raise HTTPException(
            status_code=404,
            detail="Tema no encontrado"
        )
    
    submodulo = (
        db.query(Submodulo)
        .filter(
            Submodulo.id_submodulo ==
            data.id_submodulo
        )
        .first()
    )
    if not submodulo:

        raise HTTPException(
            status_code=404,
            detail="Submódulo no encontrado"
        )
    
    
    video = Video(

        id_nivel=profesor.id_nivel,

        id_competencia=data.id_competencia,

        id_submodulo=data.id_submodulo,

        id_tema=data.id_tema,

        tema_codigo=tema.codigo,

        tema_nombre=tema.nombre_tema,

        video_url=data.video_url,

        actualizado_por=
        profesor.id_profesor
    )

    db.add(video)

    db.commit()

    db.refresh(video)

    return video

@router.get(
    "/buscar",
    response_model=list[VideoOut]
)
def buscar_videos(
    id_competencia: int,
    id_submodulo: int,
    id_tema: int,
    profesor: Profesor = Depends(
        get_current_profesor
    ),
    db: Session = Depends(get_db)
):
    return (
    db.query(Video)
    .filter(
        Video.actualizado_por ==
        profesor.id_profesor,

        Video.id_competencia ==
        id_competencia,

        Video.id_submodulo ==
        id_submodulo,

        Video.id_tema ==
        id_tema
    )
    .all()
)
    
