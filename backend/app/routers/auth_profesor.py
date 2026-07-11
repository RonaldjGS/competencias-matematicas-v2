from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.usuarios import (
    Profesor
)

from app.models.catalogos import (
    Rol,
    NivelEducativo,
    Carrera,
    TipoInstitucion,
    Provincia,
    Ciudad
)

from app.schemas.profesor import (
    ProfesorCreate,
    ProfesorLogin,
    TokenResponse,
    ChangePasswordRequest
)

from app.core.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_profesor
)

router = APIRouter(
    prefix="/auth/profesores",
    tags=["Auth Profesores"]
)

@router.post("/register")
def register_profesor(
    data: ProfesorCreate,
    db: Session = Depends(get_db)
):

    correo_existente = (
        db.query(Profesor)
        .filter(
            Profesor.correo ==
            data.correo
        )
        .first()
    )

    if correo_existente:

        raise HTTPException(
            status_code=400,
            detail="El correo ya está registrado"
        )

    nivel = (
        db.query(NivelEducativo)
        .filter(
            NivelEducativo.id_nivel ==
            data.id_nivel
        )
        .first()
    )

    if not nivel:

        raise HTTPException(
            status_code=400,
            detail="Nivel educativo no válido"
        )

    provincia = (
        db.query(Provincia)
        .filter(
            Provincia.id_provincia ==
            data.id_provincia
        )
        .first()
    )

    if not provincia:

        raise HTTPException(
            status_code=400,
            detail="Provincia no válida"
        )
        

    ciudad = (
        db.query(Ciudad)
        .filter(
            Ciudad.id_ciudad ==
            data.id_ciudad
        )
        .first()
    )

    if not ciudad:

        raise HTTPException(
            status_code=400,
            detail="Ciudad no válida"
        )

    if data.id_carrera:

        carrera = (
            db.query(Carrera)
            .filter(
                Carrera.id_carrera ==
                data.id_carrera
            )
            .first()
        )

        if not carrera:

            raise HTTPException(
                status_code=400,
                detail="Carrera no válida"
            )

    if data.id_tipo_institucion:

        tipo = (
            db.query(TipoInstitucion)
            .filter(
                TipoInstitucion.id_tipo ==
                data.id_tipo_institucion
            )
            .first()
        )

        if not tipo:

            raise HTTPException(
                status_code=400,
                detail="Tipo de institución no válido"
            )

    rol_profesor = (
        db.query(Rol)
        .filter(
            Rol.nombre_rol == "Profesor"
        )
        .first()
    )

    if not rol_profesor:

        raise HTTPException(
            status_code=500,
            detail="Rol profesor no configurado"
        )

    nuevo_profesor = Profesor(
        nombre_profesor=data.nombre_profesor,
        institucion_educativa=data.institucion_educativa,
        id_nivel=data.id_nivel,
        id_tipo_institucion=data.id_tipo_institucion,
        id_carrera=data.id_carrera,
        id_provincia=data.id_provincia,
        id_ciudad=data.id_ciudad,
        correo=data.correo,
        password_hash=hash_password(
            data.password
        ),
        id_rol=rol_profesor.id_rol,
        estado=True
    )

    db.add(
        nuevo_profesor
    )

    db.commit()

    db.refresh(
        nuevo_profesor
    )

    return {
        "mensaje":
        "Profesor registrado correctamente"
    }


@router.post(
    "/login",
    response_model=TokenResponse
)
def login_profesor(
    data: ProfesorLogin,
    db: Session = Depends(get_db)
):

    profesor = (
        db.query(Profesor)
        .filter(
            Profesor.correo ==
            data.correo
        )
        .first()
    )

    if not profesor:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos"
        )

    if not verify_password(
        data.password,
        profesor.password_hash
    ):

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos"
        )

    if not profesor.estado:

        raise HTTPException(
            status_code=403,
            detail="Usuario inactivo"
        )

    token = create_access_token(
        {
            "sub": str(
                profesor.id_profesor
            ),
            "tipo": "profesor"
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "usuario": {
            "id_profesor":
            profesor.id_profesor,

            "nombre_profesor":
            profesor.nombre_profesor,

            "correo":
            profesor.correo,
            
            "id_nivel":
            profesor.id_nivel
        }
    }
    

    
@router.put("/change-password")
def change_password(
    data: ChangePasswordRequest,
    profesor: Profesor = Depends(
        get_current_profesor
    ),
    db: Session = Depends(get_db)
):

    if not verify_password(
        data.current_password,
        profesor.password_hash
    ):

        raise HTTPException(
            status_code=400,
            detail="La contraseña actual es incorrecta"
        )

    profesor.password_hash = hash_password(
        data.new_password
    )

    db.commit()

    return {
        "message":
        "Contraseña actualizada correctamente"
    }