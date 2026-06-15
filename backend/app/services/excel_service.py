import pandas as pd

from fastapi import HTTPException

def leer_excel_preguntas(
    archivo
):

    try:

        df = pd.read_excel(
            archivo.file
        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Error al leer archivo Excel"
        )

    if df.empty:

        raise HTTPException(
            status_code=400,
            detail="El archivo está vacío"
        )

    columnas_requeridas = [

        "Pregunta",

        "Opcion_A",

        "Opcion_B",

        "Opcion_C",

        "Opcion_D",

        "Respuesta_Correcta",

        "Dificultad",

        "Justificacion",

        "Tiempo_Estimado"
    ]

    for columna in columnas_requeridas:

        if columna not in df.columns:

            raise HTTPException(
                status_code=400,
                detail=f"Falta la columna {columna}"
            )

    return df

def respuesta_valida(
    respuesta: str
):

    return respuesta in [
        "A",
        "B",
        "C",
        "D"
    ]
    