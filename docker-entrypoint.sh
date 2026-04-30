#!/bin/sh
# ============================================================
#  MUUU APP · Docker Entrypoint de producción
#  Sustituye $PORT en la config de nginx y arranca supervisor.
# ============================================================
set -e

# Render inyecta $PORT — usamos 10000 como fallback
export PORT="${PORT:-10000}"

echo "[entrypoint] Puerto asignado: $PORT"

# Generar la config final de nginx con el puerto correcto
envsubst '$PORT' \
  < /etc/nginx/conf.d/default.conf.template \
  > /etc/nginx/conf.d/default.conf

echo "[entrypoint] Nginx configurado. Iniciando servicios..."

# Supervisord gestiona php-fpm + nginx como procesos hijos
exec /usr/bin/supervisord -n -c /etc/supervisor/conf.d/supervisord.conf
