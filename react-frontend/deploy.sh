#!/bin/bash

echo "Building project..."

npm run build

echo "Cleaning old files..."

rm -rf /home/snsolut1/public_html/frontend/*

echo "Copying new build..."

cp -r dist/* /home/snsolut1/public_html/frontend/

echo "Deployment completed successfully!"




