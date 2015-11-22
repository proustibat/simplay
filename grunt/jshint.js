'use strict';
module.exports = {
    options: {
        reporter: require( 'jshint-stylish' ),
        debug: true,
        force: true,
        curly: true,
        eqeqeq: true,
        forin: true,
        freeze: true,
        futurehostile: true,
        latedef: true,
        maxdepth: 3,
        maxerr: 20,
        maxparams: 3,
        noarg: true,
        nocomma: true,
        nonbsp: true,
        nonew: true,
        unused: true,
        boss: true,
        eqnull: true,
        plusplus: true
        //undef: true,
        //globals: {
        //    devel: true,
        //    jQuery: false,
        //    requirejs: false
        //},
        //predef: ["require"],
    },
    files: [
        '<%= config.gruntfile %>',
        '<%= config.root_src %>/<%= config.dir_js %>/**/*.js'
    ]

};