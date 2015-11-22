'use strict';
module.exports = {
    uglify_all_prod: {
        options: {
            grunt: true
        },
        tasks: [ 'uglify_external', 'uglify:app_production' ]
    },
    uglify_all_dev: {
        options: {
            grunt: true
        },
        tasks: [ 'uglify_external', 'uglify:app_development' ]
    }
};