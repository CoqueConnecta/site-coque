import type { Meta, StoryObj } from '@storybook/react-vite';
import { NewsletterSection } from './NewsletterSection';
import { mockDataPT, mockDataEN } from '../../../data/mockData';

const meta = {
  title: 'Sections/NewsletterSection',
  component: NewsletterSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NewsletterSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: mockDataPT.newsletter,
  },
};

export const English: Story = {
  args: {
    data: mockDataEN.newsletter,
  },
};

export const Interactive: Story = {
  args: {
    data: mockDataPT.newsletter,
  },
  render: (args) => <NewsletterSection {...args} />,
};
