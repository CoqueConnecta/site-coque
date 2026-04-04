import type { Meta, StoryObj } from '@storybook/react-vite';
import { GallerySection } from './GallerySection';
import { mockDataPT, mockDataEN } from '../../../data/mockData';

const meta = {
  title: 'Sections/GallerySection',
  component: GallerySection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof GallerySection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: mockDataPT.gallery,
  },
};

export const English: Story = {
  args: {
    data: mockDataEN.gallery,
  },
};
