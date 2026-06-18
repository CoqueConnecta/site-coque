import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { MobileMenuOverlay } from './MobileMenuOverlay';
import { Button } from '../../ui/Button';

const meta = {
  title: 'Composites/MobileMenuOverlay',
  component: MobileMenuOverlay,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MobileMenuOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultNavLinks = [
  { label: 'Sobre nós', href: '#about', id: 'about' },
  { label: 'Nossos trabalhos', href: '#work', id: 'work' },
  { label: 'Blog', href: '#blog', id: 'blog' },
  { label: 'FAQ', href: '#faq', id: 'faq' },
  { label: 'Contato', href: '#contact', id: 'contact' },
];

export const Closed: Story = {
  args: {
    isOpen: false,
    navLinks: defaultNavLinks,
  },
  decorators: [
    (Story) => (
      <div className="h-screen bg-gray-50">
        <Story />
        <div className="flex items-center justify-center p-8">
          <p className="text-gray-600">Menu está fechado</p>
        </div>
      </div>
    ),
  ],
};

export const Open: Story = {
  args: {
    isOpen: true,
    navLinks: defaultNavLinks,
    showNewsletter: true,
  },
  decorators: [
    (Story) => (
      <div className="h-screen bg-gray-50">
        <Story />
      </div>
    ),
  ],
};

export const OpenWithActiveLink: Story = {
  args: {
    isOpen: true,
    navLinks: defaultNavLinks,
    activeLink: '#work',
    showNewsletter: true,
  },
  decorators: [
    (Story) => (
      <div className="h-screen bg-gray-50">
        <Story />
      </div>
    ),
  ],
};

export const WithoutNewsletter: Story = {
  args: {
    isOpen: true,
    navLinks: defaultNavLinks,
    showNewsletter: false,
  },
  decorators: [
    (Story) => (
      <div className="h-screen bg-gray-50">
        <Story />
      </div>
    ),
  ],
};

export const Interactive: Story = {
  args: {
    isOpen: false,
    navLinks: defaultNavLinks,
    showNewsletter: true,
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="h-screen bg-gray-50">
        <div className="flex items-center justify-center p-8">
          <Button onClick={() => setIsOpen(!isOpen)} variant="primary">
            {isOpen ? 'Fechar Menu' : 'Abrir Menu'}
          </Button>
        </div>
        <MobileMenuOverlay
          {...args}
          isOpen={isOpen}
          navLinks={defaultNavLinks}
          onClose={() => setIsOpen(false)}
          onNavClick={(href) => {
            alert(`Navegando para: ${href}`);
            setIsOpen(false);
          }}
        />
      </div>
    );
  },
};

export const InteractiveFullDemo: Story = {
  args: {
    isOpen: false,
    navLinks: defaultNavLinks,
    showNewsletter: true,
  },
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeLink, setActiveLink] = useState<string | undefined>(undefined);

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Simulation */}
        <header className="sticky top-0 z-20 border-b border-gray-100 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
            <div className="text-lg font-bold text-gray-900">Coque Connecta</div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
            >
              {isOpen ? '✕' : '☰'}
            </button>
          </div>
        </header>

        {/* Mobile Menu */}
        <MobileMenuOverlay
          isOpen={isOpen}
          navLinks={defaultNavLinks}
          activeLink={activeLink}
          onClose={() => setIsOpen(false)}
          onNavClick={(href) => {
            setActiveLink(href);
            alert(`Navegando para: ${href}`);
          }}
          showNewsletter
        />

        {/* Content */}
        <main className="mx-auto max-w-7xl px-4 py-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">Demo Interativo</h1>
          <p className="mb-6 text-gray-600">
            Clique no botão acima (☰) para abrir o menu mobile overlay. O menu aparecerá da direita com efeito de deslizamento.
          </p>

          {activeLink && (
            <div className="rounded-lg bg-orange-50 p-4">
              <p className="font-semibold text-orange-900">
                Link ativo selecionado: <span className="text-orange-600">{activeLink}</span>
              </p>
            </div>
          )}

          <div className="mt-12 space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-2 text-xl font-semibold text-gray-900">Seção {i + 1}</h2>
                <p className="text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  },
};
