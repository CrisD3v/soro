/**
 * Tests para el componente Logo
 */

import { Logo } from '@/components/atoms/Logo/Logo';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Logo', () => {
  it('debe renderizar correctamente', () => {
    render(<Logo />);
    const logo = screen.getByText(/SO/);
    expect(logo).toBeInTheDocument();
  });

  it('debe aplicar el tamaño small', () => {
    const { container } = render(<Logo size="sm" />);
    const logoDiv = container.firstChild;
    expect(logoDiv).toHaveClass('text-2xl');
  });

  it('debe aplicar el tamaño medium por defecto', () => {
    const { container } = render(<Logo />);
    const logoDiv = container.firstChild;
    expect(logoDiv).toHaveClass('text-4xl');
  });

  it('debe aplicar el tamaño large', () => {
    const { container } = render(<Logo size="lg" />);
    const logoDiv = container.firstChild;
    expect(logoDiv).toHaveClass('text-6xl');
  });

  it('debe aplicar clases personalizadas', () => {
    const { container } = render(<Logo className="custom-class" />);
    const logoDiv = container.firstChild;
    expect(logoDiv).toHaveClass('custom-class');
  });

  it('debe mostrar "SO" y "RO"', () => {
    render(<Logo />);
    expect(screen.getByText('SO')).toBeInTheDocument();
    expect(screen.getByText('RO')).toBeInTheDocument();
  });
});
