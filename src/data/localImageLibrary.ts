export type LocalImageAsset = {
  id: string;
  url: string;
  name: string;
  title?: string;
  alt?: string;
  category: 'gallery' | 'brand' | 'background' | 'about' | 'placeholder';
};

export const localImageCategories = [
  { id: 'all', label: 'Todas' },
  { id: 'about', label: 'Quem Somos' },
  { id: 'gallery', label: 'Galeria' },
  { id: 'brand', label: 'Marca' },
  { id: 'background', label: 'Fundos' },
  { id: 'placeholder', label: 'Placeholder' },
] as const;

export const localImageLibrary: LocalImageAsset[] = [
  {
    id: 'gallery-box-donation',
    url: '/pessoa-segurando-caixa.jpg',
    name: 'pessoa-segurando-caixa.jpg',
    title: 'Pessoa segurando caixa de doações',
    alt: 'Pessoa segurando uma caixa com itens de doação.',
    category: 'gallery',
  },
  {
    id: 'gallery-receiving-donation',
    url: '/pessoa-recebendo-doacao.jpg',
    name: 'pessoa-recebendo-doacao.jpg',
    title: 'Pessoa recebendo doação',
    alt: 'Pessoa recebendo uma doação em atividade comunitária.',
    category: 'gallery',
  },
  {
    id: 'gallery-helping-hands',
    url: '/dando-maos-com-luvas.jpg',
    name: 'dando-maos-com-luvas.jpg',
    title: 'Mãos com luvas em colaboração',
    alt: 'Duas pessoas unindo as mãos com luvas em ação colaborativa.',
    category: 'gallery',
  },
  {
    id: 'background-orange-texture',
    url: '/background-coque-laranja.png',
    name: 'background-coque-laranja.png',
    title: 'Textura laranja da marca',
    alt: 'Textura gráfica laranja utilizada como fundo institucional.',
    category: 'background',
  },
  {
    id: 'brand-logotype',
    url: '/coque-logotipo.svg',
    name: 'coque-logotipo.svg',
    title: 'Logotipo Coque Connecta',
    alt: 'Logotipo institucional da Coque Connecta.',
    category: 'brand',
  },
  {
    id: 'brand-logotype-light',
    url: '/coque-logotipo-light.svg',
    name: 'coque-logotipo-light.svg',
    title: 'Logotipo claro Coque Connecta',
    alt: 'Versão clara do logotipo institucional da Coque Connecta.',
    category: 'brand',
  },
  {
    id: 'about-women-sewing',
    url: '/mulheres-costurando.jpg',
    name: 'mulheres-costurando.jpg',
    title: 'Mulheres costurando em atividade coletiva',
    alt: 'Mulheres participando de atividade de costura em grupo.',
    category: 'about',
  },
  {
    id: 'about-women-cutting-fabric',
    url: '/mulheres-recortando-tecido.jpg',
    name: 'mulheres-recortando-tecido.jpg',
    title: 'Mulheres recortando tecido',
    alt: 'Mulheres trabalhando no recorte de tecidos em oficina.',
    category: 'about',
  },
  {
    id: 'about-woman-teaching-student',
    url: '/mulher-ensinando-estudante.jpg',
    name: 'mulher-ensinando-estudante.jpg',
    title: 'Mulher ensinando estudante',
    alt: 'Educadora orientando estudante durante atividade formativa.',
    category: 'about',
  },
  {
    id: 'about-women-studying',
    url: '/mulheres-estudando.jpg',
    name: 'mulheres-estudando.jpg',
    title: 'Mulheres estudando em sala',
    alt: 'Mulheres estudando juntas em ambiente educacional.',
    category: 'about',
  },
  {
    id: 'about-child-washing-hands',
    url: '/crianca-lavando-as-maos.jpg',
    name: 'crianca-lavando-as-maos.jpg',
    title: 'Criança lavando as mãos',
    alt: 'Criança lavando as mãos em ação de cuidado e higiene.',
    category: 'about',
  },
  {
    id: 'about-youth-auditorium',
    url: '/jovens-no-auditorio.jpg',
    name: 'jovens-no-auditorio.jpg',
    title: 'Jovens no auditório',
    alt: 'Jovens reunidos em auditório durante atividade da organização.',
    category: 'about',
  },
  {
    id: 'placeholder-image',
    url: '/placeholder-image.png',
    name: 'placeholder-image.png',
    title: 'Imagem placeholder',
    alt: 'Imagem placeholder',
    category: 'placeholder',
  },
];
