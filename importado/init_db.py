import sqlite3

# Crear (o conectar si ya existe) la base
conn = sqlite3.connect("mi_base.db")
cursor = conn.cursor()

# Crear tabla de productos
cursor.execute("""
CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    categoria TEXT,
    precio REAL,
    stock INTEGER
)
""")

# Insertar datos de prueba
cursor.executemany("""
INSERT INTO productos (nombre, categoria, precio, stock)
VALUES (?, ?, ?, ?)
""", [
    ("Manzana", "Frutas", 0.5, 100),
    ("Pan", "Panadería", 1.2, 50),
    ("Leche", "Lácteos", 0.9, 30),
    ("Queso", "Lácteos", 3.5, 20),
    ("Tomate", "Verduras", 0.7, 80),
])

conn.commit()
conn.close()

print("Base de datos creada con productos de comida ✔")
