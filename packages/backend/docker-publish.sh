#!/bin/sh

docker build ../../ -f Dockerfile -t riddimproject/backend:latest
docker push riddimproject/backend:latest
