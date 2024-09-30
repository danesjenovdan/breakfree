FROM nginx:alpine

COPY fonts /usr/share/nginx/html/fonts
COPY img /usr/share/nginx/html/img
COPY favicon.ico index.html podpisi.txt script.js style.css /usr/share/nginx/html/
