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


---

## User API

### Endpoints

#### Get All Users

```typescript
GET /users

Response: User[]
```

#### Get User by ID

```typescript
GET /users/:id

Response: User
```

#### Create User

```typescript
POST /users

Body: CreateUserDto
{
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  phone?: string;
  companyId: string;
  roleId?: string;
}

Response: User
```

#### Update User

```typescript
PATCH /users/:id

Body: UpdateUserDto
{
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  isActive?: boolean;
}

Response: User
```

#### Assign Role

```typescript
POST /users/:id/assign-role

Body: AssignRoleDto
{
  roleId: string;
  companyId: string;
}

Response: User
```

#### Get Current User

```typescript
GET /users/me

Response: User
```

### Usage

```typescript
import { userApi } from '@/lib/api/user.api';

// Get all users
const users = await userApi.getUsers();

// Get user by ID
const user = await userApi.getUserById('user-id');

// Create user
const newUser = await userApi.createUser({
  email: 'user@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
  documentType: 'CC',
  documentNumber: '123456789',
  companyId: 'company-id',
});

// Update user
const updatedUser = await userApi.updateUser('user-id', {
  firstName: 'Jane',
});

// Assign role
const userWithRole = await userApi.assignRole('user-id', {
  roleId: 'role-id',
  companyId: 'company-id',
});

// Get current user
const currentUser = await userApi.getCurrentUser();
```

---

## Company API

### Endpoints

#### Get All Companies

```typescript
GET /companies

Response: Company[]
```

#### Get Company by ID

```typescript
GET /companies/:id

Response: Company
```

#### Create Company

```typescript
POST /companies

Body: CreateCompanyDto
{
  name: string;
  nit: string;
  address?: string;
  phone?: string;
  email?: string;
  sector?: string;
  parentCompanyId?: string;
}
e: Company
```

#### Update Company

```typescript
PATCH /companies/:id

Body: UpdateCompanyDto
{
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  sector?: string;
  isActive?: boolean;
}

Response: Company
```

#### Delete Company (Soft Delete)

```typescript
DELETE /companies/:id

Response: void
```

#### Restore Company

```typescript
POST /companies/:id/restore

Response: Company
```

#### Get Company Hierarchy

```typescript
GET /companies/:id/hierarchy

Response: CompanyHierarchy
{
  ...Company,
  children?: CompanyHierarchy[]
}
```

### Usage

```typescript
import { companyApi } from '@/lib/api/company.api';

// Get all companies
const companies = await companyApi.getCompanies();

// Get company by ID
const company = await companyApi.getCompanyById('company-id');

// Create company
const newCompany = await companyApi.createCompany({
  name: 'GRUPO MATEX',
  nit: '900123456-7',
  address: 'Calle 123 #45-67',
  phone: '+57 300 1234567',
  email: 'info@grupomatex.com',
  sector: 'Textil',
});

// Update company
const updatedCompany = await companyApi.updateCompany('company-id', {
  name: 'GRUPO MATEX S.A.S.',
});

// Delete company (soft delete)
await companyApi.deleteCompany('company-id');

// Restore company
const restoredCompany = await companyApi.restoreCompany('company-id');

// Get company hierarchy
const hierarchy = await companyApi.getCompanyHierarchy('company-id');
```

---

## Dashboard API Integration

### useDashboard Hook

```typescript
import { useDashboard } from '@/hooks/useDashboard/useDashboard';

function DashboardPage() {
  const { stats, isLoading, error, refetch } = useDashboard();

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return (
    <div>
      <StatCard
        title="Total Materiales"
        value={stats.totalMaterials}
        trend="up"
        trendValue="+12%"
      />
      {/* More stats */}
    </div>
  );
}
```

### DashboardContext

```typescript
import { useDashboardContext } from '@/context/DashboardContext';

function TopBar() {
  const { activeCompany, setActiveCompany } = useDashboardContext();

  return (
    <header>
      <h1>{activeCompany} - Soro Platform</h1>
    </header>
  );
}
```

---

## Refresh Token Flow

### Automatic Refresh

```typescript
// src/lib/api/client.ts

private async request<T>(endpoint: string, config: RequestConfig = {}, isRetry = false): Promise<T> {
  try {
    const response = await fetch(url, { ...config, headers });

    // Handle 401 Unauthorized
    if (response.status === 401 && !isRetry && requiresAuth) {
      const refreshToken = this.getRefreshToken();

      if (refreshToken) {
        // Attempt to refresh
        const refreshResponse = await fetch(`${this.baseURL}/auth/refresh`, {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const { accessToken, refreshToken: newRefreshToken } = await refreshResponse.json();

          // Update tokens
          this.setAccessToken(accessToken);
          this.setRefreshToken(newRefreshToken);

          // Retry original request
          return this.request<T>(endpoint, config, true);
        }
      }

      // Refresh failed, logout
      this.clearTokens();
      window.location.href = '/auth';
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
```

### Manual Refresh

```typescript
import { useRefreshToken } from '@/lib/queries/auth.queries';

function Component() {
  const refreshMutation = useRefreshToken();

  const handleRefresh = async () => {
    try {
      await refreshMutation.mutateAsync();
      console.log('Token refreshed');
    } catch (error) {
      console.error('Refresh failed:', error);
    }
  };

  return <button onClick={handleRefresh}>Refresh Token</button>;
}
```

---

## Error Handling

### API Errors

```typescript
interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

// Usage
try {
  const user = await userApi.getUserById('invalid-id');
} catch (error) {
  if (isApiError(error)) {
    console.error(`Error ${error.statusCode}: ${error.message}`);
  }
}
```

### Query Errors

```typescript
import { useQuery } from '@tanstack/react-query';

function Component() {
  const { data, error, isError } = useQuery({
    queryKey: ['users'],
    queryFn: userApi.getUsers,
  });

  if (isError) {
    return <ErrorMessage error={error} />;
  }

  return <UserList users={data} />;
}
```

---

## Middleware Integration

### Protected Routes

```typescript
// src/middleware.ts

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    const url = new URL('/auth', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
```

### Usage in Components

```typescript
// No need to check auth manually
// Middleware handles it automatically

function DashboardPage() {
  // This page is protected by middleware
  // User is guaranteed to be authenticated

  return <DashboardLayout>{/* Content */}</DashboardLayout>;
}
```

---

## Best Practices

### API Calls

```typescript
// ✅ Good: Use TanStack Query
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: userApi.getUsers,
});

// ❌ Bad: Direct API calls in components
const [users, setUsers] = useState([]);
useEffect(() => {
  userApi.getUsers().then(setUsers);
}, []);
```

### Error Handling

```typescript
// ✅ Good: Handle errors gracefully
const { data, error, isError } = useQuery({
  queryKey: ['users'],
  queryFn: userApi.getUsers,
  retry: 3,
  retryDelay: 1000,
});

if (isError) {
  return <ErrorBoundary error={error} />;
}

// ❌ Bad: Ignore errors
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: userApi.getUsers,
});
```

### Loading States

```typescript
// ✅ Good: Show loading states
const { data, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: userApi.getUsers,
});

if (isLoading) {
  return <Skeleton />;
}

// ❌ Bad: No loading state
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: userApi.getUsers,
});

return <UserList users={data} />; // data might be undefined
```

### Mutations

```typescript
// ✅ Good: Use mutations for write operations
const createMutation = useMutation({
  mutationFn: userApi.createUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
});

// ❌ Bad: Direct API calls
const handleCreate = async (data) => {
  await userApi.createUser(data);
  // No cache invalidation
};
```

---

## Testing API Integration

### Mock API Responses

```typescript
import { vi } from 'vitest';
import { userApi } from '@/lib/api/user.api';

vi.mock('@/lib/api/user.api', () => ({
  userApi: {
    getUsers: vi.fn(() => Promise.resolve([
      { id: '1', name: 'John Doe' },
    ])),
  },
}));

test('renders users', async () => {
  render(<UserList />);

  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

### Test Queries

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

test('fetches users', async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <UserList />
    </QueryClientProvider>
  );

  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```
