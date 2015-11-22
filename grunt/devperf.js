'use strict';
module.exports = {
    options: {
        urls: [
            '<%= config.host.local %>'
        ],
        numberOfRuns: 1,
        timeout: 120,
        openResults: true,
        resultsFolder: './devperf'
    }
};