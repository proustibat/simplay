'use strict';
module.exports = {
    all: {
        dest: '<%= bower.directory %>/_bower.js',
        cssDest: '<%= bower.directory %>/_bower.css',
        exclude: [
            'modernizr',
            'requirejs' // will be loaded with almond
        ],
        dependencies: {
            'underscore': 'jquery'/*,
             'backbone': 'underscore',*/
        },
        includeDev: true,
        bowerOptions: {
            relative: false
        },
        mainFiles: {}
    }
};