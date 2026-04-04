import type { Meta, StoryObj } from '@storybook/react-vite';
import { AboutSection } from './AboutSection';
import { mockDataPT, mockDataEN } from '../../../data/mockData';

const meta = {
  title: 'Sections/AboutSection',
  component: AboutSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AboutSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: mockDataPT.about,
  },
};

export const English: Story = {
  args: {
    data: mockDataEN.about,
  },
};
