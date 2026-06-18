import type { Meta, StoryObj } from '@storybook/react-vite';
import { InfiniteImageTicker } from './InfiniteImageTicker';

const demoImages = [
  '/mulheres-costurando.jpg',
  '/mulheres-recortando-tecido.jpg',
  '/mulher-ensinando-estudante.jpg',
  '/mulheres-estudando.jpg',
  '/crianca-lavando-as-maos.jpg',
  '/jovens-no-auditorio.jpg',
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
