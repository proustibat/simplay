'use strict';
module.exports = {
    options: {
        jshintrc: '.jshintrc',
        reporter: require( 'jshint-stylish' )
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