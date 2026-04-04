import type { Meta, StoryObj } from '@storybook/react-vite';

import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'UI/Tag',
  component: Tag,
  args: {
    children: 'Mensal',
    variant: 'dark',
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Tag>;

export const Dark: Story = {};

export const Light: Story = {
  args: {
    variant: 'light',
    children: 'Internacional',
  },
};

export const Accent: Story = {
  args: {
    variant: 'accent',
    children: 'Pontual',
  },
};
