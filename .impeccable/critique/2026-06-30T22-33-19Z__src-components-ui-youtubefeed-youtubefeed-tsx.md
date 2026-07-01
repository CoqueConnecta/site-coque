---
target: VideosSection
total_score: 22
p0_count: 0
p1_count: 2
timestamp: 2026-06-30T22-33-19Z
slug: src-components-ui-youtubefeed-youtubefeed-tsx
---
## Design Health Score

| # | Heurística | Score | Issue principal |
|---|---|---|---|
| 1 | Visibility of System Status | 2 | Sem estado de carregamento; overlay sempre bg-black/20 |
| 2 | Match System / Real World | 3 | Play icon universal; thumbnail-como-preview padrão |
| 3 | User Control and Freedom | 3 | Modal com ESC e fechar OK |
| 4 | Consistency and Standards | 3 | Grid orphan quebra ritmo |
| 5 | Error Prevention | 1 | maxresdefault retorna preto para vídeos recentes; sem fallback |
| 6 | Recognition Rather Than Recall | 2 | Sem títulos; conteúdo só pela thumbnail |
| 7 | Flexibility and Efficiency | 1 | div onClick — Tab pula todos os cards |
| 8 | Aesthetic and Minimalist Design | 3 | Limpo; orphan é única ruptura |
| 9 | Error Recovery | 1 | Thumbnail falha silenciosamente; sem onError |
| 10 | Help and Documentation | 3 | N/A; affordances claros |
| **Total** | | **22/40** | **Acceptable** |

## Priority Issues

P1: Grid orphan — 3º vídeo sozinho em meia-largura; fix: lg:grid-cols-3 + col-span-full condicional
P1: div onClick inacessível — Tab pula todos os cards; fix: substituir por <button aria-label>
P2: Sem títulos — reconhecimento depende 100% de thumbnail; fix: <p> com video.title + line-clamp-2
P2: maxresdefault sem fallback — retorna preto para vídeos recentes; fix: onError fallback para hqdefault
P3: Sem loading=lazy nas thumbnails
