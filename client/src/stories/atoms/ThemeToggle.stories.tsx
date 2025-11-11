/**
 * Storybook stories para el componente ThemeToggle
 */

import { ThemeToggle } from '@/components/atoms/ThemeToggle/ThemeToggle';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Atoms/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Clases CSS adicionales',
    },
  },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithCustomClass: Story = {
  args: {
    className: 'shadow-lg',
  },
};
