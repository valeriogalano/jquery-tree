#!/bin/bash


js="jquery.tree.js";
css="jquery.tree.css";

if [ ! -e ./minified ]; then mkdir ./minified; fi

if [ -e jquery.tree.js ]; then rm jquery.tree.js; fi
yui-compressor ./src/js/jquery.tree.js -o ./minified/jquery.tree.min.js

if [ -e jquery.tree.css ]; then rm jquery.tree.css ; fi
yui-compressor ./src/css/jquery.tree.css -o ./minified/jquery.tree.min.css

if [ ! -e ./minified/images ]; then mkdir ./minified/images; fi
cp ./src/css/images/*.gif ./minified/images/