/*global module:false*/
module.exports = function( grunt ) {

    var config = {
        root_src:           'src',
        root_public:        'public',
        dir_vendors:        'vendors',
        dir_js:             'js',
        dir_css:            'css',
        gruntfile:          'Gruntfile.js',
        pkgjson_file:       'package.json',
        bowerrc_file:       '.bowerrc',
        output_js_app:      false, //if null or false use package name and version
        output_js_vendors:  false  // if null or false use vendors.min
    };

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        config: config,
        pkg: grunt.file.readJSON( config.pkgjson_file ),
        bower: grunt.file.readJSON( config.bowerrc_file ),
        banner: '/*! <%= pkg.title %> - <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= pkg.license %> */\n',

        // Task configuration.
        jshint: {
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
        },

        bower_concat: {
            all: {
                dest: '<%= bower.directory %>/_bower.js',
                cssDest: '<%= bower.directory %>/_bower.css',
                exclude: [
                    'modernizr',
                    'almond',
                    'requirejs'
                ],
                dependencies: {
                    'underscore': 'jquery'/*,
                     'backbone': 'underscore',*/
                },
                includeDev: true,
                bowerOptions: {
                    relative: false
                },
                mainFiles: {
                }
            }
        },
        uglify: {
            app: {
                options: {
                  banner: '<%= banner %>'
                },
                files: {
                    '<%= config.root_public %>/<%= config.dir_js %>/<%= config.output_js_app || pkg.name + pkg.version %>.min.js': [
                        '<%= config.root_src %>/<%= config.dir_js %>/**/*.js'
                    ]
                }
            },
            vendors: {
                files: {
                    '<%= config.root_public %>/<%= config.dir_vendors %>/<%= config.output_js_vendors || \'vendors.min\'%>.js': [
                        '<%= bower.directory %>/_bower.js',
                        '<%= config.root_src %>/<%= config.dir_vendors %>/**/*.js',
                        '<%= bower.directory %>/almond/almond.js',
                        '<%= bower.directory %>/require/require.js'
                    ]
                }
            }
        },


        watch: {
            options: {
                forever: false
            },
            configs: {
                files: [
                    '<%= config.gruntfile %>'
                ],
                options: {
                    reload: true
                }
            },
            app: {
                files: '<%= config.root_src %>/<%= config.dir_js %>/**/*.js',
                tasks: ['uglify:app']
            },
            vendors: {
                files: [
                    '<%= bower.directory %>/**/*.js',
                    '!<%= bower.directory %>/_bower.js',
                    '<%= bower.directory %>/**/*.css',
                    '!<%= bower.directory %>/_bower.css',
                    '<%= config.root_src %>/<%= config.dir_vendors %>/**/*.js'
                ],
                tasks: ['bower_concat', 'uglify:vendors']
            }
        }
    });


    // These plugins provide necessary tasks.
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-jshint' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-bower-concat' );

    // Default task.
    grunt.registerTask( 'default' , [
        'jshint',
        'bower_concat',
        'uglify:vendors',
        'uglify:app'
    ]);

    // Developer task
    grunt.registerTask( 'dev', [
       'default',
        'watch'
    ]);

};