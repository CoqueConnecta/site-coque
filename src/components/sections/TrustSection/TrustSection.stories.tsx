import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { TrustSection } from './TrustSection';
import type { ResolvedTrustData } from '../../../types/cms';

const meta = {
  title: 'Sections/TrustSection',
  component: TrustSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof TrustSection>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseData: ResolvedTrustData = {
  headline: 'Quem confia na Coque',
  subtitle: 'Organizações, veículos de imprensa e autoridades que já reconheceram nosso trabalho.',
  pressItems: [
    { outlet: 'G1', title: 'Estudantes pernambucanos mostram como a educação transforma vidas', url: 'https://g1.globo.com' },
    { outlet: 'Diário de Pernambuco', title: 'Conectar para transformar: o impacto da Coque Connecta no Recife', url: 'https://www.diariodepernambuco.com.br' },
    { outlet: 'Alma Preta', title: 'Negro, LGBTQIA+ e de periferia: conheça a trajetória de Marcone Ribeiro', url: 'https://almapreta.com.br' },
  ],
  partnerLogos: [],
};

export const Default: Story = {
  args: {
    data: baseData,
    language: 'pt',
  },
};

export const WithPartnerLogos: Story = {
  args: {
    data: {
      ...baseData,
      partnerLogos: [
        { src: '/logo-parceiro-1.png', alt: 'Logo do parceiro 1' },
        { src: '/logo-parceiro-2.png', alt: 'Logo do parceiro 2', url: 'https://example.org' },
      ],
    },
    language: 'pt',
  },
};

export const Empty: Story = {
  args: {
    data: { headline: baseData.headline, subtitle: baseData.subtitle, pressItems: [], partnerLogos: [] },
    language: 'pt',
  },
};
