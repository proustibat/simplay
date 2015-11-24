/*global module:false*/
module.exports = function( grunt ) {
    'use strict';

    // Measures the time each task takes
    require('time-grunt')(grunt);

    var config = grunt.file.readJSON( 'config.json' );

    // CONFIGURATION =================================================/
    grunt.initConfig({

        // METADATA =================================================/
        config: config,
        pkg: grunt.file.readJSON( config.pkgjson_file ),
        bower: grunt.file.readJSON( config.bowerrc_file ),
        //bowerjson: grunt.file.readJSON( bower.json ),

        // INDIVIDUAL CONFIG FOR EACH TASKS =========================/

        // Validate files with JSHint
        jshint: require( config.dir_grunt + '/jshint' ),

        // Bower components concatenator for Grunt
        bower_concat: require( config.dir_grunt + '/bower_concat' ),

        // Minify files with UglifyJS
        uglify: require( config.dir_grunt + '/uglify' ),

        // Optimize RequireJS projects using r.js
        requirejs: require( config.dir_grunt + '/requirejs' ),

        // Run tasks whenever watched files change
        watch: require( config.dir_grunt + '/watch' ),

        // Adds a simple banner to files
        usebanner: require( config.dir_grunt + '/usebanner' ),

        //Run tasks in parallel
        //parallel: require( config.dir_grunt + '/parallel' ),

        // Run grunt tasks concurrently
        //concurrent: require( config.dir_grunt + '/concurrent' ),

        // Analysis grunt task
        complexity: require( config.dir_grunt + '/complexity' ),

        // Open urls and files
        open: require( config.dir_grunt + '/open' ),

        // Keep an eye on performance metrics
        devperf: require( config.dir_grunt + '/devperf' )

    });



    // LOAD DEPENDENT TASKS ========================================/
    grunt.loadNpmTasks( 'grunt-contrib-jshint' );
    grunt.loadNpmTasks( 'grunt-bower-concat' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-newer' );
    grunt.loadNpmTasks('grunt-banner');
    //grunt.loadNpmTasks( 'grunt-concurrent' );
    //grunt.loadNpmTasks('grunt-parallel');



    // TASKS =======================================================/
    grunt.registerTask('default', ["dev"]);

    // Production.
    grunt.registerTask( 'prod', [
        'jshint',
        'bower_concat:prod',
        'uglify:vendors_prod',
        'requirejs:production',
        'usebanner',
        'open-browser'
    ]);

    // Development
    grunt.registerTask( 'dev', [
        'jshint',
        'bower_concat:dev',
        'uglify:vendors_dev',
        'uglify:app_development',
        'watch'
    ]);
    


    // INDEPENDENT TASKS ===========================================/

    // Run it to analyze js complexity (http://jscomplexity.org/complexity)
    grunt.registerTask('analyze', function () {
        grunt.loadNpmTasks('grunt-complexity');
        grunt.task.run('complexity');
    });

    // Run it to open browser in local environment
    grunt.registerTask('open-browser', function() {
        grunt.loadNpmTasks('grunt-open');
        grunt.task.run('open:local');
    });

    // Run it to export analysis in result folder
    grunt.registerTask('check-perf', function() {
        grunt.loadNpmTasks('grunt-devperf');
        grunt.task.run('devperf');
    });

};
