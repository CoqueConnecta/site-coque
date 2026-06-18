import type { Meta, StoryObj } from '@storybook/react-vite';
import { HeroSection } from './HeroSection';
import { mockDataPT, mockDataEN } from '../../../data/mockData';

const meta = {
  title: 'Sections/HeroSection',
  component: HeroSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HeroSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: mockDataPT.hero,
  },
};

export const English: Story = {
  args: {
    data: mockDataEN.hero,
  },
};

export const WithoutBackground: Story = {
  args: {
    data: { ...mockDataPT.hero, backgroundImage: "" },
  },
};

export const WithoutCTA: Story = {
  args: {
    data: { ...mockDataPT.hero, ctaText: "" },
  },
};
