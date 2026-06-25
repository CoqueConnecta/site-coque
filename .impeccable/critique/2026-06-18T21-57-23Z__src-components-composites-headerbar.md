---
target: src/components/composites/HeaderBar
total_score: 31
p0_count: 0
p1_count: 2
timestamp: 2026-06-18T21-57-23Z
slug: src-components-composites-headerbar
---
### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Active link state presente; mobile menu toggle correto |
| 2 | Match System / Real World | 4 | Labels em PT claro, CTA imperativo, sem jargão |
| 3 | User Control and Freedom | 3 | Mobile menu tem fechar; nav permite retorno a qualquer seção |
| 4 | Consistency and Standards | 3 | Pill flutuante coerente; variante dark não usada |
| 5 | Error Prevention | 4 | Nav passiva — nenhum erro possível |
| 6 | Recognition Rather Than Recall | 3 | Desktop: todos os links visíveis; mobile: hamburger |
| 7 | Flexibility and Efficiency | 2 | Site público; sem keyboard shortcuts necessários |
| 8 | Aesthetic and Minimalist Design | 1 | Ghost-card + glassmorphism decorativo + 2 falhas de contraste |
| 9 | Error Recovery | 4 | Nav não tem estados de erro |
| 10 | Help and Documentation | 4 | Nav provê boa orientação |
| **Total** | | **31/40** | **Good — P1s críticos bloqueiam o ship** |

### Anti-Patterns Verdict

**LLM:** Pill flutuante é genuíno e brand-specific. O problema não é a forma, é a execução: todo o sistema de cor usa #f58634 (laranja) tanto para fundo da pill quanto para texto, gerando contraste ~1.73:1.

**Detector:** detect.mjs: exit 0, sem findings estáticos. Problemas requerem valores computados do DOM.

**Browser:** Nav links rgb(245,134,52) sobre rgba(244,212,194,0.94) → 1.73:1. CTA text rgb(254,247,238) sobre rgb(245,134,52) → 2.25:1. Border + shadow confirmados no mesmo elemento.

### Priority Issues

**[P1] Nav links contraste 1.73:1** — #f58634 sobre peach pill bg; mínimo WCAG AA: 4.5:1. Fix: mudar para #411409 (10.5:1 ✓). Afeta logo e todos os links.

**[P1] CTA text contraste 2.25:1** — #fef7ee sobre #f58634; falha mesmo para large text (3:1). Fix: mudar text do CTA para #411409 (6:1 ✓).

**[P2] Ghost-card** — border-white/15 + shadow 24px blur no mesmo elemento. Fix: remover border, manter shadow.

**[P2] Glassmorphism 0.94** — blur decorativo com 94% opacity, efeito praticamente invisível. Fix: tornar sólido (bg-[#f4d4c2]) ou reduzir opacity para 0.75.

**[P3] CTA target="_blank" sem indicador** — abre benfeitoria.com sem ícone de external link.

### What's Working
1. Pill flutuante é incomum e brand-specific — não é template.
2. Hierarquia visual clara: logo → nav → CTA.
3. Mobile acessível: aria-label correto, toggle funcional.

### Persona Red Flags
**Jordan (primeira visita):** Logo quase invisível (1.73:1), confiança destruída na primeira tela.
**Casey (mobile, sol):** Nav links ilegíveis em ambient light externo; depende do hamburger overlay no mobile onde o problema não existe.
**Doador Corporativo:** Contraste detectável visualmente; passa impressão de descuido em apresentações internas.
