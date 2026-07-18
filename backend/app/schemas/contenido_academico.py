from datetime import datetime

from pydantic import (

    BaseModel,

    ConfigDict

)

from typing import Optional


# ==========================================
# BASE
# ==========================================

class ContenidoBase(BaseModel):

    id_competencia: int

    id_submodulo: int

    id_tema: int

    id_tipo_contenido: int

    nombre_contenido: str

    descripcion_contenido: Optional[str] = None


# ==========================================
# CREAR
# ==========================================

class ContenidoCreate(ContenidoBase):

    id_profesor: int


# ==========================================
# ACTUALIZAR
# ==========================================

class ContenidoUpdate(BaseModel):

    id_competencia: int

    id_submodulo: int

    id_tema: int

    id_tipo_contenido: int

    nombre_contenido: str

    descripcion_contenido: Optional[str] = None


# ==========================================
# LISTADO
# ==========================================

class ContenidoLista(BaseModel):

    id_contenido: int

    nombre_contenido: str

    tipo_contenido: str

    competencia: str

    submodulo: str

    tema: str

    estado: bool

    created_at: datetime

    model_config = ConfigDict(

        from_attributes=True

    )


# ==========================================
# DETALLE
# ==========================================

class ContenidoDetalle(BaseModel):

    id_contenido: int

    id_profesor: int

    id_competencia: int

    id_submodulo: int

    id_tema: int

    id_tipo_contenido: int

    profesor: str

    competencia: str

    submodulo: str

    tema: str

    tipo_contenido: str

    nombre_contenido: str

    descripcion_contenido: Optional[str]

    archivo: str

    extension: Optional[str]

    tamano_archivo: Optional[int]

    estado: bool

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(

        from_attributes=True

    )


# ==========================================
# RESPUESTA
# ==========================================

class ContenidoResponse(BaseModel):

    mensaje: str

    id_contenido: int
    

