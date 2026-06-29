import type { Meta, StoryObj } from '@storybook/react-vite';
import { WaysToHelpSection } from './WaysToHelpSection';
import { mockDataPT, mockDataEN } from '../../../data/mockData';

const meta = {
  title: 'Sections/WaysToHelpSection',
  component: WaysToHelpSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WaysToHelpSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: mockDataPT.waysToHelp,
  },
};

export const English: Story = {
  args: {
    data: mockDataEN.waysToHelp,
  },
};
