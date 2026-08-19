#!/usr/bin/env bash
# Fluxo completo de promoção de feature branch para produção.
#
# Uso:
#   ./scripts/promote.sh "feat: título" "## Summary\n- item 1"
#
# Argumentos:
#   $1  Título do PR (obrigatório)
#   $2  Body do PR   (opcional — omitir abre sem descrição)
#
# O que faz:
#   1. Dá push da branch atual (com upstream, se ainda não existir no remoto)
#   2. Abre PR da branch atual → staging
#   3. Mergeia com squash e deleta a branch
#   4. Atualiza staging local
#   5. Abre PR staging → main (aguarda aprovação humana)

set -euo pipefail

TITLE="${1:?Uso: $0 \"feat: título\" [\"body\"]}"
BODY="${2:-}"
BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [[ "$BRANCH" == "staging" || "$BRANCH" == "main" ]]; then
  echo "Erro: rode este script a partir de uma feature branch, não de '$BRANCH'." >&2
  exit 1
fi

echo "▶ branch atual: $BRANCH"

echo ""
echo "── 1/5  Enviando branch para o remoto ────────────────────────"
git push -u origin "$BRANCH"

echo ""
echo "── 2/5  Criando PR: $BRANCH → staging ──────────────────────"
if [[ -n "$BODY" ]]; then
  gh pr create --base staging --title "$TITLE" --body "$BODY"
else
  gh pr create --base staging --title "$TITLE" --body ""
fi

echo ""
echo "── 3/5  Mergeando (squash) e deletando branch ───────────────"
gh pr merge --squash --delete-branch

echo ""
echo "── 4/5  Atualizando staging local ───────────────────────────"
git checkout staging
git pull origin staging

echo ""
echo "── 5/5  Criando PR: staging → main ──────────────────────────"
if [[ -n "$BODY" ]]; then
  gh pr create --base main --title "$TITLE" --body "$BODY"
else
  gh pr create --base main --title "$TITLE" --body ""
fi

echo ""
echo "✓ Concluído. Aguardando aprovação no GitHub para staging → main."
