import { mockDataEN, mockDataPT } from './mockData';
import type { CmsLandingData, CmsLanguage } from '../types/cms';

const aboutTickerImages = [
  {
    src: 'https://framerusercontent.com/images/nICdkmexvoBG2bA2goiNyF1mcY.jpg?width=1280&height=1600',
    alt: 'Atividades da Coque Connecta',
  },
  {
    src: 'https://framerusercontent.com/images/sBRdczu8bFBR8Rg0cEoUriOt8WU.jpg?width=1440&height=973',
    alt: 'Atividades da Coque Connecta',
  },
  {
    src: 'https://framerusercontent.com/images/5rHHzdIIT6bfHvdO1Eat1SsY4Zo.jpg?width=960&height=1280',
    alt: 'Atividades da Coque Connecta',
  },
  {
    src: 'https://framerusercontent.com/images/dJVDsHYR0sR8qpyxmYUJD8os.jpg?width=4032&height=3024',
    alt: 'Atividades da Coque Connecta',
  },
  {
    src: 'https://framerusercontent.com/images/EGwC09xR8iUr4R6I6YxLoCqUcQ.jpg?width=3024&height=4032',
    alt: 'Atividades da Coque Connecta',
  },
  {
    src: 'https://framerusercontent.com/images/AnnnTX5gDlgnIZzRJ0bNzA9CkpU.jpg?width=4032&height=3024',
    alt: 'Atividades da Coque Connecta',
  },
];

const fallbackPT: CmsLandingData = {
  nav: {
    links: [
      { id: 'inicio', label: 'Início', href: '/#hero' },
      { id: 'about', label: 'Quem Somos', href: '/#about' },
      { id: 'our-work', label: 'Nossos Projetos', href: '/#our-work' },
      { id: 'contact', label: 'Faça Parte', href: '/#contact' },
    ],
    cta: {
      label: 'DOE AGORA',
      href: 'https://benfeitoria.com/projeto/coqueconnecta',
    },
  },
  hero: mockDataPT.hero,
  about: mockDataPT.about,
  aboutMedia: {
    tickerImages: aboutTickerImages,
    youtubeVideos: [
      { id: 'rwniUxBd5OI', title: 'Exemplo de vídeo 1' },
      { id: 'F5g_i93m-lU', title: 'Exemplo de vídeo 2' },
    ],
  },
  gallery: mockDataPT.gallery,
  stats: mockDataPT.stats,
  newsletter: mockDataPT.newsletter,
  footer: mockDataPT.footer,
  privacy: {
    title: 'Política de Privacidade',
    updatedAt: 'Abril de 2026',
    intro:
      'Bem-vindo(a) à Coque Connecta. A sua privacidade e a segurança dos seus dados pessoais são muito importantes para nós. Criamos este documento para explicar de forma clara, simples e transparente quais dados nós coletamos, como os utilizamos e quais são os seus direitos, em total conformidade com a LGPD.',
    sections: [],
  },
  transparency: {
    title: 'Transparência',
    intro: 'Em breve, publicaremos aqui documentos e indicadores de prestação de contas.',
    body: [
      'Esta página foi criada para centralizar informações de governança e transparência da Coque Connecta, incluindo relatórios, resultados e dados institucionais relevantes.',
      'Para solicitações imediatas, entre em contato pelo e-mail contato@coqueconnecta.com.br.',
    ],
  },
};

const fallbackEN: CmsLandingData = {
  nav: {
    links: [
      { id: 'inicio', label: 'Home', href: '/#hero' },
      { id: 'about', label: 'Who We Are', href: '/#about' },
      { id: 'our-work', label: 'Our Projects', href: '/#our-work' },
      { id: 'contact', label: 'Join Us', href: '/#contact' },
    ],
    cta: {
      label: 'DONATE NOW',
      href: 'https://benfeitoria.com/projeto/coqueconnecta',
    },
  },
  hero: mockDataEN.hero,
  about: mockDataEN.about,
  aboutMedia: {
    tickerImages: aboutTickerImages,
    youtubeVideos: [
      { id: 'rwniUxBd5OI', title: 'Sample video 1' },
      { id: 'F5g_i93m-lU', title: 'Sample video 2' },
    ],
  },
  gallery: mockDataEN.gallery,
  stats: mockDataEN.stats,
  newsletter: mockDataEN.newsletter,
  footer: mockDataEN.footer,
  privacy: {
    title: 'Privacy Policy',
    updatedAt: 'April 2026',
    intro:
      'Welcome to Coque Connecta. Your privacy and personal data security are very important to us. This document explains, in a clear and transparent way, what data we collect, how we use it, and your rights.',
    sections: [],
  },
  transparency: {
    title: 'Transparency',
    intro: 'Soon, we will publish accountability documents and indicators here.',
    body: [
      'This page was created to centralize governance and transparency information from Coque Connecta, including reports, outcomes, and institutional data.',
      'For immediate requests, contact us at contact@coqueconnecta.com.br.',
    ],
  },
};

export const cmsFallbackByLanguage: Record<CmsLanguage, CmsLandingData> = {
  pt: fallbackPT,
  en: fallbackEN,
};
