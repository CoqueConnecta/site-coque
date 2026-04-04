import type { Meta, StoryObj } from '@storybook/react-vite';

import { IconButton } from './IconButton';

const BarsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 4H16M2 9H16M2 14H16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const meta: Meta<typeof IconButton> = {
  title: 'UI/IconButton',
  component: IconButton,
  args: {
    icon: <BarsIcon />,
    label: 'Abrir menu',
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof IconButton>;

export const Soft: Story = {};

export const Solid: Story = {
  args: {
    variant: 'solid',
    icon: <CloseIcon />,
    label: 'Fechar menu',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <IconButton size="sm" icon={<BarsIcon />} label="Abrir menu pequeno" />
      <IconButton size="md" icon={<BarsIcon />} label="Abrir menu medio" />
      <IconButton size="lg" icon={<BarsIcon />} label="Abrir menu grande" />
    </div>
  ),
};
