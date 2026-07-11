from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.evaluaciones import ConfiguracionQuiz

from app.schemas.configuracion_quiz import (
    ConfiguracionQuizCreate,
    ConfiguracionQuizUpdate
)

class ConfiguracionQuizService:

    @staticmethod
    def obtener_configuracion(
        db: Session,
        id_profesor: int,
        id_competencia: int,
        id_submodulo: int,
        id_tema: int,
        dificultad: str
    ):

        return (
            db.query(ConfiguracionQuiz)
            .filter(
                ConfiguracionQuiz.id_profesor == id_profesor,
                ConfiguracionQuiz.id_competencia == id_competencia,
                ConfiguracionQuiz.id_submodulo == id_submodulo,
                ConfiguracionQuiz.id_tema == id_tema,
                ConfiguracionQuiz.dificultad == dificultad,
                ConfiguracionQuiz.estado == True
            )
            .first()
        )
    
    
    
    @staticmethod
    def guardar_configuracion(
        db: Session,
        id_profesor: int,
        datos: ConfiguracionQuizCreate
    ):
        configuracion = (
            db.query(ConfiguracionQuiz)
            .filter(
                ConfiguracionQuiz.id_profesor == id_profesor,
                ConfiguracionQuiz.id_competencia == datos.id_competencia,
                ConfiguracionQuiz.id_submodulo == datos.id_submodulo,
                ConfiguracionQuiz.id_tema == datos.id_tema,
                ConfiguracionQuiz.dificultad == datos.dificultad
            )
            .first()
        )
        if configuracion:

            configuracion.cantidad_preguntas = datos.cantidad_preguntas
            configuracion.tiempo_minutos = datos.tiempo_minutos
            configuracion.intentos = datos.intentos
            configuracion.mezclar_preguntas = datos.mezclar_preguntas
            configuracion.mezclar_opciones = datos.mezclar_opciones
            configuracion.mostrar_resultado = datos.mostrar_resultado
            configuracion.estado = True

            db.commit()
            db.refresh(configuracion)

            return configuracion
        
        nueva = ConfiguracionQuiz(

            id_profesor=id_profesor,

            id_competencia=datos.id_competencia,

            id_submodulo=datos.id_submodulo,

            id_tema=datos.id_tema,

            dificultad=datos.dificultad,

            cantidad_preguntas=datos.cantidad_preguntas,

            tiempo_minutos=datos.tiempo_minutos,

            intentos=datos.intentos,

            mezclar_preguntas=datos.mezclar_preguntas,

            mezclar_opciones=datos.mezclar_opciones,

            mostrar_resultado=datos.mostrar_resultado,

            estado=True
        )

        db.add(nueva)

        db.commit()

        db.refresh(nueva)

        return nueva
    
    @staticmethod
    def cambiar_estado(
        db: Session,
        id_configuracion: int
    ):

        configuracion = (
            db.query(ConfiguracionQuiz)
            .filter(
                ConfiguracionQuiz.id_configuracion == id_configuracion
            )
            .first()
        )

        if not configuracion:

            raise HTTPException(
                status_code=404,
                detail="Configuración no encontrada."
            )

        configuracion.estado = not configuracion.estado

        db.commit()

        db.refresh(configuracion)

        return configuracion
    
    @staticmethod
    def obtener_configuracion_estudiante(
        db: Session,
        id_competencia: int,
        id_submodulo: int,
        id_tema: int,
        dificultad: str
    ):

        return (
            db.query(ConfiguracionQuiz)
            .filter(
                ConfiguracionQuiz.id_competencia == id_competencia,
                ConfiguracionQuiz.id_submodulo == id_submodulo,
                ConfiguracionQuiz.id_tema == id_tema,
                ConfiguracionQuiz.dificultad == dificultad,
                ConfiguracionQuiz.estado == True
            )
            .first()
        )