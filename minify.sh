#!/bin/bash


js="jquery.a.js jquery.tree.js";
css="jquery.tree.css";

#read -p "Do you want to include Ajax component? [Y/n]:"
#if [ "$REPLY" != "n" ]; then
#    js=$js" jquery.treeajax.js";
#fi

read -p "Do you want to include Checkbox component? [Y/n]:"
if [ "$REPLY" != "n" ]; then
    js=$js" jquery.treecheckbox.js";
fi

read -p "Do you want to include Collapse component? [Y/n]:"
if [ "$REPLY" != "n" ]; then
    js=$js" jquery.treecollapse.js";
    css=$css" jquery.treecollapse.css";
fi

#read -p "Do you want to include Context Menu component? [Y/n]:"
#if [ "$REPLY" != "n" ]; then
#    js=$js" jquery.treecontextmenu.js";
#    css=$css" jquery.treecontextmenu.css";
#fi

read -p "Do you want to include Drag&Drop component? [Y/n]:"
if [ "$REPLY" != "n" ]; then
    js=$js" jquery.treednd.js";
    css=$css" jquery.treednd.css";
fi

read -p "Do you want to include Select component? [Y/n]:"
if [ "$REPLY" != "n" ]; then
    js=$js" jquery.treeselect.js";
fi

js=$js" jquery.z.js";


if [ ! -e ./uncompressed ]; then mkdir ./uncompressed; fi
if [ ! -e ./minified ]; then mkdir ./minified; fi

if [ -e jquery.tree.js ]; then rm jquery.tree.js; fi
cd ./src/js/
cat $js > ../../uncompressed/jquery.tree.js
cd ../../
yui-compressor ./uncompressed/jquery.tree.js -o ./minified/jquery.tree.min.js

if [ -e jquery.tree.css ]; then rm jquery.tree.css ; fi
cd ./src/css/
cat $css > ../../uncompressed/jquery.tree.css
cd ../../
yui-compressor ./uncompressed/jquery.tree.css -o ./minified/jquery.tree.min.css

if [ ! -e ./uncompressed/images ]; then mkdir ./uncompressed/images; fi
cp ./src/css/images/*.gif ./uncompressed/images/

if [ ! -e ./minified/images ]; then mkdir ./minified/images; fi
cp ./src/css/images/*.gif ./minified/images/