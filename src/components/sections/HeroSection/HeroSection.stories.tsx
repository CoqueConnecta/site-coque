import type { Meta, StoryObj } from '@storybook/react-vite';
import { HeroSection } from './HeroSection';
import type { ResolvedHeroData } from '../../../types/cms';

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

const basePhotos = [
  { src: '/mulheres-costurando.jpg', alt: 'Mulheres costurando em ateliê da Coque Connecta' },
  { src: '/jovens-no-auditorio.jpg', alt: 'Jovens reunidos em auditório da Coque Connecta' },
  { src: '/crianca-lavando-as-maos.jpg', alt: 'Criança lavando as mãos em atividade da Coque Connecta' },
];

const baseData: ResolvedHeroData = {
  photos: basePhotos,
  headline: 'Transformamos\nvidas no Coque.',
  subheadline: 'Apoie projetos que mudam o futuro de crianças, jovens e famílias da comunidade do Coque, no Recife.',
  ctaText: 'Doar agora',
  secondaryCtaText: 'Faça parte',
};

export const Default: Story = {
  args: {
    data: baseData,
  },
};

export const English: Story = {
  args: {
    data: {
      ...baseData,
      headline: 'We transform\nlives in Coque.',
      subheadline: 'Support projects that change the future of children, youth and families in the Coque community, in Recife.',
      ctaText: 'Donate now',
      secondaryCtaText: 'Join us',
    },
  },
};

export const WithoutPhotos: Story = {
  args: {
    data: { ...baseData, photos: [] },
  },
};

export const WithOnePhoto: Story = {
  args: {
    data: { ...baseData, photos: [basePhotos[0]] },
  },
};

export const WithoutCTA: Story = {
  args: {
    data: { ...baseData, ctaText: '', secondaryCtaText: '' },
  },
};
