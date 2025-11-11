/**
 * Tests para el componente PasswordInput
 */

import { PasswordInput } from '@/components/molecules/PasswordInput/PasswordInput';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

describe('PasswordInput', () => {
  it('debe renderizar correctamente', () => {
    render(<PasswordInput placeholder="Contraseña" />);
    const input = screen.getByPlaceholderText('Contraseña');
    expect(input).toBeInTheDocument();
  });

  it('debe iniciar con type="password"', () => {
    const { container } = render(<PasswordInput />);
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('debe cambiar a type="text" al hacer click en el botón', async () => {
    const user = userEvent.setup();
    const { container } = render(<PasswordInput />);

    const input = container.querySelector('input');
    const toggleButton = screen.getByRole('button');

    expect(input).toHaveAttribute('type', 'password');

    await user.click(toggleButton);

    expect(input).toHaveAttribute('type', 'text');
  });

  it('debe aplicar estilos de error cuando error=true', () => {
    const { container } = render(<PasswordInput error={true} />);
    const input = container.querySelector('input');
    expect(input).toHaveClass('border-red-500');
  });

  it('debe aplicar estilos normales cuando error=false', () => {
    const { container } = render(<PasswordInput error={false} />);
    const input = container.querySelector('input');
    expect(input).toHaveClass('border-gray-300');
  });

  it('debe permitir escribir en el input', async () => {
    const user = userEvent.setup();
    const { container } = render(<PasswordInput />);

    const input = container.querySelector('input') as HTMLInputElement;
    await user.type(input, 'password123');

    expect(input).toHaveValue('password123');
  });

  it('debe estar deshabilitado cuando disabled=true', () => {
    const { container } = render(<PasswordInput disabled />);
    const input = container.querySelector('input');
    expect(input).toBeDisabled();
  });
});
