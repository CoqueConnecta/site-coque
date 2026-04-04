import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { HeaderBar } from './HeaderBar';

const meta = {
  title: 'Composites/HeaderBar',
  component: HeaderBar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HeaderBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultNavLinks = [
  { label: 'Sobre nós', href: '#about', id: 'about' },
  { label: 'Nossos trabalhos', href: '#work', id: 'work' },
  { label: 'Contato', href: '#contact', id: 'contact' },
];

export const Default: Story = {
  args: {
    navLinks: defaultNavLinks,
    ctaText: 'Entre em contato',
    ctaHref: '#contact',
  },
};

export const WithActiveLink: Story = {
  args: {
    navLinks: defaultNavLinks,
    activeLink: '#about',
    ctaText: 'Entre em contato',
  },
};

export const Dark: Story = {
  args: {
    navLinks: defaultNavLinks,
    ctaText: 'Entre em contato',
    variant: 'dark',
  },
  decorators: [
    (Story) => (
      <div className="bg-gray-900">
        <Story />
      </div>
    ),
  ],
};

export const Interactive: Story = {
  args: {
    navLinks: defaultNavLinks,
    ctaText: 'Entre em contato',
  },
  render: (args) => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [activeLink, setActiveLink] = useState<string | undefined>(undefined);

    return (
      <div className="bg-gray-50 pb-20">
        <HeaderBar
          {...args}
          activeLink={activeLink}
          showMobileMenu={showMobileMenu}
          onNavClick={(href) => {
            setActiveLink(href);
            alert(`Navegando para: ${href}`);
          }}
          onMobileMenuClick={() => setShowMobileMenu(!showMobileMenu)}
        />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-600">
            {showMobileMenu ? '📱 Menu mobile está aberto' : '📱 Clique no ícone ☰ para abrir menu mobile'}
          </p>
          {activeLink && (
            <p className="mt-2 text-sm font-semibold text-orange-600">
              Link ativo: {activeLink}
            </p>
          )}
        </div>
      </div>
    );
  },
};

export const Sticky: Story = {
  args: {
    navLinks: defaultNavLinks,
    ctaText: 'Entre em contato',
  },
  render: (args) => (
    <div className="h-[200vh] bg-gray-50">
      <HeaderBar {...args} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">HeaderBar Sticky Demo</h1>
          <p className="text-gray-600">
            Scroll down para ver o header ficar sticky no topo. Este é um conteúdo simulado para demonstrar
            a posição sticky do header.
          </p>
          <div className="mt-12 space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="rounded-lg bg-white p-4 shadow">
                <h2 className="font-semibold text-gray-900">Seção {i + 1}</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
};
