import type { Meta, StoryObj } from '@storybook/react-vite';
import { HelpSection } from './HelpSection';
import { mockDataPT, mockDataEN } from '../../../data/mockData';

const meta = {
  title: 'Sections/HelpSection',
  component: HelpSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HelpSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: mockDataPT.help,
  },
};

export const English: Story = {
  args: {
    data: mockDataEN.help,
  },
};
