from app.database.database import engine

try:
    with engine.connect() as conn:
        print("Conexión exitosa con MySQL")
except Exception as e:
    print("Error:", e)