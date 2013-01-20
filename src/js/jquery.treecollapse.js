/*!
 * Tree - jQuery Tree Widget - collapse component
 * @author Valerio Galano <v.galano@daredevel.com>
 */
$.widget("daredevel.treecollapse", {

    /**
     * Initialize plugin
     *
     * @private
     */
    _createCollapsible:function () {

        var t = this

        // bind collapse/expand event
        this.element.find('li span.' + this.widgetBaseClass + '-anchor').live("click", function () {
            var li = t.options.core.parentNode($(this));

            if (li.hasClass('collapsed')) {
                t.expand(li);
            } else

            if (li.hasClass('expanded')) {
                t.collapse(li);
            }
        });

        // add public methods to core component
        this.options.core.collapse = function (li) {
            t.collapse(li);
        };
        this.options.core.collapseAll = function () {
            t.collapseAll();
        };
        this.options.core.expand = function (li) {
            t.expand(li);
        };
        this.options.core.expandAll = function () {
            t.expandAll();
        };

        // add private methods to core component
        this.options.core._treecollapseInitializeNode = function (li) {
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
    _initializeCollapsibleNode:function (li) {

        var t = this;

        // add anchor if needed
        var anchor = li.children('span.' + this.widgetBaseClass + '-anchor');
        if (anchor.length < 1) {
            li.prepend($('<span />', {
                'class':this.widgetBaseClass + '-anchor'
            }));
        }

        // initialize nodes
        // if is specified a state li element, consolidate it
        if (li.hasClass("leaf")) {
            t._markAsLeaf(li);
        } else
        if (li.hasClass("collapsed")) {
            t.collapse(li, false, true);
        } else
        if (li.hasClass("expanded")) {
            t.expand(li, false, true);
        } else

        // otherwise, guess state from tree structure
        if (li.is("li:not(:has(ul))")) {
            t._markAsLeaf(li);
        } else {
            t._markAsExpanded(li);
        }
    },

    /**
     * Mark node as collapsed
     *
     * @private
     *
     * @param li node to mark
     */
    _markAsCollapsed:function (li) {

        var anchor = li.children('span.' + this.widgetBaseClass + '-anchor');

        anchor.removeClass('ui-icon ' + this.options.expandUiIcon + ' ' + this.options.leafUiIcon);

        if (this.options.collapseUiIcon.length > 0) {
            anchor.addClass('ui-icon ' + this.options.collapseUiIcon)
        }

        li.removeClass("leaf").removeClass("expanded").addClass("collapsed");
    },

    /**
     * Mark node as expanded
     *
     * @private
     *
     * @param li node to mark
     */
    _markAsExpanded:function (li) {

        var anchor = li.children('span.' + this.widgetBaseClass + '-anchor');

        anchor.removeClass('ui-icon ' + this.options.collapseUiIcon + ' ' + this.options.leafUiIcon);

        if (this.options.expandUiIcon.length > 0) {
            anchor.addClass('ui-icon ' + this.options.expandUiIcon)
        }

        li.removeClass("leaf").removeClass("collapsed").addClass("expanded");
    },

    /**
     * Mark node as leaf
     *
     * @private
     *
     * @param li  node to mark
     */
    _markAsLeaf:function (li) {

        var anchor = li.children('span.' + this.widgetBaseClass + '-anchor');

        anchor.removeClass('ui-icon ' + this.options.collapseUiIcon + ' ' + this.options.expandUiIcon);

        if (this.options.leafUiIcon.length > 0) {
            anchor.addClass('ui-icon ' + this.options.leafUiIcon)
        }

        li.removeClass("collapsed").removeClass("expanded").addClass("leaf");
    },

    /**
     * Unmark node
     *
     * @param li  node to unmark
     */
    _unmark:function () {
        li.removeClass("collapsed expanded leaf");
    },

    /**
     * Collapse node
     *
     * @public
     *
     * @param li node to collapse
     * @param effect true if use effects
     * @param force true to collpase a node already marked as collapsed
     */
    collapse:function (li, effect, force) {

        li = $(li);

        if (force == undefined) {
            force = false;
        }

        if (!force && (li.hasClass('collapsed') || li.hasClass('leaf'))) {
            return;
        }

        if (effect == undefined) {
            effect = true;
        }

        var t = this;

        if (effect) {
            li.children("ul").hide(this.options.collapseEffect, {}, this.options.collapseDuration);

            setTimeout(function () {
                t._markAsCollapsed(li, t.options);
            }, t.options.collapseDuration);
        } else {
            li.children("ul").hide();
            t._markAsCollapsed(li, t.options);
        }
        t.options.core._trigger('collapse', true, li);
    },

    /**
     * Collapse all nodes of the tree
     *
     * @private
     */
    collapseAll:function () {
        var t = this;
        $(this.element).find('li.expanded').each(function () {
            t.collapse($(this));
        });
    },

    /**
     * Expand node
     *
     * @public
     *
     * @param li node to expand
     * @param effect true if use effects
     */
    expand:function (li, effect, force) {

        li = $(li);

        if (force == undefined) {
            force = false;
        }

        if (!force && (li.hasClass('expanded') || li.hasClass('leaf'))) {
            return;
        }

        if (effect == undefined) {
            effect = true;
        }

        var t = this;

        if (effect) {
            li.children("ul").show(t.options.expandEffect, {}, t.options.expandDuration);

            setTimeout(function () {
                t._markAsExpanded(li, t.options);
            }, t.options.expandDuration);
        } else {
            li.children("ul").show();
            t._markAsExpanded(li, t.options);
        }

        t.options.core._trigger('expand', true, li);
    },

    /**
     * Expand all nodes of the tree
     *
     * @public
     */
    expandAll:function () {
        var t = this;
        $(this.element).find('li.collapsed').each(function () {
            t.expand($(this));
        });
    },

    /**
     * Default options values
     */
    options:{

        collapsible: true,

        /**
         * Defines duration of collapse effect in ms.
         * Works only if collapseEffect is not null.
         */
        collapseDuration:500,

        /**
         * Defines the effect used for collapse node.
         */
        collapseEffect:'blind',

        /**
         * Defines jQueryUI icon class used for collapse anchor.
         */
        collapseUiIcon:'ui-icon-triangle-1-e',

        /**
         * Defines duration of expand effect in ms.
         * Works only if expandEffect is not null.
         */
        expandDuration:500,

        /**
         * Defines the effect used for expand node.
         */
        expandEffect:'blind',

        /**
         * Defines jQueryUI icon class used for expand anchor.
         */
        expandUiIcon:'ui-icon-triangle-1-se',

        /**
         * Defines jQueryUI icon class used for leaf anchor.
         */
        leafUiIcon:''

    }

});