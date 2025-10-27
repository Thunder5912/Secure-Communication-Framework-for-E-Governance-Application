#!/bin/bash
mkdir -p certificates
openssl req -x509 -newkey rsa:2048 -nodes -keyout server.key -out server.crt -subj "/CN=localhost" -days 365
openssl rsa -in server.key -pubout -out server.pub.pem
echo "Certificates generated successfully!"
