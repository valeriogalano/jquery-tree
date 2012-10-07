/*!
 * Tree - jQuery Tree Plugin
 * @author Valerio Galano <v.galano@daredevel.com>
 * @license MIT
 * @see https://github.com/daredevel/jquery-tree
 * @version 0.1
 */
$.widget("daredevel.tree", {

    /**
     * Attach node li code under passed parent element at passed position
     *
     * @private
     *
     * @param li node to attach
     * @param parent element to attach node to (can be another node or widget base element)
     * @param position position of the node between brothers (expressed as positive integer)
     */
    _attachLi:function (li, parent, position) {

        var ul = parent.find('ul:first');

        if (ul.length) {
            if ((undefined == position) || (ul.children('li').length < position)) {
                ul.append(li);
            } else {
                if (position == 0) {
                    position = position + 1;
                }
                ul.children('li:nth-child(' + position + ')').before(li);
            }
        } else {
            ul = $('<ul/>');
            parent.append(ul.append(li));
        }

    },

    /**
     * Attach a node under passed parent (if no parent is passed, node is attached as root)
     *
     * @private
     *
     * @param li node to attach
     * @param parentLi node under which new node will be attached
     * @param position position of the node between brothers (expressed as positive integer)
     */
    _attachNode:function (li, parentLi, position) {

        if (undefined == parentLi) {

            var parent = this.options.core.element;

            this._attachLi(li, parent, position);

            //initialize nodes from core to call all components initialize methods
            this.options.core._initializeNode(li);

        } else {

            var parent = parentLi;

            this._attachLi(li, parent, position);

            parent.removeClass('leaf collapsed').addClass('expanded'); //@todo find right way to do this

            //initialize nodes from core to call all components initialize methods
            this.options.core._initializeNode(li);
            this.options.core._initializeNode(parent);
        }
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
    _buildNode:function (attributes) {

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
    _create:function () {

        var t = this;

        // add core widget to options so components can add methods
        this.options.core = this;

        // add jQueryUI css widget classes
        this.element.addClass('ui-widget ui-widget-content ' + this.widgetBaseClass);

        // initialize requested components
        this._initializeComponents();

        this.element.find('li').each(function () {
            t._initializeNode($(this));
        });

        if (this.options.nodes != null) {
            $.each(this.options.nodes, function (key, value) {
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
    _destroy:function () {
        $.Widget.prototype.destroy.call(this);
    },

    /**
     * Detach a node (actually don't delete it)
     *
     * @private
     *
     * @param li node to detach
     */
    _detachNode:function (li) {

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
    _initializeComponents:function () {
        for (var i in this.options.components) {
            var initializeComponent = 'element.tree' + this.options.components[i] + '(options);';
            run = new Function("options", "element", initializeComponent);
            run(this.options, this.element);
        }
    },

    /**
     * Initialize passed node
     *
     * @private
     *
     * @param li node to initialize
     */
    _initializeNode:function (li) {
        li.children('span:last').addClass(this.options.core.widgetBaseClass + '-label');

        // call each active component initialize method
        for (var i in this.options.components) {
            var componentInitializeNode = 't._tree' + this.options.components[i] + 'InitializeNode(li);';
            run = new Function("li", "t", componentInitializeNode);
            run(li, this);
        }
    },


    /**
     * Add a new node as children of passed one
     *
     * @public
     *
     * @param attributes new node attributes
     * @param parentLi node under which new node will be attached
     * @param position position of the node between brothers (expressed as positive integer)
     */
    addNode:function (attributes, parentLi, position) {

        var t = this;

        var li = this._buildNode(attributes);

        if ((undefined == parentLi) || 0 == parentLi.length) {
            this._attachNode($(li), undefined, position);
        } else {
            this._attachNode($(li), $(parentLi), position);
        }

        if (undefined != attributes.children) {
            $.each(attributes.children, function (value, key) {
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
    isRoot:function (li) {

        li = $(li);

        var parents = li.parentsUntil('.' + this.widgetBaseClass);

        return 1 == parents.length;
    },

    /**
     * Move a node under new parent
     *
     * @param li node to move
     * @param parentLi node under which node will be moved
     * @param position position of the node between brothers (expressed as positive integer)
     */
    moveNode:function (li, parentLi, position) {

        this._detachNode($(li));

        if ((undefined == parentLi) || 0 == parentLi.length) {
            this._attachNode($(li), undefined, position);
        } else {
            this._attachNode($(li), $(parentLi), position);
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
    parentNode:function (li) {
        return $(li).parents('li:first');
    },

    /**
     * Remove a node from tree (node is not actually delete, but still in memory)
     *
     * @param li node to delete (can be jQuery object or selector)
     */
    removeNode:function (li) {

        this._detachNode($(li));

        this._trigger('remove', true, $(li));

    },

    /**
     * Default options values.
     */
    options:{

        /**
         * Defines components to load.
         */
        components:[],

        /**
         * Defines default node attributes to use in node adding if different specified in addNode() method
         */
        defaultNodeAttributes:{
            span:{
                html:'new node'
            },
            li:{
                'class':'leaf' //@todo handle leaf class
            },
            input:{
                type:'checkbox'
            }
        },

        /**
         *
         */
        nodes:null

    }
});