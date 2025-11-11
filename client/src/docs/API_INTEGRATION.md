# 🔌 Integración con API

## 📋 Índice
- [Configuración](#configuración)
- [Cliente HTTP](#cliente-http)
- [TanStack Query](#tanstack-query)
- [Manejo de Errores](#manejo-de-errores)
- [Autenticación](#autenticación)
- [Ejemplos](#ejemplos)

---

## Configuración

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## Cliente HTTP

### ApiClient

Cliente HTTP base con interceptors y manejo de errores.

**Ubicación:** `src/lib/api/client.ts`

**Características:**
- Singleton pattern
- Manejo automático de tokens
- Interceptors para auth
- Manejo de errores tipado
- Soporte para todos los métodos HTTP

**Uso básico:**

```typescript
import { apiClient } from '@/lib/api/client';

// GET request
const data = await apiClient.get('/users');

// POST request
const user = await apiClient.post('/users', {
  email: 'test@example.com',
  password: 'password123',
});

// Request autenticado
const profile = await apiClient.get('/profile', {
  requiresAuth: true,
});
```

### Configurar Token

```typescript
import { apiClient } from '@/lib/api/client';

// Establecer token
apiClient.setAccessToken('your-token-here');

// Obtener token actual
const token = apiClient.getAccessToken();
```

---

## TanStack Query

### Setup

El provider está configurado en `src/lib/providers/QueryProvider.tsx` y envuelve la aplicación en `layout.tsx`.

### Hooks de Autenticación

#### useLogin

```typescript
import { useLogin } from '@/lib/queries/auth.queries';

function LoginComponent() {
  const loginMutation = useLogin({
    onSuccess: (data) => {
      console.log('Login exitoso:', data.user);
      // Token se guarda automáticamente
    },
    onError: (error) => {
      console.error('Error:', error.message);
    },
  });

  const handleLogin = () => {
    loginMutation.mutate({
      email: 'test@example.com',
      password: 'password123',
    });
  };

  return (
    <button
      onClick={handleLogin}
      disabled={loginMutation.isPending}
    >
      {loginMutation.isPending ? 'Cargando...' : 'Iniciar Sesión'}
    </button>
  );
}
```

#### useRegister

```typescript
import { useRegister } from '@/lib/queries/auth.queries';

function RegisterComponent() {
  const registerMutation = useRegister({
    onSuccess: (user) => {
      console.log('Usuario creado:', user);
    },
  });

  const handleRegister = () => {
    registerMutation.mutate({
      email: 'new@example.com',
      password: 'SecurePass123!',
      name: 'John',
      lastName: 'Doe',
      documentNumber: '1234567890',
      documentType: 'CC',
      phone: '+573001234567',
      companyId: 'company-uuid',
    });
  };

  return (
    <button onClick={handleRegister}>
      Registrarse
    </button>
  );
}
```

#### useRefreshToken

```typescript
import { useRefreshToken } from '@/lib/queries/auth.queries';

function useAutoRefresh() {
  const refreshMutation = useRefreshToken({
    onSuccess: (data) => {
      console.log('Token renovado');
      // Tokens se actualizan automáticamente
    },
  });

  const refresh = () => {
    const refreshToken = authRepository.getRefreshToken();
    if (refreshToken) {
      refreshMutation.mutate({ refreshToken });
    }
  };

  return { refresh };
}
```

#### useLogout

```typescript
import { useLogout } from '@/lib/queries/auth.queries';

function LogoutButton() {
  const logoutMutation = useLogout({
    onSuccess: () => {
      console.log('Sesión cerrada');
      // Tokens se limpian automáticamente
    },
  });

  const handleLogout = () => {
    const refreshToken = authRepository.getRefreshToken();
    if (refreshToken) {
      logoutMutation.mutate({ refreshToken });
    }
  };

  return (
    <button onClick={handleLogout}>
      Cerrar Sesión
    </button>
  );
}
```

---

## Manejo de Errores

### Tipos de Error

```typescript
interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}
```

### Manejo en Componentes

```typescript
const loginMutation = useLogin();

if (loginMutation.error) {
  const errorMessage = Array.isArray(loginMutation.error.message)
    ? loginMutation.error.message[0]
    : loginMutation.error.message;

  return <div className="error">{errorMessage}</div>;
}
```

### Errores Comunes

**401 Unauthorized**
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

**400 Bad Request**
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 8 characters"
  ],
  "error": "Bad Request"
}
```

**409 Conflict**
```json
{
  "statusCode": 409,
  "message": "Email already exists",
  "error": "Conflict"
}
```

---

## Autenticación

### Flujo de Autenticación

```
1. Usuario hace login
   ↓
2. API devuelve accessToken + refreshToken
   ↓
3. authRepository guarda tokens en localStorage
   ↓
4. ApiClientFactory configura token en cliente HTTP
   ↓
5. Requests subsecuentes incluyen token automáticamente
```

### Repository Pattern

```typescript
import { authRepository } from '@/lib/patterns/repository/auth.repository';

// Guardar sesión
authRepository.saveSession({
  accessToken: 'token',
  refreshToken: 'refresh',
  user: userData,
});

// Obtener datos
const token = authRepository.getAccessToken();
const user = authRepository.getUserData();

// Verificar sesión
const hasSession = authRepository.hasActiveSession();

// Limpiar sesión
authRepository.clearSession();
```

### Factory Pattern

```typescript
import { ApiClientFactory } from '@/lib/patterns/factory/api-client.factory';

// Obtener cliente
const authClient = ApiClientFactory.getClient('auth');

// Configurar token global
ApiClientFactory.setAuthToken('your-token');

// Limpiar instancias
ApiClientFactory.clearInstances();
```

---

## Ejemplos

### Ejemplo Completo: Login con Manejo de Errores

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/lib/queries/auth.queries';
import { loginSchema } from '@/lib/utils/validators';

export function LoginForm() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useLogin({
    onSuccess: () => {
      router.push('/dashboard');
    },
  });

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}

      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}

      {loginMutation.error && (
        <div className="error">
          {Array.isArray(loginMutation.error.message)
            ? loginMutation.error.message[0]
            : loginMutation.error.message}
        </div>
      )}

      <button
        type="submit"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? 'Cargando...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
}
```

### Ejemplo: Refresh Token Automático

```typescript
import { useEffect } from 'react';
import { useRefreshToken } from '@/lib/queries/auth.queries';
import { authRepository } from '@/lib/patterns/repository/auth.repository';

export function useAutoRefreshToken() {
  const refreshMutation = useRefreshToken();

  useEffect(() => {
    // Renovar token cada 14 minutos (access token expira en 15)
    const interval = setInterval(() => {
      const refreshToken = authRepository.getRefreshToken();
      if (refreshToken) {
        refreshMutation.mutate({ refreshToken });
      }
    }, 14 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
}
```

### Ejemplo: Protected Route

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth/useAuth';

export function ProtectedPage({ children }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
```

---

## Testing

### Mock de API Client

```typescript
import { vi } from 'vitest';
import { apiClient } from '@/lib/api/client';

vi.mock('@/lib/api/client', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
    setAccessToken: vi.fn(),
  },
}));

// En el test
apiClient.post.mockResolvedValue({
  accessToken: 'token',
  refreshToken: 'refresh',
  user: { id: '1', email: 'test@example.com' },
});
```

### Mock de TanStack Query

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

renderHook(() => useLogin(), { wrapper });
```
