@echo off
echo Iniciando FRONTEND y BACKEND...

REM --- FRONTEND ---
start "Frontend" cmd /k "cd client\react && npm run start"

REM --- BACKEND ---
start "Backend" cmd /k "cd server\API && python -m uvicorn api:app --reload --port 8000"

echo Ambos servicios fueron iniciados en ventanas separadas.
