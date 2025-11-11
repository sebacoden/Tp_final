from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import google.generativeai as genai
import os, random
from dotenv import load_dotenv
import re
from fastapi import HTTPException
from pydantic import BaseModel

def get_gemini_key_from_default():  
    return os.getenv("GEMINI_API_KEY")

def get_gemini_key_from_pool():  
    keys = os.getenv("GEMINI_KEYS").split(",")
    return random.choice(keys)

load_dotenv()

selected_key = get_gemini_key_from_pool()
genai.configure(api_key=selected_key)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

template_path = os.path.join(BASE_DIR, "template_gemini.md")
with open(template_path, "r", encoding="utf-8") as f:
    template_md = f.read()

def get_db_connection(db_name="productos_completos.db"):
    DB_PATH = os.path.join(BASE_DIR, "DB", db_name)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def cargar_mensajes_a_bd(pregunta: str, respuesta: str):
    conn = get_db_connection("mensajes.db")
    try:
        conn.execute(
            "CREATE TABLE IF NOT EXISTS mensajes (id INTEGER PRIMARY KEY AUTOINCREMENT, contenido TEXT, tipo TEXT)"
        )
        conn.execute("INSERT INTO mensajes (contenido, tipo) VALUES (?, ?)", (pregunta, "usuario"))
        conn.execute("INSERT INTO mensajes (contenido, tipo) VALUES (?, ?)", (respuesta, "asistente"))
        conn.commit()
    finally:
        conn.close()


# endpoint para consultas SQL directas
@app.get("/sql")
def run_sql(query: str = Query(..., description="Consulta SQL a ejecutar")):
    conn = get_db_connection()
    try:
        cursor = conn.execute(query)
        rows = cursor.fetchall()
        return {"results": [dict(row) for row in rows]}
    except Exception as e:
        return {"error": str(e)}
    finally:
        conn.close()

# endpoint para consultas en lenguaje natural
class AskRequest(BaseModel):
    question: str
@app.post("/ask")
def ask(request: AskRequest):
    question = request.question
    conn = get_db_connection()
    model = genai.GenerativeModel("gemini-2.5-flash")

    try:
        cursor = conn.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tablas = [row["name"] for row in cursor.fetchall()]
        schema = {}
        for t in tablas:
            cols = conn.execute(f"PRAGMA table_info({t});").fetchall()
            schema[t] = [c[1] for c in cols]

        schema_str = "\n".join([f"{t}({', '.join(cols)})" for t, cols in schema.items()])
        prompt_sql = f"""
            Eres un asistente encargado de generar consultas SQL (SQLite) para responder preguntas de los usuarios.

            Estructura de la base de datos:
            {schema_str}

            Pregunta del usuario:
            "{question}"

            Instrucciones CLAVE:
            1. Solo puedes generar consultas SQL de lectura: **usa exclusivamente SELECT**.
            - No uses INSERT, UPDATE, DELETE, DROP, CREATE ni ninguna otra instrucción que modifique la base de datos.
            2. Si el usuario pide algo que no puede resolverse con SELECT, responde con una consulta SELECT vacía o una que no devuelva resultados (por ejemplo: `SELECT 'Operación no permitida' AS error;`).
            3. Si la pregunta busca el producto "más caro", ordena por `pp.precio_base` en orden descendente (`ORDER BY pp.precio_base DESC`).
            4. Si la pregunta busca el producto con el "mayor descuento", ordena por el porcentaje de descuento en orden descendente (`ORDER BY porcentaje_descuento DESC`).
            5. Solo incluye la condición `WHERE pp.precio_base > pp.precio_final` cuando el contexto sea productos con descuento.
            6. Para búsquedas por nombre de producto, usa `LIKE '%<palabra>%'`.
            7. Devuelve solo las columnas necesarias para responder la pregunta.
            8. Limita los resultados a un máximo de 10 filas con `LIMIT 10`.
            9. No incluyas bloques de código Markdown, explicaciones ni comentarios: devuelve solo la consulta SQL limpia.
            10. Usa alias claros y consistentes (por ejemplo, `pp` para la tabla principal de productos).
            11. Puede buscar productos por categoría, subcategoría, rango de precio, nombre, stock, total_ventas.

            Responde únicamente con la consulta SQL final y asegúrate de que comience con la palabra SELECT.
        """

        response_sql = model.generate_content(prompt_sql)
        sql_query = response_sql.text.strip()
        sql_query = sql_query.replace('```sql', '').replace('```', '').strip()
        sql_query = re.sub(r'--.*', '', sql_query).strip()

        try:
            cursor = conn.execute(sql_query)
            rows = cursor.fetchall()
            results = [dict(row) for row in rows]
        except sqlite3.Error as e:
            results = []
            sql_query += f" -- ERROR: {str(e)}"

        prompt_nl = f"""
            {template_md}

            Usuario pregunta: "{question}"
            Lista de productos disponibles: {results}
            """

        response_nl = model.generate_content(prompt_nl)
        answer = response_nl.text.strip()

        cargar_mensajes_a_bd(question, answer)

        return {"query": sql_query, "results": results, "natural_language_response": answer}

    finally:
        conn.close()

@app.get("/messages")
def get_messages():
    conn = get_db_connection("mensajes.db")
    try:
        conn.execute(
            "CREATE TABLE IF NOT EXISTS mensajes (id INTEGER PRIMARY KEY AUTOINCREMENT, contenido TEXT, tipo TEXT)"
        )
        cursor = conn.execute("SELECT * FROM mensajes ORDER BY id ASC")
        rows = cursor.fetchall()
        return {"messages": [dict(row) for row in rows]}
    finally:
        conn.close()

@app.delete("/messages")
def delete_messages():
    conn = get_db_connection("mensajes.db")
    try:
        conn.execute("DELETE FROM mensajes")
        conn.commit()
    finally:
        conn.close()

class LoginRequest(BaseModel): 
    email: str
    password: str

@app.post("/login")
def login(login_request: LoginRequest):
    conn = get_db_connection("users.db")
    try:
        cursor = conn.execute(
            "SELECT * FROM usuarios WHERE email = ? AND password = ?",
            (login_request.email, login_request.password)
        )
        user = cursor.fetchone()
        if user:
            return {"name": user["name"]}
        else:
            raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
    finally:
        conn.close()

class RegisterRequest(BaseModel):
    email: str
    name: str
    password: str

@app.post("/register")
def register(register_request: RegisterRequest):
    conn = get_db_connection("users.db")
    try:
        cursor = conn.execute(
            "SELECT * FROM usuarios WHERE email = ?",
            (register_request.email,)
        )
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="El email ingresado ya se encuentra registrado")

        conn.execute(
            "INSERT INTO usuarios (email, name, password) VALUES (?, ?, ?)",
            (register_request.email, register_request.name, register_request.password)
        )
        conn.commit()
        return {"message": f"Usuario {register_request.name} creado correctamente"}
    finally:
        conn.close()


class RecoverRequest(BaseModel):
    email: str

@app.post("/recover/verify-email")
def verify_email(recover_request: RecoverRequest):
    conn = get_db_connection("users.db")
    try:
        cursor = conn.execute(
            "SELECT * FROM usuarios WHERE email = ?",
            (recover_request.email,)
        )
        if cursor.fetchone():
            return {"message": "Email verificado correctamente"}
        else:
            raise HTTPException(status_code=404, detail="El email no está registrado")
    finally:
        conn.close()
