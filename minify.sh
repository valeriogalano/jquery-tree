#!/bin/bash

if [ -e jquery.tree.js ]; then rm jquery.tree.js; fi
cat ./src/js/*.js > jquery.tree.js
yui-compressor jquery.tree.js -o jquery.tree.min.js

if [ -e jquery.tree.css ]; then rm jquery.tree.css ; fi
cat ./src/css/*.css > jquery.tree.css
yui-compressor jquery.tree.css -o jquery.tree.min.css
