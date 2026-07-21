import os

import shutil

from datetime import datetime

from sqlalchemy import desc

from sqlalchemy.orm import Session

from fastapi import UploadFile

import uuid

from app.models.academico import (

    ContenidoAcademico,

    TipoContenidoAcademico,

    Competencia,

    Submodulo,

    Tema

)

from app.models.usuarios import (

    Profesor

)

# ==========================================
# UTILIDADES
# ==========================================

def fila_a_dict(fila):

    if fila is None:

        return None

    return dict(fila._mapping)


def filas_a_lista(filas):

    return [

        dict(fila._mapping)

        for fila in filas

    ]

# ==========================================
# CARPETAS DE CONTENIDO
# ==========================================

BASE_UPLOAD = os.path.join(

    "uploads",

    "contenido_academico"

)

CARPETAS = {

    "PDF": "pdf",

    "WORD": "word",

    "EXCEL": "excel",

    "POWERPOINT": "powerpoint",

    "IMAGEN": "imagen",

    "ARTICULO": "articulo",

    "OTRO": "otros"

}

for carpeta in CARPETAS.values():

    os.makedirs(

        os.path.join(

            BASE_UPLOAD,

            carpeta

        ),

        exist_ok=True

    )

# ==========================================
# RESUMEN
# ==========================================

def obtener_resumen_contenido(

    db: Session,
    
    id_nivel: int

):

    total = (

        db.query(

            ContenidoAcademico

        )

        .join(

            Tema,

            Tema.id_tema ==

            ContenidoAcademico.id_tema

        )

        .filter(

            Tema.id_nivel == id_nivel

        )

        .count()

    )

    activos = (

        db.query(

            ContenidoAcademico

        )

        .join(

            Tema,

            Tema.id_tema ==

            ContenidoAcademico.id_tema

        )

        .filter(

            ContenidoAcademico.estado == True,

            Tema.id_nivel == id_nivel

        )

        .count()

    )

    inactivos = (

        db.query(

            ContenidoAcademico

        )

        .join(

            Tema,

            Tema.id_tema ==

            ContenidoAcademico.id_tema

        )

        .filter(

            ContenidoAcademico.estado == False,

            Tema.id_nivel == id_nivel

        )

        .count()

    )

    return {

        "total": total,

        "activos": activos,

        "inactivos": inactivos

    }
    
# ==========================================
# LISTA CONTENIDOS
# ==========================================

def obtener_contenidos(

    db: Session,
    
    id_nivel: int

):

    resultados = (

        db.query(

            ContenidoAcademico.id_contenido,

            ContenidoAcademico.id_profesor,

            ContenidoAcademico.id_competencia,

            ContenidoAcademico.id_submodulo,

            ContenidoAcademico.id_tema,

            ContenidoAcademico.id_tipo_contenido,

            ContenidoAcademico.nombre_contenido,

            ContenidoAcademico.descripcion_contenido,

            ContenidoAcademico.archivo,

            ContenidoAcademico.extension,

            ContenidoAcademico.tamano_archivo,

            ContenidoAcademico.estado,

            ContenidoAcademico.created_at,

            ContenidoAcademico.updated_at,

            TipoContenidoAcademico.nombre_tipo.label(

                "tipo_contenido"

            ),

            Competencia.nombre_competencia.label(

                "competencia"

            ),

            Submodulo.nombre_submodulo.label(

                "submodulo"

            ),

            Tema.nombre_tema.label(

                "tema"

            ),

            Profesor.nombre_profesor.label(

                "profesor"

            )

        )

        .join(

            Profesor,

            Profesor.id_profesor ==

            ContenidoAcademico.id_profesor

        )

        .join(

            Competencia,

            Competencia.id_competencia ==

            ContenidoAcademico.id_competencia

        )

        .join(

            Submodulo,

            Submodulo.id_submodulo ==

            ContenidoAcademico.id_submodulo

        )

        .join(

            Tema,

            Tema.id_tema ==

            ContenidoAcademico.id_tema

        )

        .join(

            TipoContenidoAcademico,

            TipoContenidoAcademico.id_tipo_contenido ==

            ContenidoAcademico.id_tipo_contenido

        )
        
        .filter(

            Tema.id_nivel == id_nivel

        )

        .order_by(

            desc(

                ContenidoAcademico.updated_at

            )

        )

        .all()

    )

    return filas_a_lista(

        resultados

    )
    
# ==========================================
# CREAR CONTENIDO
# ==========================================

def crear_contenido(

    db: Session,

    archivo: UploadFile,

    id_profesor: int,

    id_competencia: int,

    id_submodulo: int,

    id_tema: int,

    id_tipo_contenido: int,

    nombre_contenido: str,

    descripcion_contenido: str | None

):

    # ==========================================
    # VALIDAR CATÁLOGOS
    # ==========================================

    competencia = db.query(

        Competencia

    ).filter(

        Competencia.id_competencia ==

        id_competencia

    ).first()

    if not competencia:

        return {

            "error":

            "La competencia no existe."

        }

    submodulo = db.query(

        Submodulo

    ).filter(

        Submodulo.id_submodulo ==

        id_submodulo

    ).first()

    if not submodulo:

        return {

            "error":

            "El submódulo no existe."

        }

    tema = db.query(

        Tema

    ).filter(

        Tema.id_tema ==

        id_tema

    ).first()

    if not tema:

        return {

            "error":

            "El tema no existe."

        }

    tipo = db.query(

        TipoContenidoAcademico

    ).filter(

        TipoContenidoAcademico.id_tipo_contenido ==

        id_tipo_contenido

    ).first()

    if not tipo:

        return {

            "error":

            "El tipo de contenido no existe."

        }
        
    if not archivo.filename:

        return {

            "error":

            "Debe seleccionar un archivo."

        }
        
    # ==========================================
    # VALIDAR TIPO DE ARCHIVO
    # ==========================================

    extension = os.path.splitext(

        archivo.filename

    )[1].replace(

        ".",

        ""

    ).lower()

    EXTENSIONES_PERMITIDAS = {

        "PDF": ["pdf"],

        "WORD": ["doc", "docx"],

        "EXCEL": ["xls", "xlsx"],

        "POWERPOINT": ["ppt", "pptx"],

        "IMAGEN": ["jpg", "jpeg", "png"],

        "ARTICULO": ["pdf"],

        "OTRO": []

    }
    
    # ==========================================
    # VALIDAR MIME TYPE
    # ==========================================

    TIPOS_MIME = {

        "PDF":[

            "application/pdf"

        ],

        "WORD":[

            "application/msword",

            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

        ],

        "EXCEL":[

            "application/vnd.ms-excel",

            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

        ],

        "POWERPOINT":[

            "application/vnd.ms-powerpoint",

            "application/vnd.openxmlformats-officedocument.presentationml.presentation"

        ],

        "IMAGEN":[

            "image/jpeg",

            "image/png"

        ],

        "ARTICULO":[

            "application/pdf"

        ],

        "OTRO":[]

    }

    permitidas = EXTENSIONES_PERMITIDAS.get(

        tipo.nombre_tipo.upper(),

        []

    )

    if permitidas and extension not in permitidas:

        return {

            "error":

            f"El archivo debe ser del tipo: {', '.join(permitidas)}."

        }  
        
    mime_permitidos = TIPOS_MIME.get(

        tipo.nombre_tipo.upper(),

        []

    )

    if mime_permitidos and archivo.content_type not in mime_permitidos:

        return {

            "error":

            "El archivo seleccionado no corresponde al tipo de contenido elegido."

        }
        
    # ==========================================
    # VALIDAR TAMAÑO
    # ==========================================

    MAX_SIZE = 20 * 1024 * 1024

    archivo.file.seek(0, os.SEEK_END)

    tamano = archivo.file.tell()

    archivo.file.seek(0)

    if tamano > MAX_SIZE:

        return {

            "error":

            "El archivo supera el tamaño máximo permitido (20 MB)."

        }

    # ==========================================
    # VALIDAR DUPLICADO
    # ==========================================

    existe = db.query(

        ContenidoAcademico

    ).filter(

        ContenidoAcademico.nombre_contenido ==

        nombre_contenido,

        ContenidoAcademico.id_competencia ==

        id_competencia,

        ContenidoAcademico.id_submodulo ==

        id_submodulo,

        ContenidoAcademico.id_tema ==

        id_tema

    ).first()

    if existe:

        return {

            "error":

            "Ya existe un contenido con ese nombre."

        }

    # ==========================================
    # GUARDAR ARCHIVO
    # ==========================================


    nombre_archivo = (

        f"{uuid.uuid4()}"

        f".{extension}"

    )

    carpeta = CARPETAS.get(

        tipo.nombre_tipo.upper(),

        "otros"

    )

    ruta_archivo = os.path.join(

        BASE_UPLOAD,

        carpeta,

        nombre_archivo

    )
    

    with open(

        ruta_archivo,

        "wb"

    ) as buffer:

        shutil.copyfileobj(

            archivo.file,

            buffer

        )

    # ==========================================
    # REGISTRAR
    # ==========================================

    contenido = ContenidoAcademico(

        id_profesor=id_profesor,

        id_competencia=id_competencia,

        id_submodulo=id_submodulo,

        id_tema=id_tema,

        id_tipo_contenido=id_tipo_contenido,

        nombre_contenido=nombre_contenido,

        descripcion_contenido=descripcion_contenido,

        archivo=os.path.join(

            carpeta,

            nombre_archivo

        ),

        extension=extension,

        tamano_archivo=tamano,

        estado=True

    )
    
    db.add(

        contenido

    )

    db.commit()

    db.refresh(

        contenido

    )

    return {

        "mensaje":

        "Contenido registrado correctamente.",

        "id_contenido":

        contenido.id_contenido

    }
    
    
# ==========================================
# DETALLE CONTENIDO
# ==========================================

def obtener_contenido(

    db: Session,

    id_contenido: int

):

    resultado = (

        db.query(

            ContenidoAcademico.id_contenido,

            ContenidoAcademico.id_profesor,

            ContenidoAcademico.id_competencia,

            ContenidoAcademico.id_submodulo,

            ContenidoAcademico.id_tema,

            ContenidoAcademico.id_tipo_contenido,

            Profesor.nombre_profesor.label("profesor"),

            Competencia.nombre_competencia.label("competencia"),

            Submodulo.nombre_submodulo.label("submodulo"),

            Tema.nombre_tema.label("tema"),

            TipoContenidoAcademico.nombre_tipo.label("tipo_contenido"),

            ContenidoAcademico.nombre_contenido,

            ContenidoAcademico.descripcion_contenido,

            ContenidoAcademico.archivo,

            ContenidoAcademico.extension,

            ContenidoAcademico.tamano_archivo,

            ContenidoAcademico.estado,

            ContenidoAcademico.created_at,

            ContenidoAcademico.updated_at

        )

        .join(

            Profesor,

            Profesor.id_profesor == ContenidoAcademico.id_profesor

        )

        .join(

            Competencia,

            Competencia.id_competencia == ContenidoAcademico.id_competencia

        )

        .join(

            Submodulo,

            Submodulo.id_submodulo == ContenidoAcademico.id_submodulo

        )

        .join(

            Tema,

            Tema.id_tema == ContenidoAcademico.id_tema

        )

        .join(

            TipoContenidoAcademico,

            TipoContenidoAcademico.id_tipo_contenido == ContenidoAcademico.id_tipo_contenido

        )

        .filter(

            ContenidoAcademico.id_contenido == id_contenido

        )

        .first()

    )

    if resultado is None:

        return None

    return fila_a_dict(

        resultado

    )
    

# ==========================================
# ACTUALIZAR CONTENIDO
# ==========================================

def actualizar_contenido(

    db: Session,

    id_contenido: int,

    datos

):

    contenido = (

        db.query(

            ContenidoAcademico

        )

        .filter(

            ContenidoAcademico.id_contenido ==

            id_contenido

        )

        .first()

    )

    if not contenido:

        return {

            "mensaje":"Contenido actualizado correctamente.",

            "id_contenido":contenido.id_contenido

        }

    contenido.id_competencia = datos.id_competencia

    contenido.id_submodulo = datos.id_submodulo

    contenido.id_tema = datos.id_tema

    contenido.id_tipo_contenido = datos.id_tipo_contenido

    contenido.nombre_contenido = datos.nombre_contenido

    contenido.descripcion_contenido = datos.descripcion_contenido

    contenido.updated_at = datetime.now()

    db.commit()

    db.refresh(

        contenido

    )

    return {

        "mensaje":

        "Contenido actualizado correctamente."

    }
    

# ==========================================
# CAMBIAR ESTADO
# ==========================================

def cambiar_estado_contenido(

    db: Session,

    id_contenido: int

):

    contenido = (

        db.query(

            ContenidoAcademico

        )

        .filter(

            ContenidoAcademico.id_contenido ==

            id_contenido

        )

        .first()

    )

    if not contenido:

        return None

    contenido.estado = not contenido.estado

    contenido.updated_at = datetime.now()

    db.commit()

    db.refresh(

        contenido

    )

    return {

        "mensaje":"Estado actualizado correctamente.",

        "estado":contenido.estado

    }


# ==========================================
# ELIMINAR CONTENIDO
# ==========================================

def eliminar_contenido(

    db: Session,

    id_contenido: int

):

    contenido = (

        db.query(

            ContenidoAcademico

        )

        .filter(

            ContenidoAcademico.id_contenido ==

            id_contenido

        )

        .first()

    )

    if not contenido:

        return None

    ruta_archivo = os.path.join(

        BASE_UPLOAD,

        contenido.archivo

    )

    if os.path.exists(

        ruta_archivo

    ):

        os.remove(

            ruta_archivo

        )

    db.delete(

        contenido

    )

    db.commit()

    return {

        "mensaje":

        "Contenido eliminado correctamente."

    }
    
    
# ==========================================
# CONTENIDOS ESTUDIANTE
# ==========================================

def obtener_contenidos_estudiante(

    db: Session,

    estudiante

):

    resultados = (

        db.query(

            ContenidoAcademico.id_contenido,

            ContenidoAcademico.id_profesor,

            ContenidoAcademico.id_competencia,

            ContenidoAcademico.id_submodulo,

            ContenidoAcademico.id_tema,

            ContenidoAcademico.id_tipo_contenido,

            ContenidoAcademico.nombre_contenido,

            ContenidoAcademico.descripcion_contenido,

            TipoContenidoAcademico.nombre_tipo.label(

                "tipo_contenido"

            ),

            Competencia.nombre_competencia.label(

                "competencia"

            ),

            Submodulo.nombre_submodulo.label(

                "submodulo"

            ),

            Tema.nombre_tema.label(

                "tema"

            ),

            ContenidoAcademico.archivo,

            ContenidoAcademico.extension,

            ContenidoAcademico.tamano_archivo,

            ContenidoAcademico.estado,

            ContenidoAcademico.created_at,

            ContenidoAcademico.updated_at

        )

        .join(

            Competencia,

            Competencia.id_competencia ==

            ContenidoAcademico.id_competencia

        )

        .join(

            Submodulo,

            Submodulo.id_submodulo ==

            ContenidoAcademico.id_submodulo

        )

        .join(

            Tema,

            Tema.id_tema ==

            ContenidoAcademico.id_tema

        )

        .join(

            TipoContenidoAcademico,

            TipoContenidoAcademico.id_tipo_contenido ==

            ContenidoAcademico.id_tipo_contenido

        )

        .filter(

            ContenidoAcademico.estado == True,

            Tema.id_nivel ==

            estudiante.id_nivel

        )

        .order_by(

            desc(

                ContenidoAcademico.updated_at

            )

        )

        .all()

    )

    return filas_a_lista(

        resultados

    )