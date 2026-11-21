#!/usr/bin/env bash
# Abre el sitio de ELLA en el navegador con un servidor local.
set -e

cd "$(dirname "$0")"
PUERTO="${1:-8000}"

echo ""
echo "  ✦ ELLA — un santuario en azul y negro"
echo "  Servidor local: http://localhost:${PUERTO}"
echo "  Presiona Ctrl+C para detenerlo."
echo ""

( sleep 1; xdg-open "http://localhost:${PUERTO}" >/dev/null 2>&1 || true ) &
python3 -m http.server "${PUERTO}"
