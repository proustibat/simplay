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
        output_js_vendors:  false,  // if null or false use vendors.min
        host : {
            local: 'http://localhost/simplay/public'
        }
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
                mainFiles: {}
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
                    breakOnErrors: true,
                    errorsOnly: false,               // show only maintainability errors
                    cyclomatic: [3, 7, 12],          // or optionally a single value, like 3
                    halstead: [8, 13, 20],           // or optionally a single value, like 8
                    maintainability: 100,
                    hideComplexFunctions: false,     // only display maintainability
                    broadcast: false                 // broadcast data over event-bus
                }
            }
        },

        // Open urls and files
        open : {
            local : {
                path: '<%= config.host.local %>',
                app: 'Chrome'
            }
        },

        //  Keep an eye on performance metrics
        devperf: {
            options: {
                urls: [
                    '<%= config.host.local %>'
                ],
                numberOfRuns: 1,
                timeout: 120,
                openResults: true,
                resultsFolder: './devperf'
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
        'uglify:app_production',
        //'concurrent:uglify_all_prod'
        //'parallel:uglify_all_prod'
        'open-browser'

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


    // INDEPENDENT TASKS =========================/
    // Run it to analyze js complexity (http://jscomplexity.org/complexity)
    grunt.registerTask('analyze', [], function () {
        grunt.loadNpmTasks('grunt-complexity');
        grunt.task.run('complexity');
    });
    // Run it to open browser in local enironment
    grunt.registerTask('open-browser', [], function() {
        grunt.loadNpmTasks('grunt-open');
        grunt.task.run('open:local');
    });
    // Run it to export analysis in result folder
    grunt.registerTask('check-perf', [], function() {
        grunt.loadNpmTasks('grunt-devperf');
        grunt.task.run('devperf');
    });

};
