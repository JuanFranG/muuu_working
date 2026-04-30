#!/bin/sh
# ============================================================
#  MUUU APP · Docker Entrypoint de producción
#  Inyecta $PORT en el config de nginx y arranca supervisor.
# ============================================================
set -e

# Render inyecta $PORT — fallback 10000
PORT="${PORT:-10000}"

echo "[entrypoint] Puerto asignado: $PORT"

# Reemplaza el placeholder __PORT__ con el valor real
# (usamos sed en lugar de envsubst para no tocar las variables $uri etc. de nginx)
sed "s/__PORT__/${PORT}/g" \
  /etc/nginx/http.d/default.conf.template \
  > /etc/nginx/http.d/default.conf

echo "[entrypoint] Config nginx generada. Validando..."

# Valida la sintaxis antes de arrancar (falla rápido si hay error)
nginx -t

echo "[entrypoint] OK. Iniciando servicios con supervisord..."

exec /usr/bin/supervisord -n -c /etc/supervisor/conf.d/supervisord.conf
