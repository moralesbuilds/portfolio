#!/bin/bash

NAME="$1"
LOCALE="$2"
SLUG="$3"
LABEL="$4"
LOCAL="$5"

cmd_flags=("--filter" "web" "exec" "wrangler" "d1" "execute" "contents-db"
  "--command" "INSERT INTO tags (name, locale, slug, label) VALUES ('${NAME}', '${LOCALE}', '${SLUG}', '${LABEL}');" "${LOCAL}")

pnpm "${cmd_flags[@]}"
