import type { Meta, StoryObj } from '@storybook/react-vite';

import { Logo } from './Logo';

const meta: Meta<typeof Logo> = {
  title: 'UI/Logo',
  component: Logo,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Logo>;

export const Default: Story = {};

export const Monochrome: Story = {
  args: {
    variant: 'monochrome',
  },
  decorators: [
    (Story) => (
      <div className="rounded-[var(--radius-md)] bg-[color:var(--color-surface-card-strong)] p-6">
        <Story />
      </div>
    ),
  ],
};

export const Responsive: Story = {
  render: () => (
    <div className="w-[min(80vw,420px)] border border-black/10 p-4">
      <Logo className="w-full" />
    </div>
  ),
};
