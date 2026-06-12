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

