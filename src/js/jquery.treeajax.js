/*!
 * tree - jQuery Tree Plugin - ajax component
 *
 * @author Valerio Galano <v.galano@daredevel.com>
 *
 * @license MIT
 *
 * @see http://tree.daredevel.com
 */
$.widget("daredevel.treeajax", {

    /**
     * Initialize plugin
     *
     * @private
     */
    _create: function() {

        var t = this;

        // bind lazy loading on expand event
        if (this.options.lazyLoadingUrl) {
            this.element.bind("treeexpand", function(event, element) {
                if ($(element).find('ul').length) {
                    return;
                }
                t._lazyLoad($(element));
            });
        }

        // add private methods to core component
        this.options.core._treeajaxInitializeNode = function(li) {
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
    _initializeNode: function(li) {

        var t = this;

    },

    /**
     * Fetch node's children via ajax
     * 
     * @private
     *
     * @param parentLi node of which we want children
     */
    _lazyLoad: function(parentLi) {
        var t = this;
        
        $.ajax({
            url: this.options.lazyLoadingUrl,
            dataType:'json',
            data: {
                node: parentLi.attr('id')
            },
            success: function(data) {

                $.each(data.nodes, function(key, value) {
                    t.options.core.addNode(value, parentLi);
                });
            }
        });
    },

    /**
     * Default options values
     */
    options: {

        editUrl: '',

        lazyLoadingUrl: ''
        
    }

});