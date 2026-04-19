import { mockDataEN, mockDataPT } from './mockData';
import type { CmsLandingData, CmsLanguage } from '../types/cms';

const aboutTickerImages = [
  {
    src: '/mulheres-costurando.jpg',
    alt: 'Atividades da Coque Connecta',
  },
  {
    src: '/mulheres-recortando-tecido.jpg',
    alt: 'Atividades da Coque Connecta',
  },
  {
    src: '/mulher-ensinando-estudante.jpg',
    alt: 'Atividades da Coque Connecta',
  },
  {
    src: '/mulheres-estudando.jpg',
    alt: 'Atividades da Coque Connecta',
  },
  {
    src: '/crianca-lavando-as-maos.jpg',
    alt: 'Atividades da Coque Connecta',
  },
  {
    src: '/jovens-no-auditorio.jpg',
    alt: 'Atividades da Coque Connecta',
  },
];

const fallbackPT: CmsLandingData = {
  nav: {
    links: [
      { id: 'inicio', labels: { pt: 'Início', en: 'Home' }, href: '/#hero' },
      { id: 'about', labels: { pt: 'Quem Somos', en: 'Who We Are' }, href: '/#about' },
      { id: 'our-work', labels: { pt: 'Nossos Projetos', en: 'Our Projects' }, href: '/#our-work' },
      { id: 'contact', labels: { pt: 'Faça Parte', en: 'Join Us' }, href: '/#contact' },
    ],
    cta: {
      labels: { pt: 'DOE AGORA', en: 'DONATE NOW' },
      href: 'https://benfeitoria.com/projeto/coqueconnecta',
    },
  },
  hero: mockDataPT.hero,
  about: mockDataPT.about,
  aboutMedia: {
    tickerImages: aboutTickerImages,
    youtubeVideos: [
      { id: 'rwniUxBd5OI', titles: { pt: 'Exemplo de vídeo 1', en: 'Sample video 1' } },
      { id: 'F5g_i93m-lU', titles: { pt: 'Exemplo de vídeo 2', en: 'Sample video 2' } },
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
      { id: 'inicio', labels: { pt: 'Início', en: 'Home' }, href: '/#hero' },
      { id: 'about', labels: { pt: 'Quem Somos', en: 'Who We Are' }, href: '/#about' },
      { id: 'our-work', labels: { pt: 'Nossos Projetos', en: 'Our Projects' }, href: '/#our-work' },
      { id: 'contact', labels: { pt: 'Faça Parte', en: 'Join Us' }, href: '/#contact' },
    ],
    cta: {
      labels: { pt: 'DOE AGORA', en: 'DONATE NOW' },
      href: 'https://benfeitoria.com/projeto/coqueconnecta',
    },
  },
  hero: mockDataEN.hero,
  about: mockDataEN.about,
  aboutMedia: {
    tickerImages: aboutTickerImages,
    youtubeVideos: [
      { id: 'rwniUxBd5OI', titles: { pt: 'Exemplo de vídeo 1', en: 'Sample video 1' } },
      { id: 'F5g_i93m-lU', titles: { pt: 'Exemplo de vídeo 2', en: 'Sample video 2' } },
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
