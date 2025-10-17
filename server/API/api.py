from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import google.generativeai as genai
import os
from dotenv import load_dotenv
import re
from fastapi import HTTPException
from pydantic import BaseModel


load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],   
    allow_headers=["*"],   
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "../DB/mi_base.db")

def get_db_connection():
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
        # 1. Obtener esquema
        cursor = conn.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tablas = [row["name"] for row in cursor.fetchall()]
        schema = {}
        for t in tablas:
            cols = conn.execute(f"PRAGMA table_info({t});").fetchall()
            schema[t] = [c[1] for c in cols]

        # 2. Obtener todos los datos de todas las tablas
        all_data = {}
        for t in tablas:
            try:
                cursor = conn.execute(f"SELECT * FROM {t};")
                rows = cursor.fetchall()
                all_data[t] = [dict(row) for row in rows]
            except sqlite3.OperationalError:
                all_data[t] = []

        # 3. Prompt para Gemini: combinar datos + conocimiento general
        prompt = f"""
        El usuario preguntó: "{question}"

        Aquí están todos los datos disponibles de la base de datos:
        {all_data}

        Genera una respuesta útil, clara y amigable, basada en los datos existentes y, si es necesario, complementa con conocimiento general.
        Puedes hacer recomendaciones, sugerencias o comparaciones entre productos.
        """

        response = model.generate_content(prompt)
        answer = response.text.strip()

        return {
            "query": None,
            "results": all_data,
            "natural_language_response": answer
        }

    finally:
        conn.close()

class LoginRequest(BaseModel): 
    username: str
    password: str

@app.post("/login")
def login(login_request: LoginRequest):
    conn = get_db_connection()
    try:
        cursor = conn.execute(
            "SELECT * FROM usuarios WHERE username = ? AND password = ?",
            (login_request.username, login_request.password)
        )
        user = cursor.fetchone()
        if user:
            return {"message": f"Bienvenido {login_request.username}"}
        else:
            raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
    finally:
        conn.close()
        
from fastapi import HTTPException

@app.post("/register")
def register(register_request: LoginRequest):
    conn = get_db_connection()
    try:
        cursor = conn.execute(
            "SELECT * FROM usuarios WHERE username = ?",
            (register_request.username,)
        )
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Usuario ya existe")

        conn.execute(
            "INSERT INTO usuarios (username, password) VALUES (?, ?)",
            (register_request.username, register_request.password)  # Para producción: usar hash
        )
        conn.commit()
        return {"message": f"Usuario {register_request.username} creado correctamente"}
    finally:
        conn.close()
