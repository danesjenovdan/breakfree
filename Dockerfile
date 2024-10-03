FROM nginx:alpine
COPY img /usr/share/nginx/html/img
COPY index.html script.js style.css /usr/share/nginx/html/