#!/usr/bin/env bash

set -u

SOURCE_BRANCH="${1:-novo-site-coque}"
CURRENT_BRANCH="$(git branch --show-current 2>/dev/null)" || exit 1
EXIT_CODE=0

BLUE='\033[1;34m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
RED='\033[1;31m'
RESET='\033[0m'

if [[ -z "$CURRENT_BRANCH" ]]; then
  echo -e "${RED}>> Nao foi possivel identificar a branch atual.${RESET}"
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo -e "${RED}>> Existem alteracoes locais. Limpe ou salve a tree antes do deploy para staging.${RESET}"
  exit 1
fi

echo -e "${BLUE}>> Branch atual:${RESET} ${CURRENT_BRANCH}"
echo -e "${BLUE}>> Branch de origem para merge:${RESET} ${SOURCE_BRANCH}"
echo -e "${YELLOW}>> Indo para staging...${RESET}"

{
  git fetch origin &&
  git switch staging &&
  echo -e "${YELLOW}>> Atualizando staging com origin/staging...${RESET}" &&
  git pull --ff-only origin staging &&
  echo -e "${YELLOW}>> Fazendo merge de ${SOURCE_BRANCH} em staging...${RESET}" &&
  git merge --no-ff "$SOURCE_BRANCH"
} || EXIT_CODE=$?

if [[ $EXIT_CODE -eq 0 ]]; then
  echo -e "${YELLOW}>> Confirmar push de staging para origin? [y/N] ${RESET}"
  read -r CONFIRM

  if [[ "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}>> Enviando staging para origin...${RESET}"
    git push origin staging || EXIT_CODE=$?
  else
    EXIT_CODE=130
    echo -e "${YELLOW}>> Push cancelado. O merge local em staging foi mantido.${RESET}"
  fi
fi

echo -e "${YELLOW}>> Voltando para ${CURRENT_BRANCH}...${RESET}"
git switch "$CURRENT_BRANCH" >/dev/null 2>&1 || true

if [[ $EXIT_CODE -eq 0 ]]; then
  echo -e "${GREEN}>> Deploy para staging concluido com sucesso.${RESET}"
elif [[ $EXIT_CODE -eq 130 ]]; then
  echo -e "${YELLOW}>> Deploy interrompido antes do push.${RESET}"
else
  echo -e "${RED}>> Falha no deploy para staging. Verifique os erros acima.${RESET}"
fi

exit $EXIT_CODE