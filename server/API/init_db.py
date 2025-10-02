import sqlite3
import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

json_path = os.path.join(BASE_DIR, "..", "scraping", "productosCOTO.json")

def convertir_precio(precio_str):
    if not precio_str:
        return None
    # "1.999,00" -> "1999.00"
    return float(precio_str.replace(".", "").replace(",", "."))

# Leer productos desde JSON
with open(json_path, "r", encoding="utf-8") as f:
    productos = json.load(f)

# Crear (o conectar si ya existe) la base
conn = sqlite3.connect("server/DB/productos.db")
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

# Preparar datos para insertar
datos = []
for p in productos:
    nombre = p.get("title")
    precio = convertir_precio(p.get("price"))
    categoria = None   # No está en el JSON
    stock = None       # No está en el JSON

    # Filtrar promos si las hubiera (no se guardan en DB)
    promos = [promo for promo in p.get("promo", []) if promo != "Ver planes de cuotas"]

    datos.append((nombre, categoria, precio, stock))

# Insertar datos
cursor.executemany("""
INSERT INTO productos (nombre, categoria, precio, stock)
VALUES (?, ?, ?, ?)
""", datos)

conn.commit()
conn.close()

print("Base de datos creada y cargada desde productosCOTO.json ✔")
