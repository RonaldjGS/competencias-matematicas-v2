from app.database.base import Base
from app.database.database import engine

import app.models

Base.metadata.create_all(bind=engine)

print("Tablas creadas correctamente")