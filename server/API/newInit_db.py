import sqlite3
import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
json_path = os.path.join(BASE_DIR, "scraping", "productos_con_categorias.json")
db_origen_path = os.path.join(BASE_DIR, "DB", "productos.db")
db_nueva_path = os.path.join(BASE_DIR, "DB", "productos_completos.db")

def normalizar_texto(texto):
    if not texto:
        return ""
    return texto.strip().lower()

# --- Cargar JSON correcto ---
with open(json_path, "r", encoding="utf-8") as f:
    productos_json = json.load(f)

# Crear un mapa nombre_normalizado -> info del JSON
mapa_json = {
    normalizar_texto(p.get("title")): {
        "subcategoria": p.get("subcategoria"),
        "supercategoria": p.get("supercategoria"),
        "stock": p.get("stock")
    }
    for p in productos_json
}

# --- Conectar a base original ---
if not os.path.exists(db_origen_path):
    raise FileNotFoundError(f"No se encontró la base original en {db_origen_path}")

conn_old = sqlite3.connect(db_origen_path)
cursor_old = conn_old.cursor()

# Leer datos originales
cursor_old.execute("SELECT id, nombre, categoria, precio, stock FROM productos")
productos_db = cursor_old.fetchall()
conn_old.close()

# --- Crear nueva base ---
conn_new = sqlite3.connect(db_nueva_path)
cursor_new = conn_new.cursor()

# Eliminar tabla si existe (para evitar conflictos de UNIQUE)
cursor_new.execute("DROP TABLE IF EXISTS productos")

# Crear tabla nueva
cursor_new.execute("""
CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL,
    categoria TEXT,
    supercategoria TEXT,
    precio REAL,
    stock INTEGER
)
""")

# --- Merge y carga ---
insertados = 0
no_encontrados = 0

for id_, nombre, categoria, precio, stock in productos_db:
    key = normalizar_texto(nombre)
    datos_json = mapa_json.get(key, {})

    subcat = datos_json.get("subcategoria") or categoria
    supercat = datos_json.get("supercategoria")
    stock_final = datos_json.get("stock") if datos_json.get("stock") is not None else stock

    cursor_new.execute("""
        INSERT INTO productos (id, nombre, categoria, supercategoria, precio, stock)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (id_, nombre, subcat, supercat, precio, stock_final))

    insertados += 1
    if not datos_json:
        no_encontrados += 1

conn_new.commit()
conn_new.close()

print(f"✔ Nueva base creada: {db_nueva_path}")
print(f"📦 {insertados} productos insertados correctamente.")
print(f"⚠ {no_encontrados} productos del original no se encontraron en el JSON.")
