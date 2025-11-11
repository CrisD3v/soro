/**
 * Tests para el componente FormField
 */

import { FormField } from '@/components/molecules/FormField/FormField';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('FormField', () => {
  it('debe renderizar el label correctamente', () => {
    render(
      <FormField label="Email" htmlFor="email">
        <input id="email" type="email" />
      </FormField>
    );

    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('debe mostrar asterisco cuando required=true', () => {
    render(
      <FormField label="Email" required>
        <input type="email" />
      </FormField>
    );

    const asterisk = screen.getByText('*');
    expect(asterisk).toBeInTheDocument();
    expect(asterisk).toHaveClass('text-purple-500');
  });

  it('no debe mostrar asterisco cuando required=false', () => {
    render(
      <FormField label="Email" required={false}>
        <input type="email" />
      </FormField>
    );

    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('debe renderizar el children', () => {
    render(
      <FormField label="Email">
        <input type="email" data-testid="email-input" />
      </FormField>
    );

    expect(screen.getByTestId('email-input')).toBeInTheDocument();
  });

  it('debe mostrar mensaje de error cuando se proporciona', () => {
    render(
      <FormField label="Email" error="El email es requerido">
        <input type="email" />
      </FormField>
    );

    expect(screen.getByText('El email es requerido')).toBeInTheDocument();
  });

  it('no debe mostrar mensaje de error cuando no se proporciona', () => {
    render(
      <FormField label="Email">
        <input type="email" />
      </FormField>
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('debe aplicar clases personalizadas', () => {
    const { container } = render(
      <FormField label="Email" className="custom-class">
        <input type="email" />
      </FormField>
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('debe asociar el label con el input usando htmlFor', () => {
    render(
      <FormField label="Email" htmlFor="email-input">
        <input id="email-input" type="email" />
      </FormField>
    );

    const label = screen.getByText('Email');
    expect(label).toHaveAttribute('for', 'email-input');
  });
});
