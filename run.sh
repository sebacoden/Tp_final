#!/bin/bash

echo "Iniciando FRONT END y BACK END..."

# --- FRONTEND ---
(
  cd client/react || exit
  npm run start
) > frontend.log 2>&1 &

# --- BACKEND ---
(
  cd server/API || exit
  python -m uvicorn api:app --reload --port 8000
) > backend.log 2>&1 &

echo "Frontend y Backend iniciados en background."
echo "Logs: frontend.log y backend.log"
