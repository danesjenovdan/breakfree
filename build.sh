#!/bin/bash

sudo docker login rg.fr-par.scw.cloud/djnd -u nologin -p $SCW_SECRET_TOKEN

sudo docker build -f Dockerfile -t naravenedamo:latest .
sudo docker tag naravenedamo:latest rg.fr-par.scw.cloud/djnd/naravenedamo:latest
sudo docker push rg.fr-par.scw.cloud/djnd/naravenedamo:latest
