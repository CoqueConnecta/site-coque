---
target: src/components/sections/HeroSection/index.ts
total_score: 31
p0_count: 0
p1_count: 1
timestamp: 2026-06-18T22-30-37Z
slug: src-components-sections-herosection-index-ts
---
### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Gradient animation + `animate-hero-in` sinalizam "vivo"; canvas lazy sem fallback visível |
| 2 | Match System / Real World | 3 | Headline humana; subheadline usa linguagem levemente corporativa |
| 3 | User Control and Freedom | 3 | Flow linear, CTA → newsletter; sem traps |
| 4 | Consistency and Standards | 2 | `#fef7ee` sobre `#ff6a1a` = 2.61:1 — abaixo do 3:1 WCAG para texto grande |
| 5 | Error Prevention | 4 | Seção read-only |
| 6 | Recognition Rather Than Recall | 3 | CTA visível, hierarquia clara |
| 7 | Flexibility and Efficiency of Use | 3 | N/A |
| 8 | Aesthetic and Minimalist Design | 3 | Limpo; justify-end deixa 60% do hero sem conteúdo |
| 9 | Error Recovery | 4 | N/A |
| 10 | Help and Documentation | 3 | Auto-explicativo |
| **Total** | | **31/40** | **Good** |

### Anti-Patterns Verdict

Detector retornou []. Sem anti-patterns estruturais. LLM: hero passa no slop test. ShaderGradient WebGL na família laranja é uma escolha genuína. Problema principal é contraste matemático e composição bottom-heavy.

### Priority Issues

**[P1] Contraste 2.61:1 (headline) / 2.36:1 (subheadline opacity-90)** — abaixo de 3:1/4.5:1 WCAG AA. Fix: textShadow no h1 + remover opacity-90 do sub, ou vignette escuro na base da section.

**[P2] justify-end em min-h-720px** — conteúdo nos últimos 200px; 65% do hero é gradiente puro sem âncora. Fix: justify-center com pt compensando header, ou min-h reduzido.

**[P2] Nenhum scroll indicator** — hero termina em corte branco sem sinalizar conteúdo abaixo. Fix: ChevronDown animado absolute bottom-6.

**[P3] href="#contact" hardcoded** — ignora data.ctaHref do CMS. Fix: href={data.ctaHref ?? '#contact'}.

### Persona Red Flags

**Jordan**: Sem scroll indicator, vai do hero ao formulário sem ler About/Stats/Gallery.
**Sam (a11y)**: Contraste vai quebrar auditoria axe-core/Lighthouse. Reduced-motion está correto.

### Minor Observations

- whitespace-pre-line no h1 é redundante com o split manual de \n.
- HeroCanvas comentários descrevem o quê, não o porquê dos valores específicos.
- ShaderGradientCanvas não tem aria-hidden verificado.
