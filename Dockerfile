# change base image
FROM nginx:alpine

# copy built files from the 'build' container into the nginx container
COPY . /usr/share/nginx/html/
