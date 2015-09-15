/* Copyright IBM Corp. 2015 Licensed under the Apache License, Version 2.0 */

// This file is configured for one time mode, not development. 
// To use for development override these configurations.
module.exports = function(config) {
    config.set({

        basePath: "../",

        frameworks: ['jasmine', 'riot'],

        files: [
            'test/polyfills.js',
            'test/mock/*.js',
            'dev/js/*.js',
            'dev/tag/*.tag',
            'test/*Spec.js'
        ],

        preprocessors: {
            'dev/tag/*.tag': ['riot']
        },

        reporters: ["progress","junit"],

        junitReporter: {
            outputFile: "test/client-reports/TEST-client-results.xml"
        },

        port: 9876,

        colors:true,

        logLevel: config.LOG_INFO,

        browsers: ["PhantomJS"],

        plugins: [
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-junit-reporter',
            'karma-jasmine',
            'karma-riot'
        ],

        // Disable continuous integration.  This functionality will be implemented in gulp.watch
        singleRun: true
    });
};
