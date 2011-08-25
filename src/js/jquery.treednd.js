/*!
 * tree - jQuery Tree Plugin - drag and drop component
 *
 * @author Valerio Galano <v.galano@daredevel.com>
 *
 * @license MIT
 *
 * @see http://tree.daredevel.com
 */
$.widget("daredevel.treednd", {

    /**
     * Initialize plugin
     *
     * @private
     */
    _create: function() {

        var t = this;

        // add private methods to core component
        this.options.core._treedndInitializeNode = function(li) {
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

        $(li).find('.' + this.options.core.widgetBaseClass + '-label:first').draggable({
            start: function(event, ui) {
                $(this).parent('li').find('ul').css('visibility', 'hidden');
            },
            stop: function(event, ui) {
                $(this).parent('li').find('ul').css('visibility', 'visible');
            },
            revert: true,
            revertDuration: 0
        });

        $(li).find('.' + this.options.core.widgetBaseClass + '-label:first').droppable({
            hoverClass: "ui-state-hover",
            drop: function(event, ui) {
                var li = $(this).closest('li');

                // prevent loops
                if ($(ui.draggable.parent('li')).find(li).length) {
                    return;
                }

                t.options.core.moveNode(ui.draggable.parent('li'), li);
                t._trigger('drop', true, {draggable: ui.draggable, droppable: li});
            }
        });
    },

    /**
     * Default options values.
     */
    options: {

    }

});
