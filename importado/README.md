## Pasos para levantar la API
### (Opcional) generar un entorno aislado de dependencias

en el root folder
 ``` pwsh
    python -m venv venv
    venv\Scripts\activate
 ```

### Hacer pip install -r requirements.txt

### Ejecutar el init_db.py para crear el .db con con una tabla 

 ### Generar la api key de gemini (idealmente que cada uno tenga una propia) y crear un archivo .env basado en el .env.example

ejecutar el siguiente comando
 
 ``` pwsh
    python -m uvicorn api:app --reload --port 8000 
 ```
esto levanta el front de fasta api en localhost:8000/docs