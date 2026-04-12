# ── Imagen base ────────────────────────────────────────────────────────────────
FROM nginx:alpine

# ── Eliminar configuración por defecto de nginx ────────────────────────────────
RUN rm -rf /usr/share/nginx/html/* \
    && rm /etc/nginx/conf.d/default.conf

# ── Copiar configuración personalizada de nginx ────────────────────────────────
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ── Copiar los ficheros estáticos del proyecto ─────────────────────────────────
COPY index.html  /usr/share/nginx/html/
COPY assets/     /usr/share/nginx/html/assets/
COPY tests/      /usr/share/nginx/html/tests/

# ── Ejecutar nginx como usuario no-root (nginx) ────────────────────────────────
RUN chown -R nginx:nginx /usr/share/nginx/html \
    && chmod -R 755 /usr/share/nginx/html

# ── Puerto expuesto ────────────────────────────────────────────────────────────
EXPOSE 80

# ── Healthcheck ────────────────────────────────────────────────────────────────
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

# ── Comando de arranque ────────────────────────────────────────────────────────
CMD ["nginx", "-g", "daemon off;"]
