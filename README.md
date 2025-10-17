## Pasos para levantar la API
### (Opcional) generar un entorno aislado de dependencias

en el root folder
 ``` pwsh
    python -m venv venv
    venv\Scripts\activate
 ```

### Hacer pip install -r requirements.txt (en /API)

### Ejecutar el init_db.py para crear el .db con con una tabla 

### Ejecutar el siguiente comando (en /API)
 
 ``` pwsh
    python -m uvicorn api:app --reload --port 8000 
 ```
esto levanta el front de fastapi en localhost:8000/docs
