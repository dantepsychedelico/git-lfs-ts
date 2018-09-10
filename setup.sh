#!/bin/bash

case $1 in 
    gen-ssl-cert) 
        openssl genrsa -out config/key.pem 
        openssl req -new -key config/key.pem -out config/csr.pem 
        openssl x509 -req -days 9999 -in config/csr.pem -signkey config/key.pem -out config/cert.pem 
        rm config/csr.pem
        ;;
    skip-cert-in-local)
        GIT_LFS_SERVER_URL=${GIT_LFS_SERVER_URL-https://localhost:3000}
        git config --global http.$GIT_LFS_SERVER_URL.sslVerify false
        ;;
esac
