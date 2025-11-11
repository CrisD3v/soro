/**
 * Página de autenticación
 */

'use client';

import { AuthTemplate } from '@/components/templates/AuthTemplate/AuthTemplate';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();

  const handleAuthSuccess = () => {
    // Redirigir al dashboard o home después del login exitoso
    router.push('/');
  };

  return <AuthTemplate onAuthSuccess={handleAuthSuccess} />;
}
