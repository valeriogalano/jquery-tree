/*!
 * Tree - jQuery Tree Widget - ajax component
 * @author Valerio Galano <v.galano@daredevel.com>
 */
$.widget("daredevel.treeajax", {

    /**
     * Initialize plugin
     *
     * @private
     */
    _create:function () {

        var t = this;

        // initialize ajax nodes
        if (this.options.dataSourceUrl) {
            t._lazyInit();
        }

        // bind lazy loading on expand event
        if (this.options.dataSourceUrl) {
            this.element.bind("treeexpand", function (event, element) {
                if ($(element).find('ul').length) {
                    return;
                }
                t._lazyLoad($(element));
            });
        }

        // bind edit on drop event
        if (this.options.dataEditUrl) {
            this.element.bind("treemove", function (event, element) {
                /** @todo: test if parent is not changed */
                t._notifyMove($(element));
            });
        }

        // add private methods to core component
        this.options.core._treeajaxInitializeNode = function (li) {
            t._initializeNode(li);
        };

    },

    /**
     * Initialize passed node
     *
     * @private
     *
     * @param li node to initialize
     */
    _initializeNode:function (li) {

//        var t = this;

    },

    /**
     * Fetch tree via ajax
     */
    _lazyInit:function () {
        var t = this;

        $.ajax({
            url:this.options.dataSourceUrl,
            dataType:'json',
            beforeSend:function () {
                //alert('beforeSend');
            },
            complete:function () {
                //alert('beforeSend');
            },
            data:{
            },
            success:function (data) {
                $.each(data.nodes, function (key, value) {
                    t.options.core.addNode(value);
                });
            }
        });
    },

    /**
     * Fetch node's children via ajax
     *
     * @private
     *
     * @param parentLi node of which we want children
     */
    _lazyLoad:function (parentLi) {
        var t = this;

        $.ajax({
            url:this.options.dataSourceUrl,
            dataType:'json',
            data:{
                node:parentLi.attr('id')
            },
            success:function (data) {

                $.each(data.nodes, function (key, value) {
                    t.options.core.addNode(value, parentLi);
                });
            }
        });
    },

    /**
     * Send move operation data via ajax
     *
     * @param li
     */
    _notifyMove:function (li) {
        var t = this;

        var parentLi = t.options.core.parentNode(li);

        $.ajax({
            url:this.options.dataEditUrl,
            dataType:'json',
            data:{
                node:li.attr('id'),
                operation:'move',
                parent:parentLi.attr('id')
            },
            beforeSend:function () {
                alert('beforeSend');
            },
            success:function (data) {
                alert('ok');
            }
        });
    },

    /**
     * Default options values
     */
    options:{

        /**
         * Defines url to request when tree modify operations happens.
         *
         * Server should return a null value if OK or an object like following:
         * {
         *     error: "there was an error saving ..."
         * }
         * The error string will be shown to user.
         */
        dataEditUrl:'',

        /**
         * Defines url to request to get tree nodes for lazy loading.
         *
         * Server should return an object like following:
         * {
         *    "nodes": [
         *       {
         *           "span": {
         *               "html": "Ajax node 1"
         *           },
         *           "li": {
         *               "class": "collapsed"
         *           }
         *       },
         *       {
         *           "span": {
         *               "html": "Ajax node 2"
         *           },
         *           "li": {
         *               "class": "collapsed"
         *           }
         *       }
         *    ]
         * }
         */
        dataSourceUrl:''
//@todo: dataSource should be a function ?
    }

});