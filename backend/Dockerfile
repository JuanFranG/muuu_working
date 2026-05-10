# ============================================================
#  MUUU APP · PHP 8.3-FPM
# ============================================================

FROM php:8.3-fpm-alpine

# Extensiones necesarias para MySQL, curl y manejo de strings
RUN apk add --no-cache curl-dev \
 && docker-php-ext-install \
      mysqli \
      pdo \
      pdo_mysql \
      curl

# Configuración de PHP para desarrollo
RUN mv "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"

# Ajustes mínimos: mostrar errores en dev, zona horaria Colombia, límites de subida
RUN echo "display_errors = On"              >> "$PHP_INI_DIR/php.ini" && \
    echo "error_reporting = E_ALL"          >> "$PHP_INI_DIR/php.ini" && \
    echo "date.timezone = America/Bogota"   >> "$PHP_INI_DIR/php.ini" && \
    echo "upload_max_filesize = 50M"        >> "$PHP_INI_DIR/php.ini" && \
    echo "post_max_size = 55M"              >> "$PHP_INI_DIR/php.ini" && \
    echo "max_execution_time = 120"         >> "$PHP_INI_DIR/php.ini" && \
    echo "memory_limit = 256M"              >> "$PHP_INI_DIR/php.ini"

WORKDIR /var/www/html

# El código PHP se monta como volumen desde docker-compose
# No se copia aquí para que los cambios en dev sean instantáneos

EXPOSE 9000

CMD ["php-fpm"]
