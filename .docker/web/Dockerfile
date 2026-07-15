FROM alpine:3.24

ARG USER_ID=1000
ARG GROUP_ID=1000
ARG PHP=84

# Installing Apache, PHP and additional modules
RUN apk update && apk upgrade && apk add --no-cache \
    # Required modules \
    apache2 \
    apache2-ssl \
    apache2-proxy \
    php${PHP} \
    php${PHP}-fpm \
    tzdata \
    # Optional modules, can be turned on/off as needed \
    php${PHP}-ctype \
    php${PHP}-curl \
    php${PHP}-dom \
    php${PHP}-fileinfo \
    php${PHP}-gd \
    php${PHP}-iconv \
    php${PHP}-intl \
    php${PHP}-json \
    php${PHP}-mbstring \
    php${PHP}-mysqli \
    php${PHP}-openssl \
    #php${PHP}-pdo \
    #php${PHP}-pdo_mysql \
    #php${PHP}-pdo_pgsql \
    #php${PHP}-pdo_sqlite \
    php${PHP}-pecl-apcu \
    php${PHP}-pecl-xdebug \
    #php${PHP}-pgsql \
    #php${PHP}-phar \
    php${PHP}-session \
    php${PHP}-simplexml \
    #php${PHP}-sqlite3 \
    php${PHP}-tokenizer \
    php${PHP}-xml \
    php${PHP}-xmlwriter \
    php${PHP}-zip \
    && if [ $PHP = 83 -o $PHP = 84 ]; then apk add --no-cache php${PHP}-opcache; fi

# Synchronizing UID/GID with host
RUN addgroup -S -g ${GROUP_ID} app && \
    adduser -S -D -H -u ${USER_ID} -G app app && \
    mkdir -p /app /var/log/php /var/log/xdebug /run/apache2 /run/php && \
    chown -R app:app /var/www /app /var/log/php /var/log/xdebug /run/apache2 /run/php

# Apache configuration
COPY config/httpd.conf /etc/apache2/httpd.conf
COPY config/httpd-vhosts.conf /etc/apache2/conf.d/
RUN sed -i '/<VirtualHost _default_:443>/,$d' /etc/apache2/conf.d/ssl.conf

# PHP configuration
COPY config/php${PHP}.ini /etc/php${PHP}/php.ini
RUN sed -i "s/^;error_log = log\/php${PHP}\/error.log/error_log = log\/php\/php-fpm.log/" /etc/php${PHP}/php-fpm.conf
RUN sed -i 's/^listen = .*/listen = \/run\/php\/fpm.sock/' /etc/php${PHP}/php-fpm.d/www.conf && \
    sed -i 's/^user = .*/;user = .*/' /etc/php${PHP}/php-fpm.d/www.conf && \
    sed -i 's/^group = .*/;group = .*/' /etc/php${PHP}/php-fpm.d/www.conf && \
    sed -i 's/^;listen.owner = nobody/listen.owner = app/' /etc/php${PHP}/php-fpm.d/www.conf && \
    sed -i 's/^;listen.group = nobody/listen.group = app/' /etc/php${PHP}/php-fpm.d/www.conf && \
    sed -i 's/^;listen.mode = 0660/listen.mode = 0660/' /etc/php${PHP}/php-fpm.d/www.conf
RUN echo -e "SMTP = mail\nsmtp_port = 1025\nsendmail_path = /usr/sbin/sendmail -t -i -S mail:1025\n" > /etc/php${PHP}/conf.d/sendmail.ini

# XDebug configuration
COPY config/xdebug.ini /etc/php${PHP}/conf.d/50_xdebug.ini

# Copy SSL certificates
COPY ssl/localhost.key  /etc/ssl/apache2/server.key
COPY ssl/localhost.crt  /etc/ssl/apache2/server.pem
RUN chown -R app:app /etc/ssl/apache2 && \
    chmod 600 /etc/ssl/apache2/server.key

WORKDIR /app
EXPOSE 80 443

# Start PHP-FPM in background and Apache in foreground
ENV PHP=${PHP}
CMD ["sh", "-c", "php-fpm${PHP} & httpd -D FOREGROUND"]
