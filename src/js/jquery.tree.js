/*!
 * tree - jQuery Tree Plugin
 *
 * @author Valerio Galano <v.galano@daredevel.com>
 *
 * @license MIT
 *
 * @see http://tree.daredevel.com
 *
 * @version 0.1
 */
$.widget("daredevel.tree", {

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
            ul = $('<ul/>');
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
            ul = $('<ul/>');
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
     * Initialize plugin.
     *
     * @private
     *
     * @note Base tree structure must be something like this:
     *
     * <div id="tree">
     *   <ul>
     *     <li id="node1" class="expanded"><input type="checkbox"><label>Node 1</label><span>Node 1</span>
     *       <ul>
     *         <li><input type="checkbox"><label>Node 1.1</label>
     *         <li><input type="checkbox"><label>Node 1.2</label>
     *       </ul>
     *     </li>
     *   </ul>
     * </div>
     *
     * 1) input type="checkbox" tag and label tag are mandatory only to use checkbox component
     */
    _create: function() {

        var t = this;

        // add core widget to options so components can add methods
        this.options.core = this;

        // add jQueryUI css widget classes
        this.element.addClass('ui-widget ui-widget-content ' + this.widgetBaseClass);

        // initialize requested components
        this._initializeComponents();

        this.element.find('li').each(function() {
            t._initializeNode($(this));
        });

        if (this.options.nodes != null) {
            $.each(this.options.nodes, function(key, value) {
                t.options.core.addNode(value);
            });
        }
    },

    /**
     * Destroy plugin
     *
     * @private
     *
     * @todo complete destroy method
     */
    _destroy: function() {
        $.Widget.prototype.destroy.call(this);
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
     * Initialize requested components
     *
     * @private
     */
    _initializeComponents: function() {
        for (var i in this.options.components) {
            var initializeComponent = 'this.element.tree' + this.options.components[i] + '(this.options)';
            eval(initializeComponent);
        }
    },

    /**
     * Initialize passed node
     *
     * @private
     *
     * @param li node to initialize
     */
    _initializeNode: function(li) {
        li.children('span:last').addClass(this.options.core.widgetBaseClass + '-label');

        // call each active component initialize method
        for (var i in this.options.components) {
            var componentInitializeNode = 'this._tree' + this.options.components[i] + 'InitializeNode(li)';
            eval(componentInitializeNode);
        }
    },


    /**
     * Add a new node as children of passed one
     *
     * @public
     *
     * @param attributes new node attributes
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

        t._trigger('add', true, li);
    },

    /**
     * Check if passed node is a root
     *
     * @public
     *
     * @param li node to check
     */
    isRoot: function(li) {

        li = $(li);

        var parents = li.parentsUntil('.' + this.widgetBaseClass);

        return 0 == parents.length;
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
        
        this._trigger('move', true, $(li));
    },

    /**
     * Return parent li of the passed li
     *
     * @public
     *
     * @param li node as jQuery object or selector
     * @return parent li
     */
    parentNode: function(li) {
        return $(li).parents('li:first');
    },

    /**
     * Remove a node from tree (node is not actually delete, but still in memory)
     *
     * @param li node to delete (can be jQuery object or selector)
     */
    removeNode: function(li) {

        this._detachNode($(li));

        this._trigger('remove', true, $(li));

    },

    /**
     * Default options values.
     */
    options: {

        /**
         * Defines components to load.
         */
        components: [],

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
        },

        /**
         * 
         */
        nodes: null

    }
});