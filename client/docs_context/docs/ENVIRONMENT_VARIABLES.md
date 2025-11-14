# Variables de Entorno - SORO API

## 📋 Descripción

Este documento describe todas las variables de entorno disponibles en SORO API y cómo configurarlas correctamente.

## 🚀 Inicio Rápido

1. Copiar el archivo de ejemplo:
```bash
cp .env.example .env
```

2. Editar `.env` con tus valores:
```bash
nano .env  # o tu editor preferido
```

3. Configurar las variables requeridas (mínimo):
- `DATABASE_URL`
- `JWT_SECRET`

---

## 📦 Variables Requeridas

### DATABASE_URL
**Tipo:** String
**Requerido:** ✅ Sí
**Descripción:** URL de conexión a PostgreSQL

**Formato:**
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
```

**Ejemplos:**
```bash
# Neon (Cloud)
DATABASE_URL="postgresql://user:pass@ep-xxx.aws.neon.tech/db?sslmode=require"

# Local
DATABASE_URL="postgresql://postgres:password@localhost:5432/soro_db"

# Docker
DATABASE_URL="postgresql://postgres:password@postgres:5432/soro_db"
```

### JWT_SECRET
**Tipo:** String
**Requerido:** ✅ Sí
**Descripción:** Clave secreta para firmar tokens JWT

**Recomendaciones:**
- Mínimo 32 caracteres
- Usar caracteres aleatorios
- Cambiar en producción

**Generar:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## ⚙️ Variables de Configuración

### JWT_ACCESS_TOKEN_EXPIRATION
**Tipo:** String
**Default:** `"15m"`
**Descripción:** Tiempo de expiración del access token

**Valores válidos:**
- `"15m"` - 15 minutos
- `"1h"` - 1 hora
- `"24h"` - 24 horas

### JWT_REFRESH_TOKEN_EXPIRATION
**Tipo:** String
**Default:** `"7d"`
**Descripción:** Tiempo de expiración del refresh token

**Valores válidos:**
- `"7d"` - 7 días
- `"30d"` - 30 días
- `"90d"` - 90 días

### PORT
**Tipo:** Number
**Default:** `3000`
**Descripción:** Puerto donde correrá el servidor

### NODE_ENV
**Tipo:** String
**Default:** `"development"`
**Valores:** `development`, `production`, `test`
**Descripción:** Entorno de ejecución

### API_URL
**Tipo:** String
**Default:** `"http://localhost:3000"`
**Descripción:** URL base de la API

### FRONTEND_URL
**Tipo:** String
**Default:** `"http://localhost:3001"`
**Descripción:** URL del frontend para CORS

**Múltiples URLs:**
```bash
FRONTEND_URL="http://localhost:3001,http://localhost:5173,https://app.soro.com"
```

---

## 🛡️ Rate Limiting

### RATE_LIMIT_TTL
**Tipo:** Number
**Default:** `60000` (60 segundos)
**Descripción:** Ventana de tiempo para rate limiting (en milisegundos)

### RATE_LIMIT_MAX
**Tipo:** Number
**Default:** `100`
**Descripción:** Número máximo de requests por ventana

**Ejemplos:**
```bash
# Estricto: 30 requests por minuto
RATE_LIMIT_TTL=60000
RATE_LIMIT_MAX=30

# Relajado: 200 requests por minuto
RATE_LIMIT_TTL=60000
RATE_LIMIT_MAX=200
```

---

## 📊 Logging y Monitoring

### LOG_LEVEL
**Tipo:** String
**Default:** `"info"`
**Valores:** `error`, `warn`, `info`, `debug`, `verbose`
**Descripción:** Nivel de logging

### ENABLE_REQUEST_LOGGING
**Tipo:** Boolean
**Default:** `true`
**Descripción:** Habilitar logging de requests HTTP

### ENABLE_PERFORMANCE_MONITORING
**Tipo:** Boolean
**Default:** `true`
**Descripción:** Habilitar monitoreo de performance

---

## 🔒 Seguridad

### ENABLE_SWAGGER
**Tipo:** Boolean
**Default:** `true`
**Descripción:** Habilitar documentación Swagger

**Recomendación:** Deshabilitar en producción o proteger con autenticación

### CORS_ORIGINS
**Tipo:** String
**Default:** `"http://localhost:3001,http://localhost:5173"`
**Descripción:** Orígenes permitidos para CORS (separados por coma)

---

## 📧 Email (Opcional)

### SMTP_HOST
**Tipo:** String
**Ejemplo:** `"smtp.gmail.com"`
**Descripción:** Host del servidor SMTP

### SMTP_PORT
**Tipo:** Number
**Ejemplo:** `587`
**Descripción:** Puerto del servidor SMTP

### SMTP_SECURE
**Tipo:** Boolean
**Default:** `false`
**Descripción:** Usar TLS/SSL

### SMTP_USER
**Tipo:** String
**Descripción:** Usuario SMTP

### SMTP_PASSWORD
**Tipo:** String
**Descripción:** Contraseña SMTP

### SMTP_FROM
**Tipo:** String
**Ejemplo:** `"noreply@soro.com"`
**Descripción:** Email remitente por defecto

---

## 📁 File Storage (Opcional)

### AWS S3

```bash
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="soro-documents"
```

### CloudFlare R2

```bash
R2_ACCOUNT_ID="your-account-id"
R2_ACCESS_KEY_ID="your-access-key"
R2_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET="soro-documents"
```

---

## 🔴 Redis (Opcional)

```bash
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=""
REDIS_DB=0
```

**Uso:** Cache, sessions, rate limiting distribuido

---

## 📈 Monitoring Services (Opcional)

### Sentry

```bash
SENTRY_DSN="https://xxx@xxx.ingest.sentry.io/xxx"
```

### New Relic

```bash
NEW_RELIC_LICENSE_KEY="your-license-key"
NEW_RELIC_APP_NAME="SORO API"
```

---

## 💳 Payment Services (Opcional)

### Stripe

```bash
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"
```

### MercadoPago

```bash
MERCADOPAGO_ACCESS_TOKEN="APP_USR-xxx"
```

---

## 📱 SMS Services (Opcional)

### Twilio

```bash
TWILIO_ACCOUNT_SID="ACxxx"
TWILIO_AUTH_TOKEN="xxx"
TWILIO_PHONE_NUMBER="+1234567890"
```

---

## 🚩 Feature Flags (Opcional)

```bash
ENABLE_WEBHOOKS=true
ENABLE_NOTIFICATIONS=true
ENABLE_WORKFLOWS=true
ENABLE_CUSTOM_FIELDS=true
```

---

## 🔧 Development

### DEBUG
**Tipo:** Boolean
**Default:** `false`
**Descripción:** Habilitar modo debug

### PRISMA_LOG_QUERIES
**Tipo:** Boolean
**Default:** `false`
**Descripción:** Loggear queries SQL de Prisma

### AUTO_SEED
**Tipo:** Boolean
**Default:** `false`
**Descripción:** Ejecutar seed automáticamente al iniciar

---

## 📝 Ejemplos de Configuración

### Desarrollo Local

```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/soro_dev"
JWT_SECRET="dev-secret-key-change-in-production"
NODE_ENV="development"
PORT=3000
FRONTEND_URL="http://localhost:3001"
ENABLE_SWAGGER=true
DEBUG=true
PRISMA_LOG_QUERIES=true
```

### Producción

```bash
DATABASE_URL="postgresql://user:pass@prod-db.com:5432/soro_prod?sslmode=require"
JWT_SECRET="super-secure-random-key-64-characters-minimum-generated-securely"
NODE_ENV="production"
PORT=3000
API_URL="https://api.soro.com"
FRONTEND_URL="https://app.soro.com"
ENABLE_SWAGGER=false
DEBUG=false
PRISMA_LOG_QUERIES=false
LOG_LEVEL="warn"
RATE_LIMIT_MAX=50
```

### Testing

```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/soro_test"
JWT_SECRET="test-secret-key"
NODE_ENV="test"
PORT=3001
ENABLE_SWAGGER=false
DEBUG=false
```

---

## ⚠️ Seguridad

### ✅ Buenas Prácticas

1. **Nunca commitear el archivo `.env`**
   - Está en `.gitignore`
   - Usar `.env.example` como template

2. **Usar secretos fuertes**
   - JWT_SECRET mínimo 32 caracteres
   - Generar con herramientas criptográficas

3. **Diferentes valores por entorno**
   - Development, staging, production
   - Nunca reutilizar secretos

4. **Rotar secretos regularmente**
   - Especialmente en producción
   - Después de incidentes de seguridad

5. **Usar gestores de secretos**
   - AWS Secrets Manager
   - HashiCorp Vault
   - Azure Key Vault

### ❌ Evitar

- ❌ Hardcodear valores en el código
- ❌ Compartir archivos `.env` por email/chat
- ❌ Usar secretos débiles o predecibles
- ❌ Commitear secretos al repositorio
- ❌ Usar mismos secretos en dev y prod

---

## 🔍 Troubleshooting

### Error: "DATABASE_URL is not defined"
**Solución:** Verificar que `.env` existe y tiene `DATABASE_URL`

### Error: "JWT_SECRET is not defined"
**Solución:** Agregar `JWT_SECRET` al archivo `.env`

### Error: "Cannot connect to database"
**Solución:**
- Verificar que PostgreSQL está corriendo
- Verificar credenciales en `DATABASE_URL`
- Verificar conectividad de red

### Swagger no aparece
**Solución:** Verificar `ENABLE_SWAGGER=true` en `.env`

### CORS errors
**Solución:** Agregar origen del frontend a `FRONTEND_URL` o `CORS_ORIGINS`

---

## 📞 Soporte

Para más información:
- Revisar `.env.example`
- Consultar documentación en `/docs`
- Abrir issue en GitHub
