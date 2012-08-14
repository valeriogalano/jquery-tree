/*!
 * Tree - jQuery Tree Widget - context menu component
 * @author Valerio Galano <v.galano@daredevel.com>
 */
$.widget("daredevel.treecontextmenu", {

    /**
     *
     */
    _buildMenu:function () {

        var t = this;

        $('.' + this.options.core.widgetBaseClass + '-contextmenu').remove();
        var ul = $('<ul/>', {
            'class':this.options.core.widgetBaseClass + '-contextmenu'
        });

        var li;
        $.each(this.options.contextmenuItems, function (key, value) {
            li = t._buildMenuItem(value);
            ul.append(li);
        });

        ul.hide().appendTo(document.body);
    },

    _buildMenuItem:function (item) {
        var a = $('<a/>', {
            'html':item.html,
            'href':item.href
        }).bind('click', item.onClick);

        var li = $('<li/>', {

        });
        return li.append(a);
    },

    /**
     *
     */
    _closeMenu:function () {
        $('.' + this.options.core.widgetBaseClass + '-contextmenu').remove();
    },

    /**
     * Initialize plugin
     *
     * @private
     */
    _create:function () {

        var t = this;

        this.element.find('.' + this.options.core.widgetBaseClass + '-label').live('contextmenu', function (e) {
            t.options.core.select($(this).parent('li'));
            t._openMenu(e);
            return false;
        });

        // add public methods to core component

        // add private methods to core component
        this.options.core._treecontextmenuInitializeNode = function (li) {
            t._initializeNode(li);
        };
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
     *
     */
    _openMenu:function (e) {
        var t = this;

        this._buildMenu();

        $('.' + this.options.core.widgetBaseClass + '-contextmenu').css({left:e.pageX, top:e.pageY}).show();
        $('body :not(.' + this.options.core.widgetBaseClass + '-contextmenu li span)').bind('click', function () {
            t._closeMenu();
        });
    },

    /**
     * Default options values.
     */
    options:{

        /**
         *
         */
        'contextmenuItems':[
            {
                'html':'move as root',
                'href':'javascript:void(0);',
                'onClick':function (event, element) {
                    $(this.options.core.element).tree('moveNode', $('.' + this.options.core.widgetBaseClass).selected(), this.options.core.element);
                }
            },
            {
                'html':'cut',
                'href':'javascript:void(0);',
                'onClick':function (event, element) {
                    alert('this will cut ' + $('.' + this.options.core.widgetBaseClass).selected());
                }
            },
            {
                'html':'copy',
                'href':'javascript:void(0);',
                'onClick':function (event, element) {
                    alert('a');
                }
            },
            {
                'html':'paste',
                'href':'javascript:void(0);',
                'onClick':function (event, element) {
                    alert('b');
                }
            }
        ]
    }

});