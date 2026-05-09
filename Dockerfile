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

# Copia package files primero para cachear la instalación de dependencias
COPY ["App Mockup Muuu v2026-4/package.json", "App Mockup Muuu v2026-4/package-lock.json", "./"]
RUN npm ci

# Copia el resto del frontend y construye
# Nota: JSON-array es obligatorio para rutas con espacios en Docker
COPY ["App Mockup Muuu v2026-4/", "."]
RUN npm run build
# Resultado en /build/dist/



# ──────────────────────────────────────────────────────────────
#  STAGE 2 : Imagen de producción (PHP-FPM + Nginx)
# ──────────────────────────────────────────────────────────────
FROM php:8.3-fpm-alpine

# ── Sistema: nginx, supervisor ───────────────────────────────
# gettext ya no es necesario (usamos sed para reemplazar __PORT__)
RUN apk add --no-cache nginx supervisor && \
    # Elimina el virtual-host por defecto de Alpine nginx
    # (conflictúa con nuestro config en puerto 10000)
    rm -f /etc/nginx/http.d/default.conf && \
    # Directorios necesarios para que nginx arranque correctamente
    mkdir -p /var/log/nginx /var/lib/nginx/tmp /run/nginx

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
    echo "session.cookie_secure = 1"         >> "$PHP_INI_DIR/php.ini" && \
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
# El template va a http.d/ (Alpine nginx usa http.d/, no conf.d/)
COPY nginx/production.conf /etc/nginx/http.d/default.conf.template
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# ── Script de arranque ────────────────────────────────────────
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Render usa el puerto definido en $PORT (defecto 10000)
EXPOSE 10000

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
