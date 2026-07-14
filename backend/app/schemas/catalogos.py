from pydantic import BaseModel
from pydantic import ConfigDict


class NivelOut(BaseModel):

    id_nivel: int

    nombre_nivel: str

    model_config = ConfigDict(
        from_attributes=True
    )


class CarreraOut(BaseModel):

    id_carrera: int

    nombre_carrera: str

    model_config = ConfigDict(
        from_attributes=True
    )


class CiudadOut(BaseModel):

    id_ciudad: int

    nombre_ciudad: str

    model_config = ConfigDict(
        from_attributes=True
    )


class TipoInstitucionOut(BaseModel):

    id_tipo: int

    nombre_tipo: str

    model_config = ConfigDict(
        from_attributes=True
    )


class CompetenciaOut(BaseModel):

    id_competencia: int

    nombre_competencia: str

    descripcion: str

    model_config = ConfigDict(
        from_attributes=True
    )


class SubmoduloOut(BaseModel):

    id_submodulo: int

    nombre_submodulo: str

    codigo: str

    model_config = ConfigDict(
        from_attributes=True
    )


class TemaOut(BaseModel):

    id_tema: int

    nombre_tema: str

    codigo: str

    id_nivel: int

    model_config = ConfigDict(
        from_attributes=True
    )
    
class TemaDisponibleOut(BaseModel):

    id_tema: int

    nombre_tema: str

    descripcion_tema: str

    ultimo_resultado: float | None = None

    fecha: str | None = None
    
    model_config = ConfigDict(
    from_attributes=True
    )

class ProvinciaOut(BaseModel):


    id_provincia: int

    nombre_provincia: str

    model_config = ConfigDict(
        from_attributes=True
    )

class ProfesorOut(BaseModel):

    id_profesor: int

    nombre_profesor: str

    model_config = ConfigDict(
        from_attributes=True
    )