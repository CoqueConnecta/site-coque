# Plano de Migracao para CMS v2 (Firebase + Admin)

Data: 12/04/2026  
Projeto: site-coque  
Objetivo: migrar o conteudo da landing para Realtime Database em `cms/v2`, manter `locales` como legado, habilitar edicao via `/admin` e suportar troca de idioma PT/EN no front.

## Decisoes ja alinhadas

- Manter `locales` somente por compatibilidade legada.
- Oficializar `cms/v2` como fonte de verdade do novo CMS.
- Admin deve editar PT e EN lado a lado (mesma tela).
- YouTube deve salvar somente `videoId`; thumbnail sera derivada automaticamente.
- Persistir idioma no `localStorage`.
- Midias ficam em `public` nesta etapa (sem upload no admin por enquanto).
- Privacy e Transparency entram no CMS ja na primeira entrega.
- Textos de sucesso/erro da newsletter ficam fora do CMS nesta fase (mantidos no projeto).
- Header seguira modelo CMS + fallback para links criticos.
- Formato atual de `admins` no RTDB e array de objetos `{ email, isAdmin }`.

## Arquitetura alvo

### Fonte de dados

- Novo caminho principal no RTDB:
  - `cms/v2/landing/pt`
  - `cms/v2/landing/en`

- Nó global (campos compartilhados entre idiomas):
  - `cms/v2/landing/global`
  - primeira seção global adotada: `aboutMedia`

- Caminho legado preservado sem escrita nova:
  - `locales/*`

### Regra de leitura no front

1. Tentar ler `cms/v2/landing/{lang}`.
2. Validar estrutura minima esperada.
3. Se faltar dados ou ocorrer erro, cair para mock local.
4. Registrar warning em console no fallback.

### Regra de escrita no admin

- Ler e salvar somente em `cms/v2/landing`.
- Edicao em paralelo PT/EN por secao.
- Validacoes de URL e campos obrigatorios antes de salvar.

## Modelo de dados proposto (v2)

```json
{
  "cms": {
    "v2": {
      "landing": {
        "pt": {
          "nav": {
            "links": [
              { "id": "inicio", "label": "Início", "href": "/#hero" },
              { "id": "about", "label": "Quem Somos", "href": "/#about" },
              { "id": "our-work", "label": "Nossos Projetos", "href": "/#our-work" },
              { "id": "contact", "label": "Faça Parte", "href": "/#contact" }
            ],
            "cta": { "label": "DOE AGORA", "href": "https://benfeitoria.com/projeto/coqueconnecta" }
          },
          "hero": {
            "headline": "Conectando Pessoas,\nMultiplicando Horizontes.",
            "subheadline": "...",
            "ctaText": "Faça Parte"
          },
          "about": {
            "headline": "Quem Somos",
            "description": "...",
            "subheadline": "...",
            "subdescription": "...",
            "mission": { "title": "Missão", "description": "..." },
            "vision": { "title": "Visão", "description": "..." },
            "values": {
              "title": "Valores",
              "items": [
                { "id": "respect", "label": "Respeito", "description": "..." }
              ]
            }
          },
          "aboutMedia": {
            "tickerImages": [
              { "src": "/pessoa-segurando-caixa.jpg", "alt": "...", "title": "..." }
            ],
            "youtubeVideos": [
              { "id": "rwniUxBd5OI", "title": "Exemplo de vídeo 1" }
            ]
          },
          "gallery": {
            "headline": "Saiba como ajudar",
            "subtitle": "...",
            "cards": [
              {
                "id": "doacoes",
                "title": "Doações",
                "description": "...",
                "image": "/pessoa-segurando-caixa.jpg",
                "tags": ["Mensal", "Internacional"],
                "variant": "light",
                "blockquote": {
                  "text": "...",
                  "authorName": "...",
                  "authorAvatar": ""
                }
              }
            ]
          },
          "stats": {
            "items": [
              { "value": "+2.000", "label": "Jovens impactados" }
            ]
          },
          "newsletter": {
            "headline": "Inscreva-se na Newsletter:",
            "headlineAccent": "Coque Connecta!",
            "description": "...",
            "placeholderEmail": "E-mail",
            "buttonText": "RECEBER",
            "form": {
              "firstNamePlaceholder": "Nome",
              "lastNamePlaceholder": "Sobrenome",
              "roleOptions": [
                { "value": "volunteer", "label": "Sou Voluntário" },
                { "value": "donor", "label": "Sou Doador" },
                { "value": "company", "label": "Sou Empresa" },
                { "value": "community", "label": "Sou Comunidade" }
              ],
              "consentText": "Concordo em receber...",
              "privacyLabel": "Política de Privacidade",
              "successTitle": "✓ Inscrição confirmada!",
              "successBody": "Obrigado por se juntar à nossa comunidade.",
              "loadingText": "ENVIANDO..."
            }
          },
          "footer": {
            "copyright": "© 2025 Coque Connecta. Todos os direitos reservados.",
            "address": "...",
            "phone": "...",
            "email": "...",
            "socialLinks": [
              { "platform": "instagram", "url": "https://instagram.com/coqueconnecta", "icon": "instagram" },
              { "platform": "linkedin", "url": "https://linkedin.com/company/coque-connecta", "icon": "linkedin" }
            ],
            "quickLinks": [
              { "label": "Sobre nós", "href": "/#about" },
              { "label": "Nossos projetos", "href": "/#our-work" },
              { "label": "Como doar", "href": "https://benfeitoria.com/projeto/coqueconnecta" },
              { "label": "Transparência", "href": "/transparencia" }
            ]
          },
          "privacy": {
            "title": "Política de Privacidade",
            "updatedAt": "Abril de 2026",
            "sections": []
          },
          "transparency": {
            "title": "Transparência",
            "intro": "Em breve...",
            "body": []
          }
        },
        "en": {}
      }
    }
  }
}
```

## Fases de implementacao

## Fase 0 - Preparacao e congelamento

Objetivo: garantir base estavel antes da migracao.

- Validar branch de trabalho e estado limpo.
- Congelar alteracoes grandes de layout durante a migracao de dados.
- Definir backup/export do RTDB atual.

Entregavel:
- Snapshot de seguranca do banco e lista final de secoes alvo.

Criterio de aceite:
- Backup validado e recuperavel.

## Fase 1 - Contrato de dados e mapeamento

Objetivo: fechar o contrato entre UI e RTDB.

- Mapear cada campo consumido hoje no front para `cms/v2`.
- Criar tipos TS para `LandingCmsV2` por idioma.
- Definir obrigatoriedade de campos por secao.

Entregavel:
- Arquivo de tipos + tabela de mapeamento old -> new.

Criterio de aceite:
- Todo campo exibido no front possui chave correspondente no contrato v2.

## Fase 2 - Loader de conteudo no front (read-only)

Objetivo: front ler dados do Firebase com fallback.

- Criar service `cmsService` para leitura de `cms/v2/landing/{lang}`.
- Validar payload e completar faltantes com mock.
- Substituir uso direto de `mockDataPT` por estado carregado no layout/home.

Entregavel:
- Landing renderizando via Firebase quando houver dados.

Criterio de aceite:
- Com `cms/v2` vazio, app funciona via fallback.
- Com `cms/v2` populado, app renderiza dados remotos.

## Fase 3 - Toggle de idioma (PT/EN)

Objetivo: permitir troca de idioma real em runtime.

- Implementar `LanguageToggle` visivel no header.
- Persistir idioma em `localStorage`.
- Carregar `cms/v2/landing/{lang}` conforme idioma ativo.

Entregavel:
- Troca PT/EN funcional no front sem refresh obrigatório.

Criterio de aceite:
- Idioma permanece apos recarregar a pagina.
- Header, secoes e footer trocam o conteudo.

## Fase 4 - Admin v2 (edicao lado a lado)

Objetivo: editar `cms/v2` no `/admin` mantendo UX lado a lado.

- Migrar painel para ler/escrever `cms/v2/landing`.
- Abas por secao: nav, hero, about, aboutMedia, gallery, stats, newsletter, footer, privacy, transparency.
- Editores de lista para cards, tags, links, videos, itens de stats.
- Validacoes minimas: URL, campos obrigatorios, tamanho de arrays.

Entregavel:
- Painel admin editando PT e EN lado a lado no novo schema.

Criterio de aceite:
- Alteracoes salvas aparecem no front em no maximo 1 refresh.

## Fase 5 - Migração de dados iniciais

Objetivo: popular `cms/v2` com conteudo atual.

- Script/manual de seed com base no mock atual + legados de `locales`.
- Revisao de consistencia de links, ids e arrays.
- Conferencia visual por secao PT/EN.

Entregavel:
- `cms/v2/landing/pt` e `cms/v2/landing/en` populados.

Criterio de aceite:
- Front sem diferenca visual relevante em relacao ao estado atual.

## Fase 6 - Endurecimento e operacao

Objetivo: reduzir risco operacional no dia a dia.

- Regras de seguranca RTDB para leitura publica e escrita restrita por admin.
- Log de falhas de leitura e fallback.
- Guia curto operacional para equipe de conteudo.

Entregavel:
- Regras de acesso e playbook de edicao.

Criterio de aceite:
- Usuario nao admin nao consegue escrever no CMS.

## Tabela de mapeamento (resumo)

- `locales/{lang}/translation.banner.*` -> `cms/v2/landing/{lang}/hero.*` (ajuste de chaves)
- `locales/{lang}/translation.header.*` -> `cms/v2/landing/{lang}/nav.links[*].label`
- `locales/{lang}/translation.quem_somos.*` -> `cms/v2/landing/{lang}/about.*`
- `locales/{lang}/translation.missao.*` -> `cms/v2/landing/{lang}/about.mission.*`
- `locales/{lang}/translation.visao.*` -> `cms/v2/landing/{lang}/about.vision.*`
- `locales/{lang}/translation.valores.*` -> `cms/v2/landing/{lang}/about.values.*`
- `locales/{lang}/translation.contatos.endereco` -> `cms/v2/landing/{lang}/footer.address`
- Campos sem origem no legado (gallery/stats/newsletter/privacy/transparency/media) -> seed inicial via mock atual.

## Riscos e mitigacoes

- Divergencia de chaves entre legado e v2:
  - Mitigacao: adapter de mapeamento + validacao de schema.

- Conteudo incompleto em EN:
  - Mitigacao: fallback por secao para mock EN.

- Erro humano no admin ao editar listas:
  - Mitigacao: validacoes e botoes de duplicar/remover com confirmacao.

- Evolucao futura de `admins` (array -> objeto por uid/email):
  - Mitigacao: proteger o `ProtectedRoute` para aceitar array e objeto durante transicao.

- Quebra em links/ancoras cross-page:
  - Mitigacao: normalizar `/#secao` na camada de dados.

## Checklist de QA por fase

- Fase 2: carregar home sem banco, com banco parcial e com banco completo.
- Fase 3: alternar PT/EN em todas as rotas publicas; verificar persistencia.
- Fase 4: editar PT/EN no admin e refletir no front.
- Fase 5: verificar videos YouTube por `videoId` e thumbnails auto-geradas.
- Fase 6: validar acesso admin e negacao para nao admins.

## Perguntas adicionais para amarrar antes de codar

1. Confirmar somente a nomenclatura final das secoes no admin (ordem e labels de exibicao).
2. Confirmar se o toggle de idioma aparecera apenas no header desktop ou tambem no menu mobile.

## Analise do export atual do RTDB (13/04/2026)

Estrutura encontrada no export anexado:

- `admins`: array de objetos com `email` e `isAdmin`.
- `locales`: dados legados de traducao (pt/en) no formato antigo.
- `newsletter`: colecao de inscricoes com `firstName`, `lastName`, `email`, `type`, `lgpdConsent`, `subscribedAt`.
- Nao existe ainda o no `cms/v2` (sera criado na migracao).

Implicacoes praticas:

- O `ProtectedRoute` atual esta compativel com o formato de `admins` do banco exportado.
- A migracao pode ser incremental sem impacto no login/admin atual.
- O seed inicial de `cms/v2` devera usar `mockData` + reaproveitamento parcial de `locales`.
