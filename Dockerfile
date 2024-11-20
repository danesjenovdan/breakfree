FROM nginx:alpine

COPY img /usr/share/nginx/html/img
COPY poslanci-fotke /usr/share/nginx/html/poslanci-fotke
COPY reactions /usr/share/nginx/html/reactions
COPY index.html mail.html script_new.js style_new.css /usr/share/nginx/html/
