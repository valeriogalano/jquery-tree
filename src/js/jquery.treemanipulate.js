/*!
 * tree - jQuery Tree Plugin - manipulate component
 *
 * @author Valerio Galano <v.galano@daredevel.com>
 *
 * @license MIT
 *
 * @see http://tree.daredevel.com
 */
$.widget("daredevel.treemanipulate", {

    /**
     * Attach a node under passed parent
     *
     * @private
     *
     * @param li node to attach
     * @param parentLi node under which new node will be attached
     */
    _attachNode: function(li, parentLi) {

        // if no parent is passed, node will be attached as root
//        if ((undefined == parentLi) || (parentLi[0] == this.options.core.element[0])) {
        var ul = parentLi.find('ul:first');

        if (ul.length) {
            ul.append(li);
        } else {
            var ul = $('<ul/>');
            parentLi.append(ul.append(li));
        }

        parentLi.removeClass('leaf collapsed').addClass('expanded'); //@todo find right way to do this

        //initialize nodes from core to call all components initialize methods
        this.options.core._initializeNode(li);
        this.options.core._initializeNode(parentLi);
    },

    /**
     * Attach node as root
     * 
     * @param li
     */
    _attachRoot: function(li) {

        var ul = this.options.core.element.find('ul:first');

        if (ul.length) {
            ul.append(li);
        } else {
            var ul = $('<ul/>');
            this.options.core.element.append(ul.append(li));
        }

        //initialize nodes from core to call all components initialize methods
        this.options.core._initializeNode(li);
    },

    /**
     * Create a new node object
     *
     * Attributes must contains a list of attributes for html elements of the node.
     *
     * @private
     *
     * @param attributes object containing a list of new node's html elements attributes
     * @return a li element object
     */
    _buildNode: function(attributes) {

        attributes = $.extend(true, this.options.defaultNodeAttributes, attributes);

        // create new node label
        var span = $('<span/>', attributes.span);

        // create node
        var li = $('<li/>', attributes.li);

        // if checkbox component is active, new node must contain checkbox input
        if ($.inArray('checkbox', this.options.components) > -1) {
            var input = $('<input/>',
                attributes.input
            );
            li.append(input);
        }

        li.append(span);

        return li;
    },


    /**
     * Initialize plugin
     *
     * @private
     */
    _create: function() {

        var t = this;

        // add public methods to core component
        this.options.core.addNode = function(attributes, parentLi) {
            t.addNode(attributes, parentLi);
        };
        this.options.core.moveNode = function(li, parentLi) {
            t.moveNode(li, parentLi);
        };
        this.options.core.removeNode = function(li) {
            t.removeNode(li);
        };

        // add private methods to core component
        this.options.core._treemanipulateInitializeNode = function(li) {
            t._initializeNode(li);
        };
    },

    /**
     * Detach a node (actually don't delete it)
     *
     * @private
     *
     * @param li node to detach
     */
    _detachNode: function(li) {

        var parentLi = this.options.core.parentNode(li);

        var ul = parentLi.find('ul:first');

        if (ul.children().length == 1) {
            ul.detach();
            parentLi.removeClass('collapsed expanded').addClass('leaf') //@todo find right way to do this
        } else {
            li.detach();
        }

        //initialize node from core to call all components initialize methods
        this.options.core._initializeNode(parentLi);
    },

    /**
     * Initialize passed node
     *
     * @private
     *
     * @param li node to initialize
     */
    _initializeNode: function(li) {

    },

    /**
     * Add a new node as children of passed one
     *
     * @public
     *
     * @param attribute new node attributes
     * @param parentLi node under which new node will be attached
     */
    addNode: function(attributes, parentLi) {

        var t = this;

        var li = this._buildNode(attributes);

        if (undefined == parentLi) {
            this._attachRoot(li);
        } else {
            this._attachNode(li, parentLi);
        }

        if (undefined != attributes.children) {
            $.each(attributes.children, function(value, key) {
                t.addNode(value, li);
            });
        }

    },

    /**
     * Move a node under new parent
     *
     * @param li
     * @param parentLi
     */
    moveNode: function(li, parentLi) {

        this._detachNode($(li));

        if (undefined == parentLi) {
            this._attachRoot($(li));
        } else {
            this._attachNode($(li), $(parentLi));
        }

    },

    /**
     * Remove a node from tree (node is not actually delete, but still in memory)
     *
     * @param li node to delete (can be jQuery object or selector)
     */
    removeNode: function(li) {

        this._detachNode($(li));

    },

    /**
     * Default options values.
     */
    options: {

        /**
         * Defines default node attributes to use in node adding if different specified in addNode() method
         */
        defaultNodeAttributes: {
            span: {
                html: 'new node'
            },
            li: {
                'class': 'leaf'
            },
            input: {
                type: 'checkbox'
            }
        }
    }

});
