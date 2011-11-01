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
     * Initialize plugin.
     *
     * @private
     *
     * @note Base tree structure must be something like this:
     *
     * <ul id="tree">
     *   <li id="node1" class="expanded"><input type="checkbox"><label>Node 1</label><span>Node 1</span>
     *     <ul>
     *       <li><input type="checkbox"><label>Node 1.1</label>
     *       <li><input type="checkbox"><label>Node 1.2</label>
     *     </ul>
     *   </li>
     * </ul>
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
     * Default options values.
     */
    options: {

        /**
         * Defines components to load.
         */
        components: []

    }
});