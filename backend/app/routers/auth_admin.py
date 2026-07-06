from fastapi import (

    APIRouter,

    Depends,

    HTTPException,

    status

)

from sqlalchemy.orm import Session

from app.database.database import (

    get_db

)

from app.models.usuarios import (

    Administrador

)

from app.schemas.administrador import (

    AdministradorLogin,

    TokenResponse

)

from app.core.auth import (

    verify_password,

    create_access_token

)

router = APIRouter(

    prefix="/auth/admin",

    tags=["Auth Administrador"]

)


@router.post(

    "/login",

    response_model=TokenResponse

)

def login_admin(

    data: AdministradorLogin,

    db: Session = Depends(

        get_db

    )

):

    admin = (

        db.query(

            Administrador

        )

        .filter(

            Administrador.correo_admin ==

            data.correo

        )

        .first()

    )

    if not admin:

        raise HTTPException(

            status_code=status.HTTP_401_UNAUTHORIZED,

            detail="Correo o contraseña incorrectos"

        )

    if not verify_password(

        data.password,

        admin.password_hash_admin

    ):

        raise HTTPException(

            status_code=status.HTTP_401_UNAUTHORIZED,

            detail="Correo o contraseña incorrectos"

        )

    token = create_access_token(

        {

            "sub": str(

                admin.id_admin

            ),

            "tipo": "admin"

        }

    )

    return {

        "access_token":

        token,

        "token_type":

        "bearer",

        "usuario": {

            "id_admin":

            admin.id_admin,

            "nombre_admin":

            admin.nombre_admin,

            "correo":

            admin.correo_admin

        }

    }