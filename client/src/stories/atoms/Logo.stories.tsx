/**
 * Storybook stories para el componente Logo
 */

import { Logo } from '@/components/atoms/Logo/Logo';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Atoms/Logo',
  component: Logo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tamaño del logo',
    },
    className: {
      control: 'text',
      description: 'Clases CSS adicionales',
    },
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const WithCustomClass: Story = {
  args: {
    size: 'md',
    className: 'text-blue-500',
  },
};
