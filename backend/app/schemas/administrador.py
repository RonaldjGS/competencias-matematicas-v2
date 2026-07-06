from pydantic import (

    BaseModel,

    EmailStr

)

# ==========================================
# LOGIN
# ==========================================

class AdministradorLogin(

    BaseModel

):

    correo: EmailStr

    password: str


# ==========================================
# TOKEN
# ==========================================

class TokenResponse(

    BaseModel

):

    access_token: str

    token_type: str

    usuario: dict