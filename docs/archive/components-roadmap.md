# Site Coque Connecta 2.0

## Roadmap 2.0 (Refatoracao Grande)

Este documento substitui o plano anterior com base nas decisoes atuais do projeto:

- Fidelidade visual alta ao Framer no desktop.
- Mobile tratado como correcao de produto (nao copiar os bugs do prototipo).
- Storybook com conteudo mockado na primeira fase.
- Integracao com i18n e Firebase apenas depois da UI estabilizada.
- Estrutura pragmatica de componentes: `ui`, `sections`, `layouts`.
- Escopo inicial apenas para landing page publica.

---

## 1) Decisoes de Arquitetura

### Stack de estilos

**Decisao:** usar Tailwind CSS v4 como base principal + CSS Modules para casos pontuais de layout/efeito complexo.

**Por que essa combinacao:**

- Mantem velocidade e consistencia para compor UI no dia a dia.
- Evita CSS global espalhado.
- Permite isolar regras de superficie mais complexas (pattern da newsletter, overlays, gradientes decorativos, ajustes finos de carrossel).
- Funciona muito bem com Storybook e com componente reutilizavel.

### Estrategia de conteudo

- Fase inicial: dados e textos mockados (sem dependencia de backend).
- I18n entra depois da arquitetura visual estar consolidada.

### Estrategia de rotas e links

- Landing page em pagina unica com ancoras (`#about`, `#our-work`, etc.).
- `DOE AGORA` e `FACA PARTE` como placeholder por enquanto.

---

## 2) Estrutura de Pastas Sugerida

```txt
src/
  app/
    providers/
    router/

  features/
    landing/
      data/
        mock.ts
      sections/
        HeroSection/
        AboutSection/
        GallerySection/
        StatsSection/
        HelpSection/
        NewsletterSection/
        FooterSection/
      layouts/
        PublicLandingLayout/
      page/
        LandingPage.tsx

  components/
    ui/
      Button/
      Typography/
      Input/
      Tag/
      Logo/
      IconButton/
      SectionContainer/
      Surface/
    composites/
      HeaderBar/
      NavMenu/
      MobileMenuOverlay/
      StatItem/
      HelpCard/
      NewsletterForm/
      SocialLinks/
      FooterNavGroup/

  styles/
    tokens.css
    utilities.css
```

---

## 3) Design Tokens (Obrigatorio Antes dos Componentes)

Definir tokens no inicio evita retrabalho de estilo.

### Tipografia

- Primaria: `DM Sans` (texto geral).
- Secundaria: `Lato` (secoes de apoio, quando fizer sentido).
- Display: `Kirang Haerang` (destaque no hero, como no prototipo).

### Cores

- Escala de laranja principal (hero, cards, newsletter).
- Tons neutros de cinza para fundo e textos.
- Tons escuros para tags/badges.
- Branco e quase-branco para contraste.

### Outros tokens

- Raios grandes de borda (cards e containers arredondados).
- Espacamento vertical das secoes.
- Escala de sombra (apenas onde necessario).
- Breakpoints mobile/tablet/desktop.

---

## 4) Mapa de Componentes (Pragmatico)

## 4.1 UI (base reutilizavel)

1. `Button`
2. `Typography`
3. `Input`
4. `Tag`
5. `Logo`
6. `IconButton`
7. `SectionContainer`
8. `Surface`

## 4.2 Composites

1. `HeaderBar` (logo em bloco + CTA + botao menu mobile)
2. `NavMenu`
3. `MobileMenuOverlay`
4. `StatItem`
5. `HelpCard`
6. `NewsletterForm`
7. `SocialLinks`
8. `FooterNavGroup`

## 4.3 Sections (landing)

1. `HeroSection`
2. `AboutSection`
3. `GallerySection`
4. `StatsSection`
5. `HelpSection`
6. `NewsletterSection`
7. `FooterSection`

## 4.4 Layout

1. `PublicLandingLayout`

---

## 5) Escopo Funcional da Landing (V1)

### Header

- Navegacao por ancora.
- `DOE AGORA` como placeholder.
- Mobile com overlay dedicado e comportamento previsivel.

### Hero

- Fundo com linguagem visual do Framer (gradiente/superficie).
- Titulo e subtitulo com hierarquia tipografica fiel ao desktop.
- CTA `FACA PARTE` como placeholder.

### About

- Bloco de texto institucional corrido.
- Ancora principal de entrada (`#about`).

### Gallery

- Desktop: mosaico horizontal com imagens reais do prototipo.
- Mobile: carrossel funcional e legivel (corrigido, nao bugado).

### Stats

- Quatro indicadores principais com destaque numerico.

### Help

- Secao com titulo e descricao.
- Cards: `Doacoes`, `Voluntariado`, `Voluntariado Corporativo`.
- Tags visuais em cada card.

### Newsletter

- UI completa com padrao grafico de fundo.
- Campo e botao sem persistencia nesta fase.

### Footer

- Logo, redes, endereco, e-mail, telefone.
- Grupos de links.
- Linha e copyright.

---

## 6) Plano de Execucao por Fases

### Fase 0 - Preparacao e auditoria visual (1 dia)

- Consolidar assets reais do prototipo (logos, imagens, icones).
- Fechar mapa de secoes e ancoras finais.
- Definir o que e fidelidade obrigatoria no desktop.

**Criterio de aceite:** checklist de tokens e assets aprovado.

### Fase 1 - Infra + Storybook + Fundacao de estilo (1-2 dias)

- Instalar e configurar Storybook.
- Instalar `clsx` e `tailwind-merge`.
- Opcional: `class-variance-authority` para variantes de componentes.
- Importar fontes com fidelidade alta.
- Criar tokens globais.

**Criterio de aceite:** Storybook rodando com tema base e tipografia correta.

### Fase 2 - Componentes UI + stories (2-3 dias)

- Criar `Button`, `Typography`, `Input`, `Tag`, `Logo`, `IconButton`, `SectionContainer`, `Surface`.
- Criar stories com estados principais (default/hover/focus/disabled).

**Criterio de aceite:** biblioteca UI reutilizavel e testada visualmente.

### Fase 3 - Composites + sections (4-6 dias)

- Montar `HeaderBar`, `NavMenu`, `MobileMenuOverlay`, `StatItem`, `HelpCard`, `NewsletterForm`, `SocialLinks`, `FooterNavGroup`.
- Montar secoes da landing com dados mockados.

**Criterio de aceite:** landing completa em desktop com fidelidade alta.

### Fase 4 - Ajuste mobile como correcao de produto (2-3 dias)

- Reprojetar comportamento mobile mantendo identidade visual.
- Corrigir legibilidade, espacamentos, fluxo de leitura e navegação.
- Garantir menu mobile consistente.

**Criterio de aceite:** mobile funcional, sem sobreposicoes quebradas.

### Fase 5 - Polimento e qualidade (1-2 dias)

- Ajustes finos de animacao (se necessario e sem exagero).
- Acessibilidade (foco, contraste, semantica, labels).
- Revisao final de desempenho e regressao visual.

**Criterio de aceite:** versao pronta para validacao final.

### Fase 6 - Pos-V1 (quando decidir)

- Integracao com i18n.
- Integracao real de newsletter/Firebase.
- Evolucao para paginas internas (se necessario).

---

## 7) Regras de Implementacao para Evitar Retrabalho

1. Nao iniciar i18n antes da UI base consolidada.
2. Nao copiar bugs de mobile do Framer; usar desktop como verdade visual.
3. Nao criar CSS global novo sem justificativa.
4. Toda section nova deve ter story de validacao (ao menos estado base).
5. Links placeholder devem estar explicitos no codigo para troca futura simples.

---

## 8) Proximo Passo Pratico

Iniciar por **Fase 0 + Fase 1** imediatamente:

1. Storybook e dependencias de composicao de classes.
2. Tokens (cores, fontes, espacamentos, raios).
3. Primeiro bloco UI (`Button`, `Typography`, `Input`) com stories.

Com isso pronto, o restante da landing passa a ser montagem previsivel.

---

## 9) Controle de Contexto da Refatoracao

- O arquivo components-roadmap.md deve permanecer como guia estrategico (fases, escopo e criterios).
- O acompanhamento operacional continuo deve ser feito em refactor-context.md.
- Ao final de cada bloco relevante, atualizar o refactor-context.md com:
  - O que foi entregue
  - Decisoes tomadas
  - Pendencias imediatas
  - Riscos e observacoes