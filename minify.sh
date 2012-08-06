#!/bin/bash

if [ ! -e ./uncompressed ]; then mkdir ./uncompressed; fi
if [ ! -e ./minified ]; then mkdir ./minified; fi

if [ -e jquery.tree.js ]; then rm jquery.tree.js; fi
cat ./src/js/*.js > ./uncompressed/jquery.tree.js
yui-compressor ./uncompressed/jquery.tree.js -o ./minified/jquery.tree.min.js

if [ -e jquery.tree.css ]; then rm jquery.tree.css ; fi
cat ./src/css/*.css > ./uncompressed/jquery.tree.css
yui-compressor ./uncompressed/jquery.tree.css -o ./minified/jquery.tree.min.css

if [ ! -e ./uncompressed/images ]; then mkdir ./uncompressed/images; fi
cp ./src/css/images/*.gif ./uncompressed/images/

if [ ! -e ./minified/images ]; then mkdir ./minified/images; fi
cp ./src/css/images/*.gif ./minified/images/