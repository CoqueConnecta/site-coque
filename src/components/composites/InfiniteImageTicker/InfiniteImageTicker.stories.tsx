import type { Meta, StoryObj } from '@storybook/react-vite';
import { InfiniteImageTicker } from './InfiniteImageTicker';

const demoImages = [
  'https://framerusercontent.com/images/nICdkmexvoBG2bA2goiNyF1mcY.jpg?width=1280&height=1600',
  'https://framerusercontent.com/images/sBRdczu8bFBR8Rg0cEoUriOt8WU.jpg?width=1440&height=973',
  'https://framerusercontent.com/images/5rHHzdIIT6bfHvdO1Eat1SsY4Zo.jpg?width=960&height=1280',
  'https://framerusercontent.com/images/dJVDsHYR0sR8qpyxmYUJD8os.jpg?width=4032&height=3024',
  'https://framerusercontent.com/images/EGwC09xR8iUr4R6I6YxLoCqUcQ.jpg?width=3024&height=4032',
  'https://framerusercontent.com/images/AnnnTX5gDlgnIZzRJ0bNzA9CkpU.jpg?width=4032&height=3024',
];

const meta = {
  title: 'Composites/InfiniteImageTicker',
  component: InfiniteImageTicker,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof InfiniteImageTicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    images: demoImages,
    imageAlt: 'Atividades da Coque Connecta',
  },
};

export const InsideWhiteSection: Story = {
  args: {
    images: demoImages,
    imageAlt: 'Atividades da Coque Connecta',
  },
  render: (args) => (
    <section className="w-full bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <InfiniteImageTicker {...args} />
      </div>
    </section>
  ),
};
