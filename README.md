# About
daredevel's jQuery Tree is a jQuery UI widget that you can use to add advanced features to an html tree built using nested unordered lists.

It's designed to be fast, lightweight, simple to deploy and setup and highly configurable.

* [live demo] (http://htmlpreview.github.io/?https://github.com/daredevel/jquery-tree/blob/master/index.html)
* [documentation] (http://www.daredevel.com/jquery-tree-widget/)

# Features
* lightweight (less than 16Kb for minified version)
* tree manipulation methods
* collapse/expand (derived from jQuery checkboxtree plugin)
* advanced checkbox logic (derived from jQuery checkboxtree plugin)
* support for context menu
* support for ajax
* support for drag and drop

# Changelog
### 0.1 (coming soon):
* initial release

# Quickstart
First of all, let's setup plugin initialization into html head section:

    <!-- include jQuery and jQueryUI libraries -->
    <script type="text/javascript" src="http://code.jquery.com/jquery-1.9.1.js"></script>
    <script type="text/javascript" src="http://code.jquery.com/ui/1.10.1/jquery-ui.js"></script>
    <link rel="stylesheet" type="text/css" href="http://code.jquery.com/ui/1.10.1/themes/base/jquery-ui.css"/>

    <!-- include plugin -->
    <script type="text/javascript" src="minified/jquery.tree.min.js"></script>
    <link rel="stylesheet" type="text/css" href="minified/jquery.tree.min.css" />

    <!-- initialize checkboxTree plugin -->
    <script type="text/javascript">
        //<!--
        $(document).ready(function() {
            $('#tree').tree({
                /* specify here your options */
            });
        });
    //-->
    </script>
    
Now, we can build our tree into html body section:
    
    <div id="tree">
        <ul>
            <li>
                <input type="checkbox" /><span>Node 1</span>
                <ul>
                    <li>
                        <input type="checkbox" /><span>Node 1.1</span>
                        <ul>
                            <li><input type="checkbox" /><span>Node 1.1.1</span></li>
                        </ul>
                    </li>
                </ul>
                <ul>
                    <li>
                        <input type="checkbox" /><span>Node 1.2</span>
                        <ul>
                            <li><input type="checkbox" /><span>Node 1.2.1</span></li>
                            <li><input type="checkbox" /><span>Node 1.2.2</span></li>
                            <li>
                                <input type="checkbox" /><span>Node 1.2.3</span>
                                <ul>
                                    <li><input type="checkbox" /><span>Node 1.2.3.1</span></li>
                                    <li><input type="checkbox"><span>Node 1.2.3.2</span></li>
                                </ul>
                            </li>
                            <li><input type="checkbox"><span>Node 1.2.4</span></li>
                            <li><input type="checkbox"><span>Node 1.2.5</span></li>
                            <li><input type="checkbox"><span>Node 1.2.6</span></li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li>
                <input type="checkbox" /><span>Node 2</span>
                <ul>
                    <li>
                        <input type="checkbox" /><span>Node 2.1</span>
                        <ul>
                            <li><input type="checkbox"><span>Node 2.1.1</span></li>
                        </ul>
                    </li>
                    <li>
                        <input type="checkbox" /><span>Node 2.2</span>
                        <ul>
                            <li><input type="checkbox"><span>Node 2.2.1</span></li>
                            <li><input type="checkbox"><span>Node 2.2.2</span></li>
                            <li>
                                <input type="checkbox"><span>Node 2.2.3</span>
                                <ul>
                                    <li><input type="checkbox"><span>Node 2.2.3.1</span></li>
                                    <li><input type="checkbox"><span>Node 2.2.3.2</span></li>
                                </ul>
                            </li>
                            <li><input type="checkbox"><span>Node 2.2.4</span></li>
                            <li><input type="checkbox"><span>Node 2.2.5</span></li>
                            <li><input type="checkbox"><span>Node 2.2.6</span></li>
                        </ul>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
    
    
    
Please, refer to documentation for details.
