'use strict';
module.exports = {
    uglify_all_prod: {
        tasks: [ 'uglify_external', 'uglify:app_production' ]
    },
    uglify_all_dev: {
        tasks: [ 'uglify_external', 'uglify:app_development' ]
    }
};