#!/bin/bash
set -a
source .env.local
set +a

vercel --token="$VERCEL_CLI_TOKEN" "$@" 2>&1 | sed "s/$VERCEL_CLI_TOKEN/[REDACTED]/g"
exit "${PIPESTATUS[0]}"
