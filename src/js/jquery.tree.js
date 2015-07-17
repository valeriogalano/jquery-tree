/*!
 * Tree - jQuery Tree Widget
 * @author Valerio Galano <v.galano@daredevel.com>
 * @license MIT
 * @see https://github.com/daredevel/jquery-tree
 * @version 0.1
 */
(function ($, undefined) {
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
        _attachLi: function (li, parent, position) {

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
         * @param parentExpand boolean that specify if parens must be expandend after children was added
         */
        _attachNode: function (li, parentLi, position, parentExpand) {

            if (parentExpand == undefined) {
                parentExpand = true;
            }

            if (undefined == parentLi) {

                var parent = this.element;

                this._attachLi(li, parent, position);

                //initialize nodes from core to call all components initialize methods
                this._initNode(li);

            } else {

                var parent = parentLi;

                this._attachLi(li, parent, position);

                if (parentExpand) {
                    parent.removeClass('leaf collapsed').addClass('expanded'); //@todo find right way to do this
                } else {
                    parent.removeClass('leaf').addClass('collapsed');
                }

                //initialize nodes from core to call all components initialize methods
                this._initNode(li);
                this._initNode(parent);
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
        _buildNode: function (attributes) {

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
         *@todo fix doc
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
        _create: function () {

            var t = this;

            // add jQueryUI css widget classes
            this.element.addClass('ui-widget ui-widget-content daredevel-tree');

            // initialize requested features
            if (this.options.checkbox) {
                this._initCheckboxTree();
            }
            if (this.options.collapsible) {
                this._initCollapsibleTree();
            }
            if (this.options.dnd) {
                this._initDndTree();
            }
            if (this.options.selectable) {
                this._initSelectableTree();
            }
            if (this.options.lazyLoading) {
                this._initLazyTree();
            }

            this.element.find('li').each(function () {
                t._initNode($(this));
            });

            // initialize object passed nodes
            if ((this.options.nodes != null) && (this.options.nodes instanceof Object)) {
                t._initFromObject(this.options.nodes);
            }

            // initialize ajax nodes
            if ((this.options.nodesInitUrl != null)) {
                t._initFromAjax(this.options.nodesInitUrl);
            }
        },

        /**
         * Destroy plugin
         *
         * @private
         *
         * @todo complete destroy method
         */
        _destroy: function () {
            $.Widget.prototype.destroy.call(this);
        },

        /**
         * Detach a node (actually don't delete it)
         *
         * @private
         *
         * @param li node to detach
         */
        _detachNode: function (li) {

            var parentLi = this.parentNode(li);

            var ul = parentLi.find('ul:first');

            if (ul.children().length == 1) {
                ul.detach();
                parentLi.removeClass('collapsed expanded').addClass('leaf') //@todo find right way to do this
            } else {
                li.detach();
            }

            //initialize node from core to call all components initialize methods
            this._initNode(parentLi);
        },

        /**
         * Initialize passed node
         *
         * @private
         *
         * @param li node to initialize
         */
        _initNode: function (li) {
            li.children('span:last').addClass('daredevel-tree-label');

            if (this.options.checkbox) {
                this._initCheckboxNode(li);
            }
            if (this.options.collapsible) {
                this._initCollapsibleNode(li);
            }
            if (this.options.dnd) {
                this._initDndNode(li);
            }
            if (this.options.selectable) {
                this._initSelectableNode(li);
            }
            if (this.options.lazyLoading) {
                this._initLazyNode(li);
            }
        },

        /**
         * Add nodes to tree using data contained in passed object
         *
         * @param nodesObject
         *
         * @private
         */
        _initFromObject: function (nodesObject) {
            var t = this;

            $.each(nodesObject, function (key, value) {
                t.addNode(value);
            });
        },

        /**
         * Add a new node as children of passed one
         *
         * @public
         *
         * @param attributes new node attributes
         * @param parentLi node under which new node will be attached
         * @param position position of the node between brothers (expressed as positive integer)
         * @param parentExpand boolean that specify if parens must be expandend after children was added
         */
        addNode: function (attributes, parentLi, position, parentExpand) {

            var t = this;

            var li = this._buildNode(attributes);

            if ((undefined == parentLi) || 0 == parentLi.length) {
                this._attachNode($(li), undefined, position, false);
            } else {
                this._attachNode($(li), $(parentLi), position, parentExpand);
            }

            if (undefined != attributes.children) {
                $.each(attributes.children, function (key, value) {
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
        isRoot: function (li) {

            li = $(li);

            var parents = li.parentsUntil('.daredevel-tree');

            return 1 == parents.length;
        },

        /**
         * Move a node under new parent
         *
         * @public
         *
         * @param li node to move
         * @param parentLi node under which node will be moved
         * @param position position of the node between brothers (expressed as positive integer)
         */
        moveNode: function (li, parentLi, position) {

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
        parentNode: function (li) {
            return $(li).parents('li:first');
        },

        /**
         * Remove a node from tree (node is not actually delete, but still in memory)
         *
         * @public
         *
         * @param li node to delete (can be jQuery object or selector)
         */
        removeNode: function (li) {

            this._detachNode($(li));

            this._trigger('remove', true, $(li));

        },

        /**
         * Check if all descendant of passed node are checked
         *
         * @private
         * @param li node
         * @return true if all descendant checked
         */
        _allDescendantChecked: function (li) {
            return (li.find('li input:checkbox:not(:checked)').length == 0);
        },

        /**
         * Check ancestors on passed node
         *
         * Don't use check() method because we won't trigger onCheck events
         *
         * @private
         * @param li node
         */
        _checkAncestors: function (li) {
            li.parentsUntil('daredevel-tree').filter('li').find('input:checkbox:first:not(:checked)').prop('checked', true).change();
        },

        /**
         * Check descendants on passed node
         *
         * Don't use check() method because we won't trigger onCheck events
         *
         * @private
         * @param li node
         */
        _checkDescendants: function (li) {
            li.find('li input:checkbox:not(:checked)').prop('checked', true).change();
        },

        /**
         * Check nodes that are neither ancestors or descendants of passed node
         *
         * Don't use check() method because we won't trigger onCheck events
         *
         * @private
         * @param li node
         */
        _checkOthers: function (li) {
            var t = this;
            li.addClass('exclude');
            li.parents('li').addClass('exclude');
            li.find('li').addClass('exclude');
            $(this.element).find('li').each(function () {
                if (!$(this).hasClass('exclude')) {
                    $(this).find('input:checkbox:first:not(:checked)').prop('checked', true).change();
                }
            });
            $(this.element).find('li').removeClass('exclude');
        },

        /**
         * Initialize tree's nodes to add checkbox features.
         *
         * @private
         */
        _initCheckboxTree: function () {

            var t = this;

            // bind node uncheck event
            this.element.on('click', 'input:checkbox:not(:checked)', function () {
                t.uncheck(t.parentNode($(this)));
            });

            // bind node check event
            this.element.on('click', 'input:checkbox:checked', function () {
                t.check(t.parentNode($(this)));
            });

            // bind collapse on uncheck event
            if (this.options.onUncheck.node == 'collapse') {
                this.element.on("click", 'input:checkbox:not(:checked)', function () {
                    t.collapse(t.parentNode($(this)));
                });
            } else

            // bind expand on uncheck event
            if (this.options.onUncheck.node == 'expand') {
                this.element.on("click", 'input:checkbox:not(:checked)', function () {
                    t.expand(t.parentNode($(this)));
                });
            }

            // bind collapse on check event
            if (this.options.onCheck.node == 'collapse') {
                this.element.on("click", 'input:checkbox:checked', function () {
                    t.collapse(t.parentNode($(this)));
                });
            } else

            // bind expand on check event
            if (this.options.onCheck.node == 'expand') {
                this.element.on("click", 'input:checkbox:checked', function () {
                    t.expand(t.parentNode($(this)));
                });
            }
        },

        /**
         * Initialize passed node to add checkbox features
         *
         * @private
         * @param li node to initialize
         */
        _initCheckboxNode: function (li) {

        },

        /**
         * Uncheck ancestors of passed node
         *
         * Don't use uncheck() method because we won't trigger onUncheck events
         *
         * @private
         * @param li node
         */
        _uncheckAncestors: function (li) {
            li.parentsUntil('daredevel-tree').filter('li').find('input:checkbox:first:checked').prop('checked', false).change();
        },

        /**
         * Uncheck descendants of passed node
         *
         * Don't use uncheck() method because we won't trigger onUncheck events
         *
         * @private
         * @param li node
         */
        _uncheckDescendants: function (li) {
            li.find('li input:checkbox:checked').prop('checked', false).change();
        },

        /**
         * Uncheck nodes that are neither ancestors or descendants of passed node
         *
         * Don't use uncheck() method because we won't trigger onUncheck events
         *
         * @private
         * @param li node
         */
        _uncheckOthers: function (li) {
            var t = this;
            li.addClass('exclude');
            li.parents('li').addClass('exclude');
            li.find('li').addClass('exclude');
            $(this.element).find('li').each(function () {
                if (!$(this).hasClass('exclude')) {
                    $(this).find('input:checkbox:first:checked').prop('checked', false).change();
                }
            });
            $(this.element).find('li').removeClass('exclude');
        },

        /**
         * Check node
         *
         * @public
         * @param li node to check
         */
        check: function (li) {

            li = $(li);

            li.find('input:checkbox:first:not(:checked)').prop('checked', true).change();

            // handle others
            if (this.options.onCheck.others == 'check') {
                this._checkOthers(li);
            } else if (this.options.onCheck.others == 'uncheck') {
                this._uncheckOthers(li);
            }

            // handle descendants
            if (this.options.onCheck.descendants == 'check') {
                this._checkDescendants(li);
            } else if (this.options.onCheck.descendants == 'uncheck') {
                this._uncheckDescendants(li);
            }

            // handle ancestors
            if (this.options.onCheck.ancestors == 'check') {
                this._checkAncestors(li);
            } else if (this.options.onCheck.ancestors == 'uncheck') {
                this._uncheckAncestors(li);
            } else if (this.options.onCheck.ancestors == 'checkIfFull') {
                var isRoot = this.isRoot(li);
                var allDescendantChecked = this._allDescendantChecked(this.parentNode(li));
                if (!isRoot && allDescendantChecked) {
                    this.check(this.parentNode(li));
                }
            }
        },

        /**
         * Check all tree elements
         *
         * Don't use check() method so it won't trigger onCheck events
         *
         * @public
         */
        checkAll: function () {
            $(this.element).find('input:checkbox:not(:checked)').prop('checked', true).change();
        },

        /**
         * Uncheck node
         *
         * @public
         * @param li node to uncheck
         */
        uncheck: function (li) {

            li = $(li);

            li.find('input:checkbox:first:checked').prop('checked', false).change();

            // handle others
            if (this.options.onUncheck.others == 'check') {
                this._checkOthers(li);
            } else if (this.options.onUncheck.others == 'uncheck') {
                this._uncheckOthers(li);
            }

            // handle descendants
            if (this.options.onUncheck.descendants == 'check') {
                this._checkDescendants(li);
            } else if (this.options.onUncheck.descendants == 'uncheck') {
                this._uncheckDescendants(li);
            }

            // handle ancestors
            if (this.options.onUncheck.ancestors == 'check') {
                this._checkAncestors(li);
            } else if (this.options.onUncheck.ancestors == 'uncheck') {
                this._uncheckAncestors(li);
            }

        },

        /**
         * Uncheck all tree elements
         *
         * Don't use uncheck() method so it won't trigger onUncheck events
         *
         * @public
         */
        uncheckAll: function () {
            $(this.element).find('input:checkbox:checked').prop('checked', false).change();
        },

        /**
         * Initialize tree's nodes to add collapse features.
         *
         * @private
         */
        _initCollapsibleTree: function () {

            var t = this

            // bind collapse/expand event
            this.element.on("click", 'li span.daredevel-tree-anchor', function () {
                var li = t.parentNode($(this));

                if (li.hasClass('collapsed')) {
                    t.expand(li);
                } else if (li.hasClass('expanded')) {
                    t.collapse(li);
                }
            });
        },

        /**
         * Initialize passed node to add collapse features.
         *
         * @private
         *
         * @param li node to initialize
         */
        _initCollapsibleNode: function (li) {

            var t = this;

            // add anchor if needed
            var anchor = li.children('span.daredevel-tree-anchor');
            if (anchor.length < 1) {
                li.prepend($('<span />', {
                    'class': 'daredevel-tree-anchor'
                }));
            }

            // initialize nodes
            // if is specified a state li element, consolidate it
            if (li.hasClass("leaf")) {
                t._markAsLeaf(li);
            } else if (li.hasClass("collapsed")) {
                t.collapse(li, false, true);
            } else if (li.hasClass("expanded")) {
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
        _markAsCollapsed: function (li) {

            var anchor = li.children('span.daredevel-tree-anchor');

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
        _markAsExpanded: function (li) {

            var anchor = li.children('span.daredevel-tree-anchor');

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
        _markAsLeaf: function (li) {

            var anchor = li.children('span.daredevel-tree-anchor');

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
         * @private
         */
        _unmark: function () {
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
        collapse: function (li, effect, force) {

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
            t._trigger('collapse', true, li);
        },

        /**
         * Collapse all nodes of the tree
         *
         * @private
         */
        collapseAll: function () {
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
         * @param force specify if script must try to expand a just expanded node
         */
        expand: function (li, effect, force) {

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

            t._trigger('preexpand', true, li);

            if (effect) {
                li.children("ul").show(t.options.expandEffect, {}, t.options.expandDuration);

                setTimeout(function () {
                    t._markAsExpanded(li, t.options);
                }, t.options.expandDuration);
            } else {
                li.children("ul").show();
                t._markAsExpanded(li, t.options);
            }

            t._trigger('expand', true, li);
        },

        /**
         * Expand all nodes of the tree
         *
         * @public
         */
        expandAll: function () {
            var t = this;
            $(this.element).find('li.collapsed').each(function () {
                t.expand($(this));
            });
        },

        /**
         * Initialize tree's nodes to add dnd features.
         *
         * @private
         */
        _initDndTree: function () {

        },

        /**
         * Initialize passed node to add dnd features.
         *
         * @private
         *
         * @param li node to initialize
         */
        _initDndNode: function (li) {

            var t = this;

            var span = $('<span/>', {
                'class': 'prepended',
                html: '<br/>'
            }).droppable({
                hoverClass: 'over',
                drop: function (event, ui) {

                    var li = $(this).closest('li');

                    // if node will be a root parent is undefined, else catch new parentLi
                    if (t.isRoot(li)) {
                        var parentLi = undefined;
                        var droppable = t.element;
                    } else {
                        var parentLi = li.parent().closest('li');
                        var droppable = parentLi;

                        // prevent loops
                        if ($(ui.draggable.parent('li')).find(parentLi).length) {
                            return;
                        }
                    }

                    var position = $($(this).parent('li')).index() + 1;

                    t.moveNode(ui.draggable.parent('li'), parentLi, position);
                    t._trigger('drop', event, {draggable: ui.draggable, droppable: parentLi});
                }
            });

            $(li).find('.daredevel-tree-label:first').after(span);

            $(li).find('.daredevel-tree-label:first').draggable({
                start: function (event, ui) {
                    $(this).parent('li').find('ul, .prepended').css('visibility', 'hidden');
                    $(this).parent('li').find('.droppable-label').css('display', 'none');
                },
                stop: function (event, ui) {
                    $(this).parent('li').find('ul').css('visibility', 'visible');
                    $(this).parent('li').find('.prepended').css('visibility', '');
                    $(this).parent('li').find('.droppable-label').css('display', 'inherit');
                },
                revert: true,
                revertDuration: 0
            });

            var span = $('<span/>', {
                'class': 'droppable-label',
                html: '<br/>'
            }).droppable({
                drop: function (event, ui) {
                    var li = $(this).closest('li');

                    // prevent loops
                    if ($(ui.draggable.parent('li')).find(li).length) {
                        return;
                    }

                    t.moveNode(ui.draggable.parent('li'), li, 1);
                    t._trigger('drop', event, {draggable: ui.draggable, droppable: li});
                },
                over: function (event, ui) {
                    $(this).parent('li').find('.daredevel-tree-label:first').addClass('ui-state-hover');
                },
                out: function (event, ui) {
                    $(this).parent('li').find('.daredevel-tree-label:first').removeClass('ui-state-hover');
                }
            });

            $(li).find('.daredevel-tree-label:first').after(span);

        },

        /**
         * Initialize tree's nodes to add select features.
         *
         * @private
         */
        _initSelectableTree: function () {
            var t = this;

            this.element.on("click", '.daredevel-tree-label', function () {
                var li = $(this);
                if (li.hasClass(t.options.selectUiClass)) {
                    t.deselect($(this).parent(li));
                } else {
                    t.select($(this).parent('li'));
                }
            });
        },

        /**
         * Deselect a node
         *
         * @private
         *
         * @param li node
         */
        _deselect: function (li) {
            li.find('span.daredevel-tree-label:first').removeClass(this.options.selectUiClass);
            this._trigger('deselect', true, li);
        },

        /**
         * Deselect all selected nodes
         *
         * @private
         */
        _deselectAll: function () {
            var t = this;
            this.element.find('.daredevel-tree-label.' + this.options.selectUiClass).each(function () {
                t._deselect($(this).parent('li'));
            });
        },

        /**
         * @private
         */
        _destroySelectable: function () {
            //@todo complete treeselect _destory method
        },

        /**
         * Initialize passed node to add select feature.
         *
         * @private
         *
         * @param li node to initialize
         */
        _initSelectableNode: function (li) {

        },

        /**
         * Select a node
         *
         * @private
         *
         * @param li node
         */
        _select: function (li) {
            li.find('span.daredevel-tree-label:first').addClass(this.options.selectUiClass);
            this._trigger('select', true, li);
        },

        /**
         * Deselect node
         *
         * @public
         */
        deselect: function (li) {
            li = $(li);
            this._deselect(li);
        },

        /**
         * Select a node
         *
         * @public
         *
         * @param li node
         */
        select: function (li) {
            li = $(li);

            if (this.options.selectUnique) {
                this._deselectAll();
            }

            this._select(li);
        },

        /**
         * Return selected node
         *
         * @public
         *
         * @return li
         */
        selected: function () {
            var selected = this.element.find('.daredevel-tree-label.' + this.options.selectUiClass);
            return $(selected).parent();
        },

        /**
         * Initialize tree's nodes to add lazy loading features.
         *
         * @private
         */
        _initLazyTree: function () {
            var t = this;

            // bind lazy loading on expand event
            if (this.options.lazyLoading) {

                t.element.on("treepreexpand", function (event, element) {
                    var li = $(this);
                    if ($(element).find('ul').length) {
                        return;
                    }
                    t._lazyAdd(t.options.nodesLazyUrl, $(element));
                });
            }
            /*
             // bind edit on drop event
             if (this.options.dataEditUrl) {
             this.element.bind("treemove", function (event, element) {
             // @todo: test if parent is not changed
             t._notifyMove($(element));
             });
             }*/
        },

        /**
         * Initialize passed node to add lazy loading feature.
         *
         * @private
         *
         * @param li node to initialize
         */
        _initLazyNode: function (li) {

        },

        /**
         * Fetch tree via ajax.
         *
         * @private
         */
        _initFromAjax: function (urlString) {
            var t = this;

            $.ajax({
                url: urlString,
                dataType: 'json',
                beforeSend: function () {

                },
                complete: function () {

                },
                data: {},
                success: function (data) {
                    $.each(data.nodes, function (key, value) {
                        t.addNode(value);
                    });
                }
            });
        },

        /**
         * Fetch node's children via ajax.
         *
         * @private
         *
         * @param parentLi node of which we want children
         */
        _lazyAdd: function (urlString, parentLi) {
            var t = this;

            $.ajax({
                async:false,
                url: urlString,
                dataType: 'json',
                data: {
                    node: parentLi.attr('id')
                },
                success: function (data) {

                    $.each(data.nodes, function (key, value) {
                        t.addNode(value, parentLi, undefined, false);
                    });
                }
            });
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
                    'class': 'leaf' //@todo handle leaf class
                },
                input: {
                    type: 'checkbox'
                }
            },

            /**
             * Defines nodes to create at widget initialization. It's something like following:
             *
             * var obj =
             * [
             *     {
             *         children: [
             *             {},
             *             {}
             *         ]
             *     },
             *     {
             *
             *     }
             * ]
             *
             * @todo complete doc
             */
            nodes: null,

            /**
             * Defines if tree nodes will have a checkbox field
             */
            checkbox: true,

            /**
             * Defines which actions trigger when a node is checked.
             * Actions are triggered in the following order:
             * 1) others
             * 2) descendants
             * 3) ancestors
             */
            onCheck: {

                /**
                 * Available values: null, 'check', 'uncheck', 'checkIfFull'.
                 */
                ancestors: 'check',

                /**
                 * Available values: null, 'check', 'uncheck'.
                 */
                descendants: 'check',

                /**
                 * Available values: null, 'collapse', 'expand'.
                 */
                node: '', //@todo missing order

                /**
                 * Available values: null, 'check', 'uncheck'.
                 */
                others: ''
            },

            /**
             * Defines which actions trigger when a node is unchecked.
             * Actions are triggered in the following order:
             * 1) others
             * 2) descendants
             * 3) ancestors
             */
            onUncheck: {

                /**
                 * Available values: null, 'check', 'uncheck'.
                 */
                ancestors: '',

                /**
                 * Available values: null, 'check', 'uncheck'.
                 */
                descendants: 'uncheck',

                /**
                 * Available values: null, 'collapse', 'expand'.
                 */
                node: '', //@todo missing order

                /**
                 * Available values: null, 'check', 'uncheck'.
                 */
                others: ''
            },

            /**
             * Define if tree nodes can be collapsed
             */
            collapsible: true,

            /**
             * Defines duration of collapse effect in ms.
             * Works only if collapseEffect is not null.
             */
            collapseDuration: 500,

            /**
             * Defines the effect used for collapse node.
             */
            collapseEffect: 'blind',

            /**
             * Defines jQueryUI icon class used for collapse anchor.
             */
            collapseUiIcon: 'ui-icon-triangle-1-e',

            /**
             * Defines duration of expand effect in ms.
             * Works only if expandEffect is not null.
             */
            expandDuration: 500,

            /**
             * Defines the effect used for expand node.
             */
            expandEffect: 'blind',

            /**
             * Defines jQueryUI icon class used for expand anchor.
             */
            expandUiIcon: 'ui-icon-triangle-1-se',

            /**
             * Defines jQueryUI icon class used for leaf anchor.
             */
            leafUiIcon: '',

            /**
             * Define if tree has drag and drop for nodes.
             */
            dnd: true,

            /**
             * Defines function to handle drop event.
             *
             * @param event
             * @param element
             */
            drop: function (event, element) {
            },

            /**
             * Defines if tree nodes are selectable.
             */
            selectable: true,

            /**
             * Defines function to handle deselect event.
             *
             * @param event
             * @param element
             */
            deselect: function (event, element) {
            },

            /**
             * Defines jQueryUI class used for selected labels.
             */
            selectUiClass: 'ui-state-active',

            /**
             * Define if can be selected only one node at a time.
             */
            selectUnique: true,

            /**
             * Defines function to handle select event.
             *
             * @param event
             * @param element
             */
            select: function (event, element) {
            },

            /**
             * Defines if tree handle nodes lazy loading.
             */
            lazyLoading: false,

            /**
             * Defines url to request when tree modify operations happens.
             *
             * Server should return a null value if OK or an object like following:
             * {
             *     error: "there was an error saving ..."
             * }
             * The error string will be shown to user.
             */
            dataEditUrl: '',

            /**
             * Defines url to request to get tree nodes at widget initialization.
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
            nodesInitUrl: '',

            /**
             * Defines url to request to get tree nodes for lazy loading.
             *
             * @see nodesInitUrl for object structure definition.
             */
            nodesLazyUrl: ''
        }
    });

})(jQuery);
