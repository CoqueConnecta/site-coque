import type { Meta, StoryObj } from '@storybook/react-vite';
import { mockDataPT } from '../../../data/mockData';
import { WaysToHelpCard } from './WaysToHelpCard';

const CARD_BG_LIGHT = '#f9b778';
const CARD_BG_DARK = '#f58634';
const TAG_BG = '#411409';
const TAG_TEXT = '#fef7ee';

const lightCard = mockDataPT.waysToHelp.cards[0];
const darkCard = mockDataPT.waysToHelp.cards[1];

const meta = {
  title: 'Sections/WaysToHelpSection/WaysToHelpCard',
  component: WaysToHelpCard,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <section className="w-full bg-white py-10">
        <div className="mx-auto w-full max-w-[1360px] px-10">
          <Story />
        </div>
      </section>
    ),
  ],
} satisfies Meta<typeof WaysToHelpCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  args: {
    card: lightCard,
    bg: CARD_BG_LIGHT,
    titleColor: '#101014',
    bodyColor: '#101014',
    quoteColor: TAG_BG,
    authorColor: '#101014',
    tagBg: TAG_BG,
    tagText: TAG_TEXT,
  },
};

export const Dark: Story = {
  args: {
    card: darkCard,
    bg: CARD_BG_DARK,
    titleColor: '#411409',
    bodyColor: '#fff',
    quoteColor: '#fff',
    authorColor: '#fff',
    tagBg: TAG_BG,
    tagText: TAG_TEXT,
  },
};

export const WithoutBlockquote: Story = {
  args: {
    card: {
      ...lightCard,
      blockquote: undefined,
    },
    bg: CARD_BG_LIGHT,
    titleColor: '#101014',
    bodyColor: '#101014',
    quoteColor: TAG_BG,
    authorColor: '#101014',
    tagBg: TAG_BG,
    tagText: TAG_TEXT,
  },
};

export const WithAuthorAvatar: Story = {
  args: {
    card: {
      ...darkCard,
      blockquote: darkCard.blockquote
        ? {
            ...darkCard.blockquote,
            authorAvatar: '/dando-maos-com-luvas.jpg',
          }
        : undefined,
    },
    bg: CARD_BG_DARK,
    titleColor: '#411409',
    bodyColor: '#fff',
    quoteColor: '#fff',
    authorColor: '#fff',
    tagBg: TAG_BG,
    tagText: TAG_TEXT,
  },
};
