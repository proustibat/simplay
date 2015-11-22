'use strict';
module.exports = {
    options: {
        banner: '<%= banner %>'
    },
    app_production: {
        options: {
            mangle: true,
            sourceMap: false,
            preserveComments: false,
            compress: {
                drop_console: true,
                warnings: false,
                drop_debugger: true
            }
        },
        files: {
            '<%= config.root_public %>/<%= config.dir_js %>/<%= config.output_js_app || pkg.name + pkg.version %>.min.js': [
                '<%= config.root_src %>/<%= config.dir_js %>/**/*.js'
            ]
        }
    },
    app_development: {
        options: {
            banner: '',
            mangle: false,
            sourceMap: true,
            sourceMapIncludeSources: true,
            //sourceMapRoot: 'src',
            compress: false,
            beautify: true,
            preserveComments: 'all'
        },
        files: {
            '<%= config.root_public %>/<%= config.dir_js %>/<%= config.output_js_app || pkg.name + pkg.version %>.min.js': [
                '<%= config.root_src %>/<%= config.dir_js %>/**/*.js'
            ]
        }
    },
    vendors: {
        options: {
            banner: ''
        },
        files: {
            '<%= config.root_public %>/<%= config.dir_vendors %>/<%= config.output_js_vendors || \'vendors.min\'%>.js': [
                '<%= bower.directory %>/_bower.js',
                '<%= config.root_src %>/<%= config.dir_vendors %>/**/*.js'
            ]
        }
    }

};