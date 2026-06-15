from datetime import datetime

from pydantic import (
    BaseModel,
    HttpUrl,
    ConfigDict
)

class VideoCreate(BaseModel):

    id_competencia: int

    id_submodulo: int

    id_tema: int

    video_url: HttpUrl
    
class VideoOut(BaseModel):

    id_video: int

    id_nivel: int

    id_competencia: int

    id_submodulo: int

    id_tema: int

    video_url: str

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
    
