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
        dir_grunt:          './grunt',
        output_js_app:      false, //if null or false use package name and version
        output_js_vendors:  false,  // if null or false use vendors.min
        host : {
            local: 'http://localhost/simplay/public'
        },
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

        // Individual configurations.
        jshint:         require( config.dir_grunt + '/jshint'),
        bower_concat:   require( config.dir_grunt + '/bower_concat'),
        uglify:         require( config.dir_grunt + '/uglify'),
        watch:          require( config.dir_grunt + '/watch'),

        //Tunning tasks in parallel
        //parallel: require( config.dir_grunt + '/parallel' ),

        // Run grunt tasks concurrently
        //concurrent: require( config.dir_grunt + '/concurrent' ),

        // Analysis grunt task.
        complexity: require( config.dir_grunt + '/complexity' ),

        // Open urls and files
        open: require( config.dir_grunt + '/open' ),


        //  Keep an eye on performance metrics
        devperf: require( config.dir_grunt + '/devperf' )

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
