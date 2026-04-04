import type { Meta, StoryObj } from '@storybook/react-vite';

import { Typography } from './Typography';

const meta: Meta<typeof Typography> = {
  title: 'UI/Typography',
  component: Typography,
  args: {
    children: 'Conectando pessoas, multiplicando horizontes',
    variant: 'body',
  },
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof Typography>;

export const Display: Story = {
  args: {
    variant: 'display',
    children: 'Multiplicando Horizontes',
  },
};

export const Headings: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography variant="h1">Titulo H1</Typography>
      <Typography variant="h2">Titulo H2</Typography>
      <Typography variant="h3">Titulo H3</Typography>
    </div>
  ),
};

export const Body: Story = {
  args: {
    variant: 'body',
    tone: 'muted',
    children:
      'Uma oportunidade de trabalhar com uma ferramenta tangivel, de curto prazo e de triplo impacto.',
  },
};

export const Stat: Story = {
  render: () => (
    <div className="space-y-2">
      <Typography variant="stat">+2,000</Typography>
      <Typography variant="body" tone="muted">
        Jovens impactados
      </Typography>
    </div>
  ),
};
