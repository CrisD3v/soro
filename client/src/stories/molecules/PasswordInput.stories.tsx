/**
 * Storybook stories para el componente PasswordInput
 */

import { PasswordInput } from '@/components/molecules/PasswordInput/PasswordInput';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Molecules/PasswordInput',
  component: PasswordInput,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    error: {
      control: 'boolean',
      description: 'Estado de error',
    },
    placeholder: {
      control: 'text',
      description: 'Texto placeholder',
    },
  },
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: '••••••••',
    error: false,
  },
};

export const WithError: Story = {
  args: {
    placeholder: '••••••••',
    error: true,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: '••••••••',
    disabled: true,
  },
};
