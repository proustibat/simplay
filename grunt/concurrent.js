'use strict';
module.exports = {
    uglify_require_prod: {
        tasks: [
            'uglify:vendors_prod',
            'requirejs:production'
        ]
    }
};