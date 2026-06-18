import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  args: {
    placeholder: 'E-mail',
  },
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: {
    label: 'Seu e-mail',
  },
};

export const Error: Story = {
  args: {
    label: 'Seu e-mail',
    error: 'Informe um e-mail valido.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Seu e-mail',
    disabled: true,
    value: 'contato@coqueconnecta.com.br',
  },
};
