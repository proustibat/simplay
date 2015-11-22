define('Application',[

], function(){
    "use strict";
    var Application = function() {
        console.info('Application Loaded');
    };

    Application.prototype = {
        message: 'Hello Application !',
        element: null,
        init: function( element ) {
            this.element = element;
            this.element.html( this.message );
            var button = $('<button type="button">Click Me!</button>');
            $('body').append( button );
            $(button).on( "click", _.bind( this.onClick, this ) );
        },
        onClick: function( e ) {
            e.preventDefault();
            e.stopPropagation();
            this.element.css({
                color: '#'+((1<<24)*Math.random()|0).toString(16),
                backgroundColor: '#'+((1<<24)*Math.random()|0).toString(16)
            });
        }
    };
    return Application;
});
