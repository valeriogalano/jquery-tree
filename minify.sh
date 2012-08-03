#!/bin/bash

if [ -e jquery.tree.js ]; then rm jquery.tree.js; fi
cat ./src/js/*.js > ./src/jquery.tree.js
yui-compressor ./src/jquery.tree.js -o ./minified/jquery.tree.min.js

if [ -e jquery.tree.css ]; then rm jquery.tree.css ; fi
cat ./src/css/*.css > ./src/jquery.tree.css
yui-compressor ./src/jquery.tree.css -o ./minified/jquery.tree.min.css

if [ ! -e ./minified/images ]; then mkdir ./minified/images; fi
cp ./src/images/*.gif ./minified/images/