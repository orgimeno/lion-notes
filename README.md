# 📝 Lion Notes — Prueba técnica Laravel + React (Docker)

Aplicación Notas (CRUD) con:

- Backend: Laravel 11 (API JSON)
- Frontend: React + Vite
- Base de datos: SQLite
- Infraestructura: Docker + Docker Compose
- Auth: No (usuario anónimo)
- Tests: Backend + Frontend

Todo el proyecto se levanta con un solo comando.

---

## 📦 Requisitos previos

El proyecto está preparado para ejecutarse en Windows, macOS o Linux.

Necesitas tener instalado:

- Docker Desktop  
  - En Windows: con WSL2 habilitado
- Git

No es necesario instalar PHP, Node ni Composer en local.

---

## 🚀 Puesta en marcha

### 1️⃣ Clonar el repositorio

git clone https://github.com/orgimeno/lion-notes.git  
cd lion-notes

---

### 2️⃣ Levantar el entorno completo

docker compose up -d

Esto levantará:

- Backend Laravel (PHP-FPM)
- Frontend React (Vite dev server)
- Nginx

La primera vez puede tardar unos minutos.

---

### 3️⃣ Accesos

Frontend:  
http://localhost:5173

API:  
http://localhost:8000

Health check:  
http://localhost:8000/api/health

---

## 🔌 API Endpoints

Prefijo común: /api

GET    /notes            → Listado paginado  
GET    /notes?q=texto    → Búsqueda por título  
GET    /notes?page=2     → Paginación  
POST   /notes            → Crear nota  
GET    /notes/{id}       → Ver nota  
PUT    /notes/{id}       → Editar nota  
DELETE /notes/{id}       → Borrar nota  
GET    /health           → Estado de la API y DB  

### Ejemplo de creación

POST /api/notes

{
  "title": "Primera nota",
  "content": "Contenido opcional"
}

---

## 📄 Estructura del proyecto

lion-notes/
│
├── backend/
│   └── src/        Laravel 11 (API)
│
├── frontend/
│   └── src/        React + Vite
│
├── docker-compose.yml
└── README.md

---

## 🧪 Tests

### Backend

docker compose exec backend php artisan test

Incluye test de validación 422.

---

### Frontend

docker compose exec frontend npm test

Test básico de render.

---

## 🧠 Decisiones técnicas

- SQLite para simplificar la instalación
- FormRequest y Resources para un API consistente
- Envelope JSON común:

{
  "data": ...,
  "message": null,
  "errors": null
}

- Layout tipo Google Keep (masonry)
- Sin autenticación (según enunciado)

---

## ⚠️ Notas importantes

- El archivo .env no se versiona
- La base de datos SQLite es local al contenedor
- Proyecto orientado a evaluación técnica

---

## ✅ Estado de la prueba

- CRUD completo
- Búsqueda
- Ordenación
- Paginación
- API JSON limpia
- Tests backend
- Tests frontend
- Docker one-command setup

---

## 👤 Autor

Óscar Gimeno  
Prueba técnica para Lion Group (Valencia)
