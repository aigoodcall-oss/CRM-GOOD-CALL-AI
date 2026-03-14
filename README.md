# Good Call AI — CRM v2.0

## Arquitectura

```
crm-frontend/                    → GitHub repo → Cloudflare Pages (app.goodcallai.net)
├── index.html                   → Login page
├── app.html                     → Dashboard (protegido)
├── css/
│   └── styles.css               → Todos los estilos
├── js/
│   ├── auth.js                  → Manejo de JWT tokens
│   ├── api.js                   → Fetch wrapper con auth
│   ├── charts.js                → Gráficos de barras y horas
│   ├── pages.js                 → Renderers de cada sección
│   └── app.js                   → Router, init, navegación

crm-backend/
└── dashboard.js                 → API Express con auth (Hetzner :3001)
```

## Auth System

- JWT con tokens de 7 días
- Passwords hasheados con bcrypt
- Usuario admin creado automáticamente la primera vez
- Endpoints protegidos con middleware `authRequired`

### Credenciales por defecto
```
Email:    admin@goodcallai.net
Password: admin123
```
**⚠️ CAMBIAR EN PRODUCCIÓN**

## Deploy — Frontend (Cloudflare Pages)

1. Reemplazar TODO el contenido del repo `aigoodcall-oss/CRM-GOOD-CALL-AI` con la carpeta `crm-frontend/`
2. Push a GitHub → Cloudflare Pages redeploya automáticamente
3. En Cloudflare Pages Settings, verificar que el build es "static" (no build command needed)

## Deploy — Backend (Hetzner)

1. SSH al servidor:
```bash
ssh root@89.167.100.149
```

2. Instalar dependencias nuevas:
```bash
cd /opt/rainy-bot
# Agregar al package.json:
npm install jsonwebtoken bcryptjs --save
```

3. Reemplazar dashboard.js:
```bash
cp src/dashboard.js src/dashboard.js.bak    # backup
# Copiar el nuevo dashboard.js a src/dashboard.js
```

4. (Opcional) Cambiar JWT_SECRET en el docker-compose.yml:
```yaml
environment:
  - JWT_SECRET=tu-clave-secreta-super-segura-2026
```

5. Rebuild:
```bash
docker compose up -d --force-recreate --build
```

6. Verificar:
```bash
# Health check (sin auth)
curl https://api.goodcallai.net/health

# Login
curl -X POST https://api.goodcallai.net/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@goodcallai.net","password":"admin123"}'

# Stats (con token)
curl https://api.goodcallai.net/stats/resumen \
  -H "Authorization: Bearer <TOKEN>"
```

## Cambiar password del admin

```bash
# Desde el servidor, usando curl al API local:
TOKEN=$(curl -s -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@goodcallai.net","password":"admin123"}' | jq -r .token)

curl -X POST http://localhost:3001/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"current_password":"admin123","new_password":"TU_NUEVA_PASSWORD"}'
```

## Crear más usuarios

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"email":"nuevo@empresa.com","password":"pass123","name":"Nombre","role":"admin"}'
```

Roles: `superadmin` (puede crear usuarios), `admin` (acceso completo), `viewer` (solo lectura — futuro)

## API Endpoints

### Auth (sin token)
- `POST /auth/login` — `{email, password}` → `{token, user}`
- `GET /health` — health check

### Auth (con token)
- `GET /auth/me` — datos del usuario actual
- `POST /auth/change-password` — `{current_password, new_password}`
- `POST /auth/register` — crear usuario (solo superadmin)
- `GET /auth/users` — listar usuarios (solo superadmin)
- `DELETE /auth/users/:id` — desactivar usuario (solo superadmin)

### Stats (con token)
- `GET /stats/resumen`
- `GET /stats/citas-por-dia`
- `GET /stats/ultimas-citas`
- `GET /stats/horas`
