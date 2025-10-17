import sqlite3

conn = sqlite3.connect("server/DB/users.db")
cursor = conn.cursor()

# Crear tabla usuarios
cursor.execute("""
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)
""")

# Insertar usuarios de prueba
cursor.executemany("""
INSERT OR IGNORE INTO usuarios (username, password)
VALUES (?, ?)
""", [
    ("admin", "1234"),
    ("user1", "abcd"),
])

conn.commit()
conn.close()
print("Tabla de usuarios creada ✔")
