import type { Meta, StoryObj } from '@storybook/react-vite';

import { Surface } from './Surface';

const meta: Meta<typeof Surface> = {
  title: 'UI/Surface',
  component: Surface,
  parameters: {
    layout: 'padded',
  },
  args: {
    children: 'Conteudo de exemplo',
    padding: 'lg',
  },
};

export default meta;

type Story = StoryObj<typeof Surface>;

export const Hero: Story = {
  args: {
    variant: 'hero',
    children: 'Hero surface com gradiente de referencia do Framer',
  },
};

export const CardLight: Story = {
  args: {
    variant: 'cardLight',
    children: 'Card claro para secoes de ajuda',
  },
};

export const CardStrong: Story = {
  args: {
    variant: 'cardStrong',
    children: 'Card forte para destaque',
  },
};

export const Newsletter: Story = {
  args: {
    variant: 'newsletter',
    children: 'Surface base da newsletter',
  },
};

export const PanelWithShadow: Story = {
  args: {
    variant: 'panel',
    shadow: 'soft',
    children: 'Painel neutro com sombra suave',
  },
};
