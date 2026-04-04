import type { Meta, StoryObj } from '@storybook/react-vite';
import { NavMenu } from './NavMenu';

const meta = {
  title: 'Composites/NavMenu',
  component: NavMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NavMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultLinks = [
  { label: 'Sobre nós', href: '#about', id: 'about' },
  { label: 'Nossos trabalhos', href: '#work', id: 'work' },
  { label: 'Contato', href: '#contact', id: 'contact' },
];

export const Default: Story = {
  args: {
    links: defaultLinks,
  },
};

export const WithActiveLink: Story = {
  args: {
    links: defaultLinks,
    activeLink: '#about',
  },
};

export const ManyLinks: Story = {
  args: {
    links: [
      { label: 'Home', href: '#', id: 'home' },
      { label: 'Sobre', href: '#about', id: 'about' },
      { label: 'Serviços', href: '#services', id: 'services' },
      { label: 'Portfolio', href: '#portfolio', id: 'portfolio' },
      { label: 'Blog', href: '#blog', id: 'blog' },
      { label: 'Contato', href: '#contact', id: 'contact' },
    ],
    activeLink: '#services',
  },
};

export const OnClick: Story = {
  args: {
    links: defaultLinks,
  },
  render: (args) => {
    const handleLinkClick = (href: string) => {
      alert(`Navegando para: ${href}`);
    };
    return <NavMenu {...args} onLinkClick={handleLinkClick} />;
  },
};
