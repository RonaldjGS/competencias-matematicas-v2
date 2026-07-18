FROM mysql:8.0

ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=competencias_matematicas_v2
ENV MYSQL_ROOT_HOST=%

COPY competencias_matematicas_v2.sql /docker-entrypoint-initdb.d/init.sql