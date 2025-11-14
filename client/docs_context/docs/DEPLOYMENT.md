# Guía de Despliegue

## 🚀 Despliegue en Producción

### Requisitos Previos

- Node.js >= 18
- PostgreSQL >= 14
- Redis (opcional, para cache)
- Servidor con al menos 2GB RAM

### Variables de Entorno

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# JWT
JWT_SECRET="your-super-secret-jwt-key-min-32-characters"

# App
NODE_ENV="production"
PORT=3000

# Redis (opcional)
REDIS_URL="redis://localhost:6379"

# Email (opcional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Storage (opcional)
AWS_S3_BUCKET="your-bucket"
AWS_ACCESS_KEY_ID="your-key"
AWS_SECRET_ACCESS_KEY="your-secret"
```

### Pasos de Despliegue

#### 1. Clonar y Configurar

```bash
git clone <repository-url>
cd soro-api
pnpm install
```

#### 2. Configurar Base de Datos

```bash
# Ejecutar migraciones
pnpm prisma migrate deploy

# Generar cliente de Prisma
pnpm prisma generate

# Ejecutar seed (opcional, solo primera vez)
pnpm prisma:seed
```

#### 3. Build

```bash
pnpm run build
```

#### 4. Iniciar Servidor

```bash
# Con PM2 (recomendado)
pm2 start dist/main.js --name soro-api

# O directamente
pnpm run start:prod
```

### Configuración de PM2

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'soro-api',
    script: './dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
```

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🐳 Docker

### Dockerfile

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm prisma generate
RUN pnpm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["node", "dist/main"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:password@db:5432/soro
      JWT_SECRET: your-secret-key
      NODE_ENV: production
    depends_on:
      - db
      - redis

  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: soro
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

```bash
docker-compose up -d
```

## ☁️ Despliegue en Cloud

### Heroku

```bash
# Login
heroku login

# Crear app
heroku create soro-api

# Agregar PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Configurar variables
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Ejecutar migraciones
heroku run pnpm prisma migrate deploy
```

### AWS (EC2 + RDS)

1. **Crear RDS PostgreSQL**
2. **Crear EC2 instance**
3. **Configurar Security Groups**
4. **Instalar dependencias en EC2**
5. **Configurar Nginx como reverse proxy**
6. **Configurar SSL con Let's Encrypt**

### DigitalOcean App Platform

```yaml
# .do/app.yaml
name: soro-api
services:
  - name: api
    github:
      repo: your-repo
      branch: main
    build_command: pnpm install && pnpm prisma generate && pnpm run build
    run_command: pnpm run start:prod
    envs:
      - key: DATABASE_URL
        scope: RUN_TIME
        type: SECRET
      - key: JWT_SECRET
        scope: RUN_TIME
        type: SECRET
    http_port: 3000

databases:
  - name: db
    engine: PG
    version: "14"
```

## 🔒 Seguridad

### Checklist de Producción

- ✅ Usar HTTPS (SSL/TLS)
- ✅ Configurar CORS apropiadamente
- ✅ Rate limiting por IP y tenant
- ✅ Helmet.js para headers de seguridad
- ✅ Validar todos los inputs
- ✅ Sanitizar outputs
- ✅ Rotar JWT_SECRET periódicamente
- ✅ Backup automático de base de datos
- ✅ Monitoring y alertas
- ✅ Logs estructurados
- ✅ Firewall configurado

### Configuración de Seguridad

```typescript
// main.ts
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // 100 requests por ventana
  }),
);

app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true,
});
```

## 📊 Monitoring

### Health Check

```bash
curl https://api.yourdomain.com/health
```

### Métricas con Prometheus

```typescript
// Instalar
pnpm add @willsoto/nestjs-prometheus prom-client

// Configurar
@Module({
  imports: [
    PrometheusModule.register(),
  ],
})
```

### Logs con Winston

```typescript
// Instalar
pnpm add nest-winston winston

// Configurar
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

WinstonModule.forRoot({
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
});
```

## 🔄 CI/CD

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install

      - name: Run tests
        run: pnpm test

      - name: Build
        run: pnpm run build

      - name: Deploy to production
        run: |
          # Tu script de deploy
```

## 📦 Backup

### Backup Automático de PostgreSQL

```bash
# Script de backup
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="soro"

pg_dump $DATABASE_URL > $BACKUP_DIR/backup_$DATE.sql

# Subir a S3
aws s3 cp $BACKUP_DIR/backup_$DATE.sql s3://your-bucket/backups/

# Limpiar backups antiguos (mantener últimos 30 días)
find $BACKUP_DIR -name "backup_*.sql" -mtime +30 -delete
```

### Cron Job

```bash
# Ejecutar backup diario a las 2 AM
0 2 * * * /path/to/backup.sh
```

## 🔧 Troubleshooting

### Logs

```bash
# Ver logs de PM2
pm2 logs soro-api

# Ver logs de Docker
docker-compose logs -f api

# Ver logs de Heroku
heroku logs --tail
```

### Problemas Comunes

**Error de conexión a DB:**
- Verificar DATABASE_URL
- Verificar firewall/security groups
- Verificar que PostgreSQL esté corriendo

**Error de migraciones:**
```bash
# Resetear migraciones (⚠️ CUIDADO en producción)
pnpm prisma migrate reset

# Aplicar migraciones pendientes
pnpm prisma migrate deploy
```

**Performance lento:**
- Verificar índices en base de datos
- Implementar cache con Redis
- Optimizar queries con `include` selectivo
- Escalar horizontalmente con PM2 cluster mode

## 📞 Soporte

Para problemas de despliegue:
- Revisar logs del servidor
- Verificar variables de entorno
- Consultar documentación en `/docs`
- Abrir issue en GitHub
