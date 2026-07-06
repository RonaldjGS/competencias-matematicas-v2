from app.core.auth import hash_password

password = "Admin12345"

print(
    hash_password(
        password
    )
)