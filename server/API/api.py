from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import google.generativeai as genai
import os, random
from dotenv import load_dotenv
import re
from fastapi import HTTPException
from pydantic import BaseModel

def get_gemini_key_from_default(): #Esta es la opcion que ya existia
    return os.getenv("GEMINI_API_KEY")

def get_gemini_key_from_pool(): #Esta es una posible solución. Toma una key al azar de un pool en el .env
    keys = os.getenv("GEMINI_KEYS").split(",")  #Reduce el limite de una sola key al separar la carga entre varias
    return random.choice(keys)                  #Solo funciona porque es una app chica y pocos vamos a estar usandola al mismo tiempo

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

def get_db_connection(db_name="productos.db"):
    DB_PATH = os.path.join(BASE_DIR, "DB", db_name)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

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
@app.get("/ask")
def ask(question: str):
    conn = get_db_connection()
    model = genai.GenerativeModel("gemini-2.5-flash")

    try:
        # 1️⃣ Obtener estructura de la DB (tablas y columnas)
        cursor = conn.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tablas = [row["name"] for row in cursor.fetchall()]
        schema = {}
        for t in tablas:
            cols = conn.execute(f"PRAGMA table_info({t});").fetchall()
            schema[t] = [c[1] for c in cols]

        # 2️⃣ Preparar prompt para que Gemini genere la SQL
        schema_str = "\n".join([f"{t}({', '.join(cols)})" for t, cols in schema.items()])
        prompt_sql = f"""
        Eres un asistente que ayuda a generar consultas SQL para responder preguntas.
        Aquí está la estructura de la base de datos:
        {schema_str}

        Genera una consulta SQL que responda a la siguiente pregunta:
        "{question}"

        Instrucciones CLAVE para generar la SQL (SQLite):
            1. Cuando la pregunta busca el producto **"más caro"**, la consulta debe ordenar por **precio_base** de forma descendente (`ORDER BY precio_base DESC`).
            2. Cuando la pregunta busca el producto con el **"mayor descuento"**, la consulta debe ordenar por el cálculo del porcentaje de descuento de forma descendente (`ORDER BY porcentaje_descuento DESC`).
            3. Siempre incluye la condición `WHERE pp.precio_base > pp.precio_final` para filtrar productos sin descuento.
            4. Para búsquedas de nombres, usa **LIKE** con comodines (`%`).
            5. La consulta debe devolver solo las columnas necesarias.
            6. Pasa la query en crudo, sin bloques de código Markdown ni comentarios.
        """
        # 3️⃣ Gemini genera la consulta SQL
        response_sql = model.generate_content(prompt_sql)
        sql_query = response_sql.text.strip()
        sql_query = sql_query.replace('```sql', '').replace('```', '').strip()
        sql_query = re.sub(r'--.*', '', sql_query).strip()


        # 4️⃣ Ejecutar la consulta SQL generada
        try:
            cursor = conn.execute(sql_query)
            rows = cursor.fetchall()
            results = [dict(row) for row in rows]
        except sqlite3.Error as e:
            results = []
            sql_query += f" -- ERROR: {str(e)}"

        # 5️⃣ Generar prompt para la respuesta en lenguaje natural
        prompt_nl = f"""
        El usuario preguntó: "{question}"
        Los resultados de la base de datos son:
        {results}

        Instrucciones:
        - Responde con actitud neutral y clara.
        - Busca en base al nombre del producto, no categoria.
        - Responde de manera clara y amigable.
        - Adapta la longitud según la pregunta.
        - No uses markdown ni **.
        """
        response_nl = model.generate_content(prompt_nl)
        answer = response_nl.text.strip()

        return {
            "query": sql_query,
            "results": results,
            "natural_language_response": answer
        }

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
            return {"name": user['name']}
        else:
            raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
    finally:
        conn.close()
        
from fastapi import HTTPException


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
