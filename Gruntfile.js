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

    // Measures the time each task takes
    require('time-grunt')(grunt);

    // CONFIGURATION =============================/
    grunt.initConfig({
        // Metadata.
        config: config,
        pkg: grunt.file.readJSON( config.pkgjson_file ),
        bower: grunt.file.readJSON( config.bowerrc_file ),
        //bowerjson: grunt.file.readJSON( bower.json ),
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
                mainFiles: {
                }
            }
        },
        uglify: {
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
                tasks: ['newer:uglify:app_development']
            },
            vendors: {
                files: [
                    '<%= bower.directory %>/**/*.js',
                    '!<%= bower.directory %>/_bower.js',
                    '<%= bower.directory %>/**/*.css',
                    '!<%= bower.directory %>/_bower.css',
                    '<%= config.root_src %>/<%= config.dir_vendors %>/**/*.js'
                ],
                tasks: ['newer:bower_concat', 'newer:uglify:vendors']
            }
        },

        //Tunning tasks in parallel
        //parallel: {
        //    uglify_all_prod: {
        //        options: {
        //            grunt: true
        //        },
        //        tasks: [ 'uglify_external', 'uglify:app_production' ]
        //    },
        //    uglify_all_dev: {
        //        options: {
        //            grunt: true
        //        },
        //        tasks: [ 'uglify_external', 'uglify:app_development' ]
        //    }
        //}

        // Run grunt tasks concurrently
        //concurrent:{
        //    uglify_all_prod: {
        //        tasks: [ 'uglify_external', 'uglify:app_production' ]
        //    },
        //    uglify_all_dev: {
        //        tasks: [ 'uglify_external', 'uglify:app_development' ]
        //    }
        //},

        // Analysis grunt task.
        complexity: {
            default: {
                src: '<%= config.root_src %>/<%= config.dir_js %>/**/*.js',
                options: {
                    errorsOnly: false,
                    cyclomatic: 4,
                    halstead: 10,
                    maintainability: 115
                }
            }
        }
    });

    // DEPENDENT PLUGINS =========================/
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-jshint' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-bower-concat' );
    grunt.loadNpmTasks( 'grunt-newer' );
    //grunt.loadNpmTasks( 'grunt-concurrent' );
    //grunt.loadNpmTasks('grunt-parallel');


    // TASKS =========================/
    // Default task.
    grunt.registerTask( 'prod', [
        'jshint',

        'uglify_external',
        'uglify:app_production'
        //'concurrent:uglify_all_prod'
        //'parallel:uglify_all_prod'

    ]);

    // Developer task
    grunt.registerTask( 'dev', [
        'jshint',

        'uglify_external',
        'uglify:app_development',
        //'concurrent:uglify_all_dev',
        //'parallel:uglify_all_dev',

        'watch'
    ]);

    // Concat and uglify external libraries
    grunt.registerTask( 'uglify_external', [
        'bower_concat',
        'uglify:vendors'
    ]);


    grunt.registerTask('analyze', [], function () {
        grunt.loadNpmTasks('grunt-complexity');
        grunt.task.run('complexity');
    });

};
