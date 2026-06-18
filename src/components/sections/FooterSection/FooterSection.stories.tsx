import type { Meta, StoryObj } from '@storybook/react-vite';
import { FooterSection } from './FooterSection';
import { mockDataPT, mockDataEN } from '../../../data/mockData';

const meta = {
  title: 'Sections/FooterSection',
  component: FooterSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FooterSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: mockDataPT.footer,
  },
};

export const English: Story = {
  args: {
    data: mockDataEN.footer,
  },
};
