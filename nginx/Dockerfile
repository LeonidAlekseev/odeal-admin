FROM ubuntu:24.04 as builder

RUN apt update \
    && apt upgrade -y \
    && apt install -y libpcre3 libpcre3-dev zlib1g zlib1g-dev openssl libssl-dev wget git gcc make libbrotli-dev

WORKDIR /app
RUN wget https://nginx.org/download/nginx-1.27.0.tar.gz && tar -zxf nginx-1.27.0.tar.gz
RUN git clone --recurse-submodules -j8 https://github.com/google/ngx_brotli
RUN cd nginx-1.27.0 && ./configure --with-compat --add-dynamic-module=../ngx_brotli \
    && make modules

FROM nginx:1.27.0
COPY --from=builder /app/nginx-1.27.0/objs/ngx_http_brotli_static_module.so /etc/nginx/modules/
COPY --from=builder /app/nginx-1.27.0/objs/ngx_http_brotli_filter_module.so /etc/nginx/modules/

# Remove any existing config files
RUN rm /etc/nginx/nginx.conf
RUN rm /etc/nginx/conf.d/default.conf

# Copy config files
COPY ./nginx.conf /etc/nginx/
COPY ./default.conf /etc/nginx/conf.d/

# Expose the listening port
EXPOSE 80

# Launch NGINX
CMD [ "nginx", "-g", "daemon off;" ]