define('main',[
    'Application'
], function(Application){
    "use strict";

    $('h1').html( 'Hello World!' );
    var app = new Application();
    app.init( $('h2') );
});


$(document).ready(function() {
    require( ['main'] );
});
