#!/bin/sh

docker build ../../ -f Dockerfile -t riddimproject/sample-frontend:latest
docker push riddimproject/sample-frontend:latest
