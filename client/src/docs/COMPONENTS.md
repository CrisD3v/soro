# 🧩 Guía de Componentes

## 📋 Índice
- [Atoms](#atoms)
- [Molecules](#molecules)
- [Organisms](#organisms)
- [Templates](#templates)
- [Uso y Ejemplos](#uso-y-ejemplos)

---

## Atoms

### Logo

Componente de logo animado de la aplicación.

**Props:**
```typescript
interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

**Uso:**
```tsx
import { Logo } from '@/components/atoms/Logo/Logo';

<Logo size="md" />
```

**Características:**
- Animación de entrada con motion
- Tres tamaños predefinidos
- Colores morados del tema

---

### ThemeToggle

Botón para alternar entre modo claro y oscuro.

**Props:**
```typescript
interface ThemeToggleProps {
  className?: string;
}
```

**Uso:**
```tsx
import { ThemeToggle } from '@/components/atoms/ThemeToggle/ThemeToggle';

<ThemeToggle />
```

**Características:**
- Animación de rotación al cambiar
- Iconos de sol/luna
- Persiste preferencia en localStorage
- Integrado con useTheme hook

---

## Molecules

### FormField

Wrapper para inputs con label y mensaje de error.

**Props:**
```typescript
interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}
```

**Uso:**
```tsx
import { FormField } from '@/components/molecules/FormField/FormField';

<FormField
  label="Email"
  error={errors.email?.message}
  required
  htmlFor="email"
>
  <input id="email" type="email" />
</FormField>
```

**Características:**
- Animación de entrada para errores
- Indicador visual de campo requerido
- Asociación automática label-input
- Soporte dark mode

---

### PasswordInput

Input de contraseña con toggle de visibilidad.

**Props:**
```typescript
interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: boolean;
}
```

**Uso:**
```tsx
import { PasswordInput } from '@/components/molecules/PasswordInput/PasswordInput';

<PasswordInput
  placeholder="••••••••"
  error={!!errors.password}
/>
```

**Características:**
- Toggle animado de visibilidad
- Iconos de ojo/ojo tachado
- Estados de error
- Accesibilidad (aria-label)

---

## Organisms

### LoginForm

Formulario completo de inicio de sesión.

**Props:**
```typescript
interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
  onSwitchToReset?: () => void;
}
```

**Uso:**
```tsx
import { LoginForm } from '@/components/organisms/LoginForm/LoginForm';

<LoginForm
  onSuccess={() => router.push('/dashboard')}
  onSwitchToRegister={() => setView('register')}
  onSwitchToReset={() => setView('reset')}
/>
```

**Características:**
- Validación con Zod
- Integración con TanStack Query
- Manejo de errores de API
- Animaciones de entrada/salida
- Loading state

---

### RegisterForm

Formulario completo de registro de usuario.

**Props:**
```typescript
interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}
```

**Uso:**
```tsx
import { RegisterForm } from '@/components/organisms/RegisterForm/RegisterForm';

<RegisterForm
  onSuccess={() => setView('login')}
  onSwitchToLogin={() => setView('login')}
/>
```

**Características:**
- Validación completa de datos
- Campos de documento y teléfono
- Selector de tipo de documento
- Grid responsive
- Validación de formato de teléfono colombiano

---

### ResetPasswordForm

Formulario para solicitar recuperación de contraseña.

**Props:**
```typescript
interface ResetPasswordFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}
```

**Uso:**
```tsx
import { ResetPasswordForm } from '@/components/organisms/ResetPasswordForm/ResetPasswordForm';

<ResetPasswordForm
  onSuccess={() => setView('login')}
  onSwitchToLogin={() => setView('login')}
/>
```

**Características:**
- Validación de email
- Mensaje de éxito
- Botón de volver al login
- Manejo de errores

---

## Templates

### AuthTemplate

Template principal para vistas de autenticación.

**Props:**
```typescript
interface AuthTemplateProps {
  initialView?: 'login' | 'register' | 'reset';
  onAuthSuccess?: () => void;
}
```

**Uso:**
```tsx
import { AuthTemplate } from '@/components/templates/AuthTemplate/AuthTemplate';

<AuthTemplate
  initialView="login"
  onAuthSuccess={() => router.push('/')}
/>
```

**Características:**
- Compound Component Pattern
- Transiciones animadas entre vistas
- ThemeToggle integrado
- Diseño responsive
- Gradiente de fondo morado

---

## Uso y Ejemplos

### Ejemplo Completo: Página de Auth

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { AuthTemplate } from '@/components/templates/AuthTemplate/AuthTemplate';

export default function AuthPage() {
  const router = useRouter();

  return (
    <AuthTemplate
      initialView="login"
      onAuthSuccess={() => router.push('/dashboard')}
    />
  );
}
```

### Ejemplo: Formulario Personalizado

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '@/components/molecules/FormField/FormField';
import { PasswordInput } from '@/components/molecules/PasswordInput/PasswordInput';
import { loginSchema } from '@/lib/utils/validators';

export function CustomLoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField
        label="Email"
        error={errors.email?.message}
        required
      >
        <input
          type="email"
          {...register('email')}
        />
      </FormField>

      <FormField
        label="Contraseña"
        error={errors.password?.message}
        required
      >
        <PasswordInput
          error={!!errors.password}
          {...register('password')}
        />
      </FormField>

      <button type="submit">Iniciar Sesión</button>
    </form>
  );
}
```

### Ejemplo: Uso de Hooks

```tsx
'use client';

import { useAuth } from '@/hooks/useAuth/useAuth';
import { useTheme } from '@/hooks/useTheme/useTheme';

export function UserProfile() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (!isAuthenticated) {
    return <div>No autenticado</div>;
  }

  return (
    <div>
      <h1>Hola, {user?.name}</h1>
      <p>Tema actual: {theme}</p>
      <button onClick={toggleTheme}>Cambiar tema</button>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
```

---

## Testing

Todos los componentes tienen tests en `src/__tests__/`:

```bash
# Ejecutar todos los tests
pnpm test

# Ejecutar tests con UI
pnpm test:ui

# Ejecutar tests con coverage
pnpm test:coverage
```

## Storybook

Ver todos los componentes en Storybook:

```bash
pnpm storybook
```

Navega a `http://localhost:6006`
