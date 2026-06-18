import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatsSection } from './StatsSection';
import { mockDataPT, mockDataEN } from '../../../data/mockData';

const meta = {
  title: 'Sections/StatsSection',
  component: StatsSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StatsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: mockDataPT.stats,
  },
};

export const English: Story = {
  args: {
    data: mockDataEN.stats,
  },
};
