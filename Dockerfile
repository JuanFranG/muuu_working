# ============================================================
#  MUUU APP · Dockerfile de PRODUCCIÓN
#  Multi-stage:
#    1. node:20 → compila el frontend React/Vite
#    2. php:8.3-fpm-alpine + nginx → sirve todo en un contenedor
#
#  Render.com ejecuta este Dockerfile como Web Service.
# ============================================================

# ──────────────────────────────────────────────────────────────
#  STAGE 1 : Compilar el frontend (React + Vite)
# ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS frontend-builder

WORKDIR /build

# Copia package files primero (caching de capas)
COPY ["App Mockup Muuu v2026-4/package.json", "App Mockup Muuu v2026-4/package-lock.json", "./"]
RUN npm ci --prefer-offline

# Copia el resto del frontend y construye
COPY "App Mockup Muuu v2026-4/" .
RUN npm run build
# Resultado en /build/dist/


# ──────────────────────────────────────────────────────────────
#  STAGE 2 : Imagen de producción (PHP-FPM + Nginx)
# ──────────────────────────────────────────────────────────────
FROM php:8.3-fpm-alpine

# ── Sistema: nginx, supervisor, gettext (envsubst) ───────────
RUN apk add --no-cache nginx supervisor gettext

# ── Extensiones PHP necesarias ───────────────────────────────
RUN docker-php-ext-install pdo pdo_mysql mysqli

# ── PHP — configuración de producción ────────────────────────
RUN cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" && \
    echo "display_errors = Off"              >> "$PHP_INI_DIR/php.ini" && \
    echo "log_errors = On"                   >> "$PHP_INI_DIR/php.ini" && \
    echo "error_log = /var/log/php_errors.log" >> "$PHP_INI_DIR/php.ini" && \
    echo "date.timezone = America/Bogota"    >> "$PHP_INI_DIR/php.ini" && \
    echo "upload_max_filesize = 50M"         >> "$PHP_INI_DIR/php.ini" && \
    echo "post_max_size = 55M"               >> "$PHP_INI_DIR/php.ini" && \
    echo "max_execution_time = 120"          >> "$PHP_INI_DIR/php.ini" && \
    echo "memory_limit = 256M"               >> "$PHP_INI_DIR/php.ini" && \
    echo "session.cookie_secure = 0"         >> "$PHP_INI_DIR/php.ini" && \
    echo "session.cookie_httponly = 1"       >> "$PHP_INI_DIR/php.ini" && \
    echo "session.cookie_samesite = Lax"     >> "$PHP_INI_DIR/php.ini"

# ── Backend PHP ───────────────────────────────────────────────
WORKDIR /var/www/html
COPY backend/ /var/www/html/

# Carpeta de uploads (el disco persistente de Render se monta aquí)
RUN mkdir -p /var/www/html/uploads && \
    chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html/uploads

# ── Frontend compilado ────────────────────────────────────────
COPY --from=frontend-builder /build/dist /var/www/html/dist

# ── Configuraciones de Nginx y Supervisor ────────────────────
COPY nginx/production.conf /etc/nginx/conf.d/default.conf.template
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# ── Script de arranque ────────────────────────────────────────
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Render usa el puerto definido en $PORT (defecto 10000)
EXPOSE 10000

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
