#!/bin/bash

sudo docker login rg.fr-par.scw.cloud/djnd -u nologin -p $SCW_SECRET_TOKEN

sudo docker build -f Dockerfile -t exitect:latest .
sudo docker tag exitect:latest rg.fr-par.scw.cloud/djnd/exitect:latest
sudo docker push rg.fr-par.scw.cloud/djnd/exitect:latest
