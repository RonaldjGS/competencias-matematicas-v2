from pydantic import BaseModel


class ResumenProgresoOut(BaseModel):

    promedio_general: float | None = None

    test_realizados: int | None = None

    precision_promedio: float | None = None

    tiempo_promedio: int | None = None

