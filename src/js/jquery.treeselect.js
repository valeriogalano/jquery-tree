/*!
 * Tree - jQuery Tree Widget - select component
 * @author Valerio Galano <v.galano@daredevel.com>
 */
$.widget("daredevel.treeselect", {

    /**
     * Initialize plugin
     *
     * @private
     */
    _create:function () {

        var t = this;

        var selector = '.' + this.options.core.widgetBaseClass + '-label:not(.' + this.options.selectUiClass + ')';

        this.element.find(selector).live('click', function () {
            t.select($(this).parent('li'));
        });

        // add public methods to core component
        this.options.core.deselect = function (li) {
            return t.deselect(li);
        };
        this.options.core.select = function (li) {
            return t.select(li);
        };
        this.options.core.selected = function () {
            return t.selected();
        };

        // add private methods to core component
        this.options.core._treeselectInitializeNode = function (li) {
            t._initializeNode(li);
        };
    },

    /**
     * Deselect a node
     *
     * @private
     *
     * @param li node
     */
    _deselect:function (li) {
        li.find('span.' + this.options.core.widgetBaseClass + '-label:first').removeClass(this.options.selectUiClass);
        this._trigger('deselect', true, li);
    },

    /**
     *
     */
    _destroy:function () {
        //@todo complete treeselect _destory method
    },

    /**
     * Initialize passed node
     *
     * @private
     *
     * @param li node to initialize
     */
    _initializeNode:function (li) {

    },

    /**
     * Select a node
     *
     * @private
     *
     * @param li node
     */
    _select:function (li) {

        li.find('span.' + this.options.core.widgetBaseClass + '-label:first').addClass(this.options.selectUiClass);

        this._trigger('select', true, li);
    },

    /**
     * Deselect node
     *
     * @public
     */
    deselect:function () {

        var t = this;

        this.element.find('.' + this.options.core.widgetBaseClass + '-label.' + this.options.selectUiClass).each(function () {
            t._deselect($(this).parent('li'));
        });
    },

    /**
     * Select a node
     *
     * @public
     *
     * @param li node
     */
    select:function (li) {

        li = $(li);

        var t = this;

        this.deselect();

        this._select(li);
    },

    /**
     * Return selected node
     *
     * @public
     *
     * @return li
     */
    selected:function () {
        var selected = this.element.find('.' + this.options.core.widgetBaseClass + '-label.' + this.options.selectUiClass);
        return $(selected).parent();
    },

    /**
     * Default options values.
     */
    options:{


        /**
         * Defines function to handle deselect event
         *
         * @param event
         * @param element
         */
        deselect:function (event, element) {
        },

        /**
         * Defines function to handle select event
         *
         * @param event
         * @param element
         */
        select:function (event, element) {
        },

        /**
         * Defines jQueryUI class used for selected labels.
         */
        selectUiClass:'ui-state-active'

    }

});