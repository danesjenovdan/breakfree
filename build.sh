#!/bin/bash

sudo docker login rg.fr-par.scw.cloud/djnd -u nologin -p $SCW_SECRET_TOKEN

sudo docker build -f Dockerfile -t rtv:latest .
sudo docker tag rtv:latest rg.fr-par.scw.cloud/djnd/rtv:latest
sudo docker push rg.fr-par.scw.cloud/djnd/rtv:latest
