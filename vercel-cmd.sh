#!/bin/bash
set -a
source .env.local
set +a

vercel --token="$VERCEL_CLI_TOKEN" "$@"
