/**
 * Storybook stories para el componente FormField
 */

import { FormField } from '@/components/molecules/FormField/FormField';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Molecules/FormField',
  component: FormField,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Etiqueta del campo',
    },
    error: {
      control: 'text',
      description: 'Mensaje de error',
    },
    required: {
      control: 'boolean',
      description: 'Campo requerido',
    },
  },
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Email',
    required: true,
    children: (
      <input
        type="email"
        placeholder="tu@email.com"
        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    ),
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    required: true,
    error: 'El email es requerido',
    children: (
      <input
        type="email"
        placeholder="tu@email.com"
        className="w-full px-4 py-2 rounded-lg border border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
      />
    ),
  },
};

export const Optional: Story = {
  args: {
    label: 'Teléfono',
    required: false,
    children: (
      <input
        type="tel"
        placeholder="+57 300 123 4567"
        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    ),
  },
};
