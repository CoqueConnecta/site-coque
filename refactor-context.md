# Refactor Context - Coque Connecta 2.0

Este arquivo registra o contexto vivo da grande refatoracao para evitar perda de informacao entre sessoes.

## Como usar

- Atualizar este arquivo ao fim de cada fase ou bloco relevante.
- Registrar decisoes tecnicas, o que foi concluido e o que falta.
- Manter o roadmap em components-roadmap.md como referencia estrategica.
- Usar este arquivo como diario operacional (estado atual + proximos passos).

## Estado Atual

### Objetivo

Refatorar completamente a landing publica para alta fidelidade desktop ao prototipo Framer, com mobile corrigido como produto.

### Regras-chave

- Storybook com conteudo mockado nesta etapa inicial.
- i18n e Firebase entram apenas no pos-V1.
- Estrutura pragmatica: ui, composites, sections, layouts.

## Progresso por Fase

### Fase 1 - Infra + Storybook + Fundacao de estilo

Status: concluida

Entregas:

- Storybook inicializado e simplificado para foco visual.
- Dependencias de composicao de classes instaladas.
- Tokens e utilitarios globais criados.
- Build e lint validados.

### Fase 2 - UI base

Status: concluida

Entregas:

- Button criado com variantes e stories.
- Typography criada com variantes e stories.
- Input criado com estados e stories.
- Tag criada com variantes e stories.
- Logo criado com variante default/monochrome e stories.
- IconButton criado com tamanhos/variantes e stories.
- SectionContainer criado com controle de largura/espacamento e stories.
- Surface criado com variantes visuais base e stories.
- Warning de CSS import order no Storybook dev resolvido ao mover import de fontes para o topo de src/index.css.

### Fase 3 - Componentes Compostos

Status: concluida

Entregas:

- NavMenu: Componente de navegacao com links, estado ativo e callback de clique.
- HeaderBar: Componente sticky com logo, navegacao desktop, CTA button, e toggle mobile menu.
- MobileMenuOverlay: Overlay full-screen mobile com nav links, CTA button, e secao opcional de newsletter.
- Todas as stories criadas com casos de uso (Default, WithActive, Interactive, FullDemo).
- Validacoes: npm run lint ✅, npm run build ✅ (107 modules), npm run build-storybook ✅ (203 modules).

## Decisoes Recentes

- Manter assets do prototipo dentro da pasta framer-coque durante implementacao inicial.
- Evitar reaproveitar HTML exportado do Framer como base estrutural de codigo.
- Usar o prototipo como referencia visual e semantica.
- Imports com caminhos relativos em lugar de aliases @ para melhor compatibilidade com tsc.
- HeaderBar usa `<a>` diretamente em lugar de Button componente (Button nao suporta `as` prop).
- IconButton com prop `icon` (ReactNode) em lugar de children para consistencia com design.

## Backlog Imediato

1. Definir mock consolidado da landing (textos, links placeholder e imagens) para composicao das sections.
2. Iniciar Fase 4 com sections: HeroSection, AboutSection, GallerySection, StatsSection, HelpSection, NewsletterSection, FooterSection.
3. Integrar HeaderBar + MobileMenuOverlay em Site.tsx.

## Riscos/Atencoes

- Diferencas entre fontes reais do Framer e fallback no navegador podem gerar pequenas variacoes de layout.
- Mobile sera refeito com criterio de produto; nao copiar bugs do prototipo.
