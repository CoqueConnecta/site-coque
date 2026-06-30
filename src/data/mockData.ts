/**
 * Mock data consolidado para sections da landing page - Fase 4
 * Este arquivo centraliza todo conteúdo mockado para facilitar manutenção e internacionalização futura
 */

export interface HeroData {
  headline: string;
  subheadline: string;
  ctaText: string;
  backgroundImage: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface StatsData {
  items: StatItem[];
}

export interface HelpCard {
  id: string;
  title: string;
  description: string;
  image?: string;
  tags: string[];
  variant: 'light' | 'dark';
  blockquote?: {
    text: string;
    authorName: string;
    authorAvatar?: string;
  };
}

export interface WaysToHelpData {
  headline: string;
  subtitle: string;
  cards: HelpCard[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
}

export interface AboutData {
  description: string;
}

export interface HelpData {
  headline: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  highlightedText?: string;
}

export interface NewsletterData {
  headline: string;
  headlineAccent: string;
  description: string;
  placeholderEmail: string;
  buttonText: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface FooterData {
  copyright: string;
  address: string;
  phone?: string;
  email?: string;
  socialLinks: SocialLink[];
  quickLinks: Array<{
    label: string;
    href: string;
  }>;
}

export interface LandingPageData {
  hero: HeroData;
  about: AboutData;
  waysToHelp: WaysToHelpData;
  stats: StatsData;
  help: HelpData;
  newsletter: NewsletterData;
  footer: FooterData;
}

// PORTUGUÊS - PT-BR
export const mockDataPT: LandingPageData = {
  hero: {
    headline: "Conectando Pessoas,\nMultiplicando Horizontes.",
    subheadline:
      "Uma oportunidade de trabalhar com uma ferramenta tangível, de curto prazo e de triplo impacto, que gera valor para sua empresa, para a comunidade e seus colaboradores.",
    ctaText: "Faça Parte",
    backgroundImage: "/assets/banner.jpg",
  },
  about: {
    description:
      "Tudo começou com uma ideia potente, nascida do encontro entre dois líderes locais, um jovem sonhador e sua mãe, que acreditavam que a educação podia reescrever destinos e transformar realidades. Marcone Ribeiro e Dona Danda, inspirados por suas próprias vivências, transformaram visão em ação, criando um espaço onde juventudes periféricas e suas famílias pudessem se enxergar, reconhecer seu valor e construir novos caminhos. Desde então, a Coque Connecta tornou-se um movimento coletivo de transformação, um espaço vivo feito de escuta, cuidado e formação cidadã.",
  },
  waysToHelp: {
    headline: "Saiba como ajudar",
    subtitle: "Existem diversas formas de colaborar com o nosso trabalho voluntário. Escolha aquela que mais combina com você!",
    cards: [
      {
        id: "doacoes",
        title: "Doações",
        description:
          "O Coque Connecta é uma organização sem fins lucrativos que atua diretamente com a juventude e moradores do bairro do Coque em Recife – PE. Nosso trabalho só é possível graças ao apoio de pessoas que acreditam em um futuro mais justo, inclusivo e conectado para todos.",
        image: "/pessoa-segurando-caixa.jpg",
        tags: ["Mensal", "Internacional"],
        variant: "light",
        blockquote: {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          authorName: "Maria Silva",
        },
      },
      {
        id: "voluntariado",
        title: "Voluntariado",
        description:
          "O voluntariado é um pilar fundamental do Coque Connecta. Aqui, pessoas de diferentes trajetórias se unem em torno de uma missão: fortalecer o protagonismo dos moradores do Coque e mobilizar o território a partir da educação, cultura e participação cidadã.",
        image: "/pessoa-recebendo-doacao.jpg",
        tags: ["Base", "Pontual"],
        variant: "dark",
        blockquote: {
          text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          authorName: "João Santos",
        },
      },
      {
        id: "voluntariado-corporativo",
        title: "Voluntariado Corporativo",
        description:
          "O Coque Connecta acredita que mudanças profundas acontecem quando diferentes setores da sociedade se unem em torno de um propósito comum. Por isso, desenvolvemos parcerias com empresas comprometidas com responsabilidade social e desenvolvimento territorial!",
        image: "/dando-maos-com-luvas.jpg",
        tags: ["Patrocínio", "Campanhas"],
        variant: "light",
        blockquote: {
          text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
          authorName: "Ana Oliveira",
        },
      },
    ],
  },
  stats: {
    items: [
      {
        value: "+2.000",
        label: "Jovens impactados",
      },
      {
        value: "+1.000",
        label: "Famílias impactadas",
      },
      {
        value: "+5",
        label: "Projetos financiados",
      },
      {
        value: "+5",
        label: "Territórios transformados",
      },
    ],
  },
  help: {
    headline: "Quer ajudar?",
    description:
      "A Coque Connecta depende de apoio de pessoas como você para continuar transformando vidas. Existem várias formas de contribuir para o nosso movimento.",
    ctaText: "Entre em contato",
    ctaLink: "#contact",
    highlightedText: "Juntos somos mais fortes!",
  },
  newsletter: {
    headline: "Inscreva-se na Newslatter:",
    headlineAccent: "Coque Connecta!",
    description: "Junte-se à nossa comunidade! Assinando nossa newsletter, você fica por dentro de todas as novidades e eventos.",
    placeholderEmail: "E-mail",
    buttonText: "RECEBER",
  },
  footer: {
    copyright: "© 2025 Coque Connecta. Todos os direitos reservados.",
    address: "Av. Central, 1847 - São José, Recife - PE, 50090-700",
    phone: "+55 8798238988",
    email: "contato@coqueconnecta.com.br",
    socialLinks: [
      {
        platform: "instagram",
        url: "https://instagram.com/coqueconnecta",
        icon: "instagram",
      },
      {
        platform: "linkedin",
        url: "https://linkedin.com/company/coque-connecta",
        icon: "linkedin",
      },
    ],
    quickLinks: [
      { label: "Sobre nós", href: "/#about" },
      { label: "Como ajudar", href: "/como-ajudar" },
      { label: "Como doar", href: "https://benfeitoria.com/projeto/coqueconnecta" },
      { label: "Transparência", href: "/transparencia" },
    ],
  },
};

// ENGLISH - EN-US
export const mockDataEN: LandingPageData = {
  hero: {
    headline: "Connecting People,\nMultiplying Horizons.",
    subheadline:
      "An opportunity to work with a tangible, short-term tool with triple impact — creating value for your company, the community, and your employees.",
    ctaText: "Join Us",
    backgroundImage: "/assets/banner.jpg",
  },
  about: {
    description:
      "Coque Connecta is a social organization founded in 2018 in the heart of the Coque community, in Recife, Brazil. It began with a powerful idea born from the connection between two local leaders—a young dreamer and his mother—who believed that education could rewrite destinies and transform realities.",
  },
  waysToHelp: {
    headline: "How to Help",
    subtitle: "There are many ways to collaborate with our volunteer work. Choose the one that suits you best!",
    cards: [
      {
        id: "donations",
        title: "Donations",
        description:
          "Coque Connecta is a non-profit organization that works directly with youth and residents of the Coque neighborhood in Recife – PE. Our work is only possible thanks to the support of people who believe in a fairer, more inclusive and connected future for all.",
        image: "/pessoa-segurando-caixa.jpg",
        tags: ["Monthly", "International"],
        variant: "light",
        blockquote: {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          authorName: "Maria Silva",
        },
      },
      {
        id: "volunteering",
        title: "Volunteering",
        description:
          "Volunteering is a fundamental pillar of Coque Connecta. Here, people from different backgrounds come together around a mission: to strengthen the protagonism of Coque residents and mobilize the territory through education, culture, and civic participation.",
        image: "/pessoa-recebendo-doacao.jpg",
        tags: ["Local", "One-time"],
        variant: "dark",
        blockquote: {
          text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          authorName: "João Santos",
        },
      },
      {
        id: "corporate-volunteering",
        title: "Corporate Volunteering",
        description:
          "Coque Connecta believes that profound change happens when different sectors of society unite around a common purpose. That's why we develop partnerships with companies committed to social responsibility and territorial development!",
        image: "/dando-maos-com-luvas.jpg",
        tags: ["Sponsorship", "Campaigns"],
        variant: "light",
        blockquote: {
          text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
          authorName: "Ana Oliveira",
        },
      },
    ],
  },
  stats: {
    items: [
      {
        value: "2000+",
        label: "People impacted",
      },
      {
        value: "6+",
        label: "Years in operation",
      },
      {
        value: "4",
        label: "Main programs",
      },
      {
        value: "100%",
        label: "Community impact",
      },
    ],
  },
  help: {
    headline: "Want to help?",
    description:
      "Coque Connecta depends on people like you to continue transforming lives. There are several ways to contribute to our movement.",
    ctaText: "Get in touch",
    ctaLink: "#contact",
    highlightedText: "Together we are stronger!",
  },
  newsletter: {
    headline: "Subscribe to the Newsletter:",
    headlineAccent: "Coque Connecta!",
    description: "Join our community! By subscribing to our newsletter, you stay up to date with all the news and events.",
    placeholderEmail: "E-mail",
    buttonText: "SUBSCRIBE",
  },
  footer: {
    copyright: "© 2025 Coque Connecta. All rights reserved.",
    address: "Av. Central, 1847 - São José, Recife - PE, 50090-700",
    phone: "+55 8798238988",
    email: "contact@coqueconnecta.com.br",
    socialLinks: [
      {
        platform: "instagram",
        url: "https://instagram.com/coqueconnecta",
        icon: "instagram",
      },
      {
        platform: "linkedin",
        url: "https://linkedin.com/company/coque-connecta",
        icon: "linkedin",
      },
    ],
    quickLinks: [
      { label: "About us", href: "/#about" },
      { label: "How to help", href: "/como-ajudar" },
      { label: "How to donate", href: "https://benfeitoria.com/projeto/coqueconnecta" },
      { label: "Transparency", href: "/transparencia" },
    ],
  },
};

// Função helper para obter dados baseado na linguagem
export const getMockData = (language: string = "pt"): LandingPageData => {
  return language.startsWith("en") ? mockDataEN : mockDataPT;
};
