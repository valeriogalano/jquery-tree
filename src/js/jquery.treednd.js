/*!
 * Tree - jQuery Tree Widget - drag and drop component
 * @author Valerio Galano <v.galano@daredevel.com>
 */
$.widget("daredevel.treednd", {

    /**
     * Initialize plugin
     *
     * @private
     */
    _createDnd:function () {

        var t = this;

        // add private methods to core component
        this.options.core._treedndInitializeNode = function (li) {
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
    _initializeDndNode:function (li) {

        var t = this;

        var span = $('<span/>', {
            'class':'prepended',
            html:'<br/>'
        }).droppable({
                hoverClass:'over',
                drop:function (event, ui) {

                    var li = $(this).closest('li');

                    // if node will be a root parent is undefined, else catch new parentLi
                    if (t.options.core.isRoot(li)) {
                        var parentLi = undefined;
                        var droppable = t.options.core.element;
                    } else {
                        var parentLi = li.parent().closest('li');
                        var droppable = parentLi;

                        // prevent loops
                        if ($(ui.draggable.parent('li')).find(parentLi).length) {
                            return;
                        }
                    }

                    var position = $($(this).parent('li')).index() + 1;

                    t.options.core.moveNode(ui.draggable.parent('li'), parentLi, position);
                    t._trigger('drop', event, {draggable:ui.draggable, droppable:parentLi});
                }
            });

        $(li).find('.' + this.options.core.widgetBaseClass + '-label:first').after(span);

        $(li).find('.' + this.options.core.widgetBaseClass + '-label:first').draggable({
            start:function (event, ui) {
                $(this).parent('li').find('ul, .prepended').css('visibility', 'hidden');
                $(this).parent('li').find('.droppable-label').css('display', 'none');
            },
            stop:function (event, ui) {
                $(this).parent('li').find('ul').css('visibility', 'visible');
                $(this).parent('li').find('.prepended').css('visibility', '');
                $(this).parent('li').find('.droppable-label').css('display', 'inherit');
            },
            revert:true,
            revertDuration:0
        });

        var span = $('<span/>', {
            'class':'droppable-label',
            html:'<br/>'
        }).droppable({
                drop:function (event, ui) {
                    var li = $(this).closest('li');

                    // prevent loops
                    if ($(ui.draggable.parent('li')).find(li).length) {
                        return;
                    }

                    t.options.core.moveNode(ui.draggable.parent('li'), li, 1);
                    t._trigger('drop', event, {draggable:ui.draggable, droppable:li});
                },
                over:function (event, ui) {
                    $(this).parent('li').find('.' + t.options.core.widgetBaseClass + '-label:first').addClass('ui-state-hover');
                },
                out:function (event, ui) {
                    $(this).parent('li').find('.' + t.options.core.widgetBaseClass + '-label:first').removeClass('ui-state-hover');
                }
            });

        $(li).find('.' + this.options.core.widgetBaseClass + '-label:first').after(span);

    },

    /**
     * Default options values.
     */
    options:{
        drop:function (event, element) {

        }
    }

});

/**
 * Patch for jQueryUI draggable
 *
 * @see http://bugs.jqueryui.com/ticket/3740
 */
$.ui.draggable.prototype._getRelativeOffset = function()
{
    if(this.cssPosition == "relative") {
        var p = this.element.position();
        return {
            top: p.top - (parseInt(this.helper.css("top"),10) || 0)/* + this.scrollParent.scrollTop()*/,
            left: p.left - (parseInt(this.helper.css("left"),10) || 0)/* + this.scrollParent.scrollLeft()*/
        };
    } else {
        return { top: 0, left: 0 };
    }
};