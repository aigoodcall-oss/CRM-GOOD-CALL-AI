# Good Call AI — CRM v2.0 — GUÍA DE DEPLOY

## TODO SE DEPLOYA DESDE GITHUB. CERO SSH.

---

## PASO 1 — REPO DEL BOT (backend)

Repo: el que tiene auto-deploy a Hetzner (`/opt/rainy-bot/`)

### 1a. Agregar dependencias al package.json

Abrir `package.json` y agregar estas 2 líneas en `"dependencies"`:

```json
"jsonwebtoken": "^9.0.0",
"bcryptjs": "^2.4.3"
```

### 1b. Reemplazar src/dashboard.js

Borrar el contenido actual de `src/dashboard.js` y pegar el contenido del archivo
`crm-backend/dashboard.js` que está en el ZIP.

### 1c. (Opcional) Agregar JWT_SECRET al docker-compose.yml

En `docker-compose.yml`, agregar variable de entorno:

```yaml
services:
  bot:
    # ... lo que ya tengas ...
    environment:
      - JWT_SECRET=pon-una-clave-larga-y-segura-aqui-2026
```

Si no lo pones, usa un default (funciona pero es menos seguro).

### 1d. Push

```
git add .
git commit -m "feat: dashboard v2 con auth JWT"
git push
```

→ Hetzner auto-rebuild → API con login funcionando.

### 1e. Verificar

Abrir en el navegador: `https://api.goodcallai.net/health`
Debe responder: `{"status":"ok",...}`

---

## PASO 2 — REPO DEL CRM (frontend)

Repo: `aigoodcall-oss/CRM-GOOD-CALL-AI`

### 2a. Borrar todo el contenido actual del repo

Borrar el `index.html` viejo y cualquier otro archivo.

### 2b. Copiar el contenido de crm-frontend/

La estructura debe quedar así EN LA RAÍZ del repo:

```
/
├── index.html          ← Login
├── app.html            ← Dashboard
├── css/
│   └── styles.css
├── js/
│   ├── auth.js
│   ├── api.js
│   ├── charts.js
│   ├── pages.js
│   └── app.js
└── README.md
```

### 2c. Push

```
git add .
git commit -m "feat: CRM v2 con login y archivos separados"
git push
```

→ Cloudflare Pages redeploya → CRM con login funcionando.

---

## PASO 3 — PROBAR

1. Abrir `https://app.goodcallai.net`
2. Debe mostrar la pantalla de LOGIN
3. Credenciales por defecto:
   - Email: `admin@goodcallai.net`
   - Password: `admin123`
4. Login → Dashboard con datos reales

---

## PASO 4 — CAMBIAR PASSWORD (desde el CRM, no SSH)

Una vez logueado, puedes cambiar el password usando la API:

```
POST https://api.goodcallai.net/auth/change-password
Headers: Authorization: Bearer <tu-token>
Body: {"current_password":"admin123","new_password":"tu-nueva-clave"}
```

(Más adelante podemos agregar una pantalla de "Mi cuenta" en el CRM para esto)

---

## RESUMEN

| Qué | Dónde | Trigger |
|-----|-------|---------|
| Frontend (login + dashboard) | Repo CRM → Cloudflare Pages | `git push` |
| Backend (API + auth) | Repo Bot → Hetzner Docker | `git push` |
| Base de datos | Se crea sola (SQLite) | Automático |
| Usuario admin | Se crea solo la primera vez | Automático |

**No hay que tocar SSH para nada.**
