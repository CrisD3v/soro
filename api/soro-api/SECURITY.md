# 🔒 Seguridad

## Autenticación con Cookies HttpOnly

La API implementa autenticación basada en cookies HttpOnly para máxima seguridad.

### ✅ Beneficios de Seguridad

#### 1. Protección contra XSS (Cross-Site Scripting)
- **HttpOnly**: Las cookies no son accesibles desde JavaScript
- Los tokens no pueden ser robados mediante scripts maliciosos
- Incluso si hay una vulnerabilidad XSS, los tokens están protegidos

#### 2. Protección contra CSRF (Cross-Site Request Forgery)
- **SameSite: strict**: Las cookies solo se envían en peticiones del mismo origen
- Previene que sitios maliciosos hagan peticiones en nombre del usuario
- Doble protección con validación de origen

#### 3. Transmisión Segura
- **Secure**: En producción, cookies solo viajan por HTTPS
- Previene interceptación de tokens en redes inseguras
- Cifrado end-to-end de credenciales

### 🔐 Configuración de Cookies

```typescript
// Access Token
{
  httpOnly: true,        // No accesible desde JS
  secure: isProduction,  // Solo HTTPS en producción
  sameSite: 'strict',    // Previene CSRF
  maxAge: 15 * 60 * 1000, // 15 minutos
  path: '/'
}

// Refresh Token
{
  httpOnly: true,
  secure: isProduction,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
  path: '/'
}
```

### 🛡️ Comparación con Almacenamiento Local

| Método | XSS | CSRF | Seguridad |
|--------|-----|------|-----------|
| **localStorage** | ❌ Vulnerable | ✅ Protegido | ⚠️ Baja |
| **sessionStorage** | ❌ Vulnerable | ✅ Protegido | ⚠️ Baja |
| **Cookies HttpOnly** | ✅ Protegido | ✅ Protegido | ✅ Alta |

### 🔄 Flujo de Autenticación

```
1. Login
   ├─ POST /auth/login
   ├─ Validar credenciales
   ├─ Generar tokens
   └─ Establecer cookies HttpOnly
      ├─ accessToken (15 min)
      └─ refreshToken (7 días)

2. Peticiones Autenticadas
   ├─ Cookie enviada automáticamente
   ├─ JWT extraído del servidor
   └─ Usuario autenticado

3. Refresh Token
   ├─ POST /auth/refresh
   ├─ Leer refreshToken de cookie
   ├─ Validar y generar nuevos tokens
   └─ Actualizar cookies

4. Logout
   ├─ POST /auth/logout
   ├─ Invalidar refreshToken en BD
   └─ Eliminar cookies
```

### 🌐 Configuración CORS

Para que las cookies funcionen en desarrollo con frontend separado:

```typescript
// main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true, // ← Permite envío de cookies
});
```

### 💻 Configuración del Cliente

#### React + Axios
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // ← Importante
});

// Login
const login = async (email: string, password: string) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data.user;
};

// Petición autenticada
const getProfile = async () => {
  const { data } = await api.get('/users/me');
  return data;
};
```

#### Fetch API
```typescript
const login = async (email: string, password: string) => {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    credentials: 'include', // ← Importante
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  return response.json();
};
```

### 🔑 Mejores Prácticas

#### 1. Rotación de Tokens
- Access token de corta duración (15 min)
- Refresh token de larga duración (7 días)
- Refresh automático antes de expiración

#### 2. Invalidación de Sesiones
- Refresh tokens almacenados hasheados en BD
- Logout elimina refresh token de BD
- Posibilidad de invalidar todas las sesiones de un usuario

#### 3. Monitoreo
- Log de intentos de login fallidos
- Detección de patrones sospechosos
- Alertas de múltiples sesiones

### 🚨 Manejo de Errores

```typescript
// 401 Unauthorized - Token expirado o inválido
{
  statusCode: 401,
  message: 'Unauthorized'
}

// 403 Forbidden - Sin permisos
{
  statusCode: 403,
  message: 'Forbidden resource'
}
```

### 🔄 Refresh Automático

Implementar interceptor para refresh automático:

```typescript
// axios interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post('/auth/refresh');
        return api(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

### 📝 Variables de Entorno

```env
# Desarrollo
NODE_ENV=development
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173

# Producción
NODE_ENV=production
JWT_SECRET=super-secure-random-key-min-32-chars
FRONTEND_URL=https://yourdomain.com
```

### ⚠️ Consideraciones de Producción

1. **HTTPS Obligatorio**: Secure flag requiere HTTPS
2. **JWT_SECRET Fuerte**: Mínimo 32 caracteres aleatorios
3. **CORS Restrictivo**: Solo orígenes confiables
4. **Rate Limiting**: Limitar intentos de login
5. **Monitoreo**: Logs de seguridad y alertas

### 🧪 Testing de Seguridad

```bash
# Verificar cookies en respuesta
curl -i -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456!"}'

# Verificar HttpOnly (no debe ser accesible desde JS)
# En DevTools Console:
document.cookie // No debe mostrar accessToken ni refreshToken

# Verificar SameSite
# Intentar petición desde otro origen sin CORS
```

### 📚 Referencias

- [OWASP Cookie Security](https://owasp.org/www-community/controls/SecureCookieAttribute)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [SameSite Cookies](https://web.dev/samesite-cookies-explained/)
