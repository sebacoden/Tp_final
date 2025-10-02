from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import google.generativeai as genai
import os
from dotenv import load_dotenv

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
DB_PATH = os.path.join(BASE_DIR, "../DB/productos.db")

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
    
    try:
        # 1. Obtener el esquema de la base
        cursor = conn.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tablas = [row["name"] for row in cursor.fetchall()]
        schema = {}
        for t in tablas:
            cols = conn.execute(f"PRAGMA table_info({t});").fetchall()
            schema[t] = [c[1] for c in cols]
        
        # generar la consulta SQL con Gemini
        prompt_sql = f"""
        Eres un asistente que responde preguntas basadas en SQLite.
        Esquema de la base: {schema}
        Pregunta: {question}
        Solo devuelve la consulta SQL correcta, sin explicaciones.
        """
        model = genai.GenerativeModel("gemini-2.5-flash")
        response_sql = model.generate_content(prompt_sql)
        sql_query = response_sql.text.strip()
        
        if sql_query.startswith("```sql"):
            sql_query = sql_query.replace("```sql", "").strip()
        if sql_query.endswith("```"):
            sql_query = sql_query.replace("```", "").strip()
        
        # ejecutar la SQL generada
        cursor = conn.execute(sql_query)
        rows = cursor.fetchall()
        data = [dict(row) for row in rows]

        # generar la respuesta natural con Gemini
        prompt_natural = f"""
        Basado en la siguiente pregunta y el resultado de la base de datos,
        genera una respuesta en lenguaje natural.

        Pregunta: {question}
        Datos de la base: {data}

        Responde de manera concisa y amigable.
        """
        response_natural = model.generate_content(prompt_natural)
        final_answer = response_natural.text.strip()
        
        return {"query": sql_query, "results": data, "natural_language_response": final_answer}
        
    except Exception as e:
        return {"error": str(e)}
        
    finally:
        conn.close()