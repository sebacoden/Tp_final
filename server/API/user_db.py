import sqlite3
import os

# Obtener ruta absoluta al directorio DB
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "DB", "users.db")

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Crear tabla usuarios
cursor.execute("""
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    preferencias TEXT
)
""")

# Insertar usuarios de prueba
cursor.executemany("""
INSERT OR IGNORE INTO usuarios (email, name, password)
VALUES (?, ?, ?)
""", [
    ("admin@example.com", "admin", "1234"),
    ("user1@example.com", "user1", "abcd"),
])

conn.commit()
conn.close()
print("Tabla de usuarios creada ✔")
