/**
 * Mock data consolidado para sections da landing page - Fase 4
 * Este arquivo centraliza todo conteúdo mockado para facilitar manutenção e internacionalização futura
 */

export interface HeroData {
  headline: string;
  subheadline: string;
  ctaText: string;
  backgroundImage?: string;
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

export interface GalleryData {
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
  headline: string;
  description: string;
  subheadline: string;
  subdescription: string;
  mission: {
    title: string;
    description: string;
  };
  vision: {
    title: string;
    description: string;
  };
  values: {
    title: string;
    items: Array<{
      id: string;
      label: string;
      description: string;
    }>;
  };
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
  gallery: GalleryData;
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
    headline: "Quem Somos",
    description:
      "Tudo começou com uma ideia potente, nascida do encontro entre dois líderes locais, um jovem sonhador e sua mãe, que acreditavam que a educação podia reescrever destinos e transformar realidades. Marcone Ribeiro e Dona Danda, inspirados por suas próprias vivências, transformaram visão em ação, criando um espaço onde juventudes periféricas e suas famílias pudessem se enxergar, reconhecer seu valor e construir novos caminhos. Desde então, a Coque Connecta tornou-se um movimento coletivo de transformação, um espaço vivo feito de escuta, cuidado e formação cidadã.",
    subheadline: "Somos a ponte que conecta para um futuro melhor!",
    subdescription:
      "Ao longo dos anos, mais de 2.000 pessoas foram impactadas pelos nossos programas educacionais, construindo uma rede de fortalecimento comunitário. Nosso trabalho já foi reconhecido por diferentes instituições e premiações.",
    mission: {
      title: "Missão",
      description:
        "Transformar a realidade de comunidades periféricas através de oportunidades educacionais que promovam o autoconhecimento, a capacitação profissional e o desenvolvimento local.",
    },
    vision: {
      title: "Visão",
      description:
        "Transformar o Coque Connecta em um hub de inovação periférica, sendo referência de educação (inter)nacional.",
    },
    values: {
      title: "Valores",
      items: [
        {
          id: "respect",
          label: "Respeito",
          description: "Valorizamos a diversidade e a dignidade de todas as pessoas.",
        },
        {
          id: "community",
          label: "Comunidade",
          description: "Acreditamos na força do coletivo para transformar realidades.",
        },
        {
          id: "belonging",
          label: "Pertencimento",
          description: "Criamos espaços onde cada indivíduo se sente valorizado e parte essencial da mudança.",
        },
        {
          id: "commitment",
          label: "Compromisso Social",
          description:
            "Atuamos para enfrentar desigualdades e fortalecer as potências das periferias com justiça e equidade.",
        },
        {
          id: "responsibility",
          label: "Responsabilidade",
          description:
            "Nos guiamos por uma ética de cuidado, transparência e corresponsabilidade em tudo o que fazemos.",
        },
      ],
    },
  },
  gallery: {
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
    headline: "Fique por dentro",
    description: "Receba nossas atualizações, histórias de impacto e oportunidades para participar.",
    placeholderEmail: "seu@email.com",
    buttonText: "Inscrever",
  },
  footer: {
    copyright: "© 2024 Coque Connecta. Todos os direitos reservados.",
    address: "Av. Central, 1847 - São José, Recife - PE, 50090-700",
    phone: "(81) 3222-1234",
    email: "contato@coqueconnecta.org",
    socialLinks: [
      {
        platform: "instagram",
        url: "https://instagram.com/coqueconnecta",
        icon: "instagram",
      },
      {
        platform: "facebook",
        url: "https://facebook.com/coqueconnecta",
        icon: "facebook",
      },
      {
        platform: "linkedin",
        url: "https://linkedin.com/company/coqueconnecta",
        icon: "linkedin",
      },
    ],
    quickLinks: [
      { label: "Sobre nós", href: "#about" },
      { label: "Projetos", href: "#projects" },
      { label: "Contato", href: "#contact" },
      { label: "Blog", href: "/blog" },
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
    headline: "Who We Are",
    description:
      "Coque Connecta is a social organization founded in 2018 in the heart of the Coque community, in Recife, Brazil. It began with a powerful idea born from the connection between two local leaders—a young dreamer and his mother—who believed that education could rewrite destinies and transform realities.",
    subheadline: "We are the bridge that connects people to a brighter future.",
    subdescription:
      "Over the years, more than 2,000 people have been impacted by our educational programs, building a vibrant network of community-strengthening initiatives. Our work has been recognized by multiple institutions and awards.",
    mission: {
      title: "Mission",
      description:
        "To transform the reality of marginalized communities through educational opportunities that foster self-awareness, civic engagement, professional training, and local development.",
    },
    vision: {
      title: "Vision",
      description:
        "To make Coque Connecta a hub for social innovation in the peripheries, a (inter)national reference in transformative education.",
    },
    values: {
      title: "Values",
      items: [
        {
          id: "respect",
          label: "Respect",
          description: "We value the dignity, identity, and diversity of every person and their journey.",
        },
        {
          id: "community",
          label: "Community",
          description: "We believe in the strength of collective action, listening, and collaboration to drive social change.",
        },
        {
          id: "belonging",
          label: "Belonging",
          description: "We cultivate spaces where everyone feels seen, welcomed, and essential to the process of transformation.",
        },
        {
          id: "commitment",
          label: "Social Commitment",
          description: "We work to reduce inequalities and amplify the power of peripheral communities with fairness and justice.",
        },
        {
          id: "responsibility",
          label: "Responsibility",
          description: "We act with care, transparency, and shared accountability in everything we do.",
        },
      ],
    },
  },
  gallery: {
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
    headline: "Stay Updated",
    description: "Receive our updates, impact stories, and opportunities to participate.",
    placeholderEmail: "your@email.com",
    buttonText: "Subscribe",
  },
  footer: {
    copyright: "© 2024 Coque Connecta. All rights reserved.",
    address: "Av. Central, 1847 - São José, Recife - PE, 50090-700",
    phone: "(81) 3222-1234",
    email: "contact@coqueconnecta.org",
    socialLinks: [
      {
        platform: "instagram",
        url: "https://instagram.com/coqueconnecta",
        icon: "instagram",
      },
      {
        platform: "facebook",
        url: "https://facebook.com/coqueconnecta",
        icon: "facebook",
      },
      {
        platform: "linkedin",
        url: "https://linkedin.com/company/coqueconnecta",
        icon: "linkedin",
      },
    ],
    quickLinks: [
      { label: "About us", href: "#about" },
      { label: "Projects", href: "#projects" },
      { label: "Contact", href: "#contact" },
      { label: "Blog", href: "/blog" },
    ],
  },
};

// Função helper para obter dados baseado na linguagem
export const getMockData = (language: string = "pt"): LandingPageData => {
  return language.startsWith("en") ? mockDataEN : mockDataPT;
};
