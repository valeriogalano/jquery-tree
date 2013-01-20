/*!
 * Tree - jQuery Tree Widget - checkbox component
 * @author Valerio Galano <v.galano@daredevel.com>
 */
$.widget("daredevel.treecheckbox", {

    /**
     * Check if all descendant of passed node are checked
     *
     * @private
     * @param li node
     * @return true if all descendant checked
     */
    _allDescendantChecked:function (li) {
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
    _checkAncestors:function (li) {
        li.parentsUntil(this.options.core.widgetBaseClass).filter('li').find('input:checkbox:first:not(:checked)').prop('checked', true).change();
    },

    /**
     * Check descendants on passed node
     *
     * Don't use check() method because we won't trigger onCheck events
     *
     * @private
     * @param li node
     */
    _checkDescendants:function (li) {
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
    _checkOthers:function (li) {
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
     * Initialize plugin.
     *
     * @private
     */
    _createCheckbox:function () {

        var t = this;

        // bind node uncheck event
        this.element.find('input:checkbox:not(:checked)').live('click', function () {
            t.uncheck(t.options.core.parentNode($(this)));
        });

        // bind node check event
        this.element.find('input:checkbox:checked').live('click', function () {
            t.check(t.options.core.parentNode($(this)));
        });

        // bind collapse on uncheck event
        if (this.options.onUncheck.node == 'collapse') {
            this.element.find('input:checkbox:not(:checked)').live("click", function () {
                t.options.core.collapse(t.options.core.parentNode($(this)));
            });
        } else

        // bind expand on uncheck event
        if (this.options.onUncheck.node == 'expand') {
            this.element.find('input:checkbox:not(:checked)').live("click", function () {
                t.options.core.expand(t.options.core.parentNode($(this)));
            });
        }

        // bind collapse on check event
        if (this.options.onCheck.node == 'collapse') {
            this.element.find('input:checkbox:checked').live("click", function () {
                t.options.core.collapse(t.options.core.parentNode($(this)));
            });
        } else

        // bind expand on check event
        if (this.options.onCheck.node == 'expand') {
            this.element.find('input:checkbox:checked').live("click", function () {
                t.options.core.expand(t.options.core.parentNode($(this)));
            });
        }

        // add public methods to core component
        this.options.core.check = function (li) {
            t.check(li);
        };
        this.options.core.checkAll = function () {
            t.checkAll();
        };
        this.options.core.uncheck = function (li) {
            t.uncheck(li);
        };
        this.options.core.uncheckAll = function () {
            t.uncheckAll();
        };

        // add private methods to core component
        this.options.core._treecheckboxInitializeNode = function (li) {
            t._initializeNode(li);
        };
    },

    /**
     * Initialize passed node
     *
     * @private
     * @param li node to initialize
     */
    _initializeCheckboxNode:function (li) {

    },

    /**
     * Uncheck ancestors of passed node
     *
     * Don't use uncheck() method because we won't trigger onUncheck events
     *
     * @private
     * @param li node
     */
    _uncheckAncestors:function (li) {
        li.parentsUntil(this.options.core.widgetBaseClass).filter('li').find('input:checkbox:first:checked').prop('checked', false).change();
    },

    /**
     * Uncheck descendants of passed node
     *
     * Don't use uncheck() method because we won't trigger onUncheck events
     *
     * @private
     * @param li node
     */
    _uncheckDescendants:function (li) {
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
    _uncheckOthers:function (li) {
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
    check:function (li) {

        li = $(li);

        li.find('input:checkbox:first:not(:checked)').prop('checked', true).change();

        // handle others
        if (this.options.onCheck.others == 'check') {
            this._checkOthers(li);
        } else

        if (this.options.onCheck.others == 'uncheck') {
            this._uncheckOthers(li);
        }

        // handle descendants
        if (this.options.onCheck.descendants == 'check') {
            this._checkDescendants(li);
        } else

        if (this.options.onCheck.descendants == 'uncheck') {
            this._uncheckDescendants(li);
        }

        // handle ancestors
        if (this.options.onCheck.ancestors == 'check') {
            this._checkAncestors(li);
        } else

        if (this.options.onCheck.ancestors == 'uncheck') {
            this._uncheckAncestors(li);
        } else

        if (this.options.onCheck.ancestors == 'checkIfFull') {
            var isRoot = this.options.core.isRoot(li);
            var allDescendantChecked = this._allDescendantChecked(this.options.core.parentNode(li));
            if (!isRoot && allDescendantChecked) {
                this.check(this.options.core.parentNode(li));
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
    checkAll:function () {
        $(this.element).find('input:checkbox:not(:checked)').prop('checked', true).change();
    },

    /**
     * Uncheck node
     *
     * @public
     * @param li node to uncheck
     */
    uncheck:function (li) {

        li = $(li);

        li.find('input:checkbox:first:checked').prop('checked', false).change();

        // handle others
        if (this.options.onUncheck.others == 'check') {
            this._checkOthers(li);
        } else

        if (this.options.onUncheck.others == 'uncheck') {
            this._uncheckOthers(li);
        }

        // handle descendants
        if (this.options.onUncheck.descendants == 'check') {
            this._checkDescendants(li);
        } else

        if (this.options.onUncheck.descendants == 'uncheck') {
            this._uncheckDescendants(li);
        }

        // handle ancestors
        if (this.options.onUncheck.ancestors == 'check') {
            this._checkAncestors(li);
        } else

        if (this.options.onUncheck.ancestors == 'uncheck') {
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
    uncheckAll:function () {
        $(this.element).find('input:checkbox:checked').prop('checked', false).change();
    },

    /**
     * Default options values.
     */
    options:{

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
        onCheck:{

            /**
             * Available values: null, 'check', 'uncheck', 'checkIfFull'.
             */
            ancestors:'check',

            /**
             * Available values: null, 'check', 'uncheck'.
             */
            descendants:'check',

            /**
             * Available values: null, 'collapse', 'expand'.
             */
            node:'', //@todo missing order

            /**
             * Available values: null, 'check', 'uncheck'.
             */
            others:''
        },

        /**
         * Defines which actions trigger when a node is unchecked.
         * Actions are triggered in the following order:
         * 1) others
         * 2) descendants
         * 3) ancestors
         */
        onUncheck:{

            /**
             * Available values: null, 'check', 'uncheck'.
             */
            ancestors:'',

            /**
             * Available values: null, 'check', 'uncheck'.
             */
            descendants:'uncheck',

            /**
             * Available values: null, 'collapse', 'expand'.
             */
            node:'', //@todo missing order

            /**
             * Available values: null, 'check', 'uncheck'.
             */
            others:''
        }

    }
});