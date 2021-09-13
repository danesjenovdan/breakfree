#!/bin/bash

sudo docker login rg.fr-par.scw.cloud/djnd -u nologin -p $SCW_SECRET_TOKEN

sudo docker build -f Dockerfile -t stanovanjske-zadruge:latest .
sudo docker tag stanovanjske-zadruge:latest rg.fr-par.scw.cloud/djnd/stanovanjske-zadruge:latest
sudo docker push rg.fr-par.scw.cloud/djnd/stanovanjske-zadruge:latest
