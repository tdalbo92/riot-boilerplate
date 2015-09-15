/* Copyright IBM Corp. 2015 Licensed under the Apache License, Version 2.0 */

var gulp        = require('gulp'),
    browserify  = require('browserify'),
    runSequence = require('run-sequence').use(gulp),
    plugins     = require('gulp-load-plugins')(),
    through2    = require('through2'),
    del         = require('del'),
    karma       = require('karma').server,
    config      = 
        {
         "bowerDir"    : bowerDir    = __dirname + "/bower_components",
         "temp"        : temp        = __dirname + "/temp",
         "dev"         : dev         = __dirname + "/dev",
         "lib"         : lib         = __dirname + "/lib",
         "test"        : test        = __dirname + "/test",
         "dist"        : dist        = __dirname + "/dist",
         "testReports" : testReports = test      + "/client-reports",
         "fetchSrc"    :               bowerDir  + "/fetch",
         "promise"     :               bowerDir  + "/es6-promise",
         "jsDev"       :               dev       + "/js",
         "sass"        :               dev       + "/sass",
         "tag"         :               dev       + "/tag",
         "jsLibs"      :               lib       + "/js",
         "jsDist"      :               dist      + "/js",
         "css"         :               dist      + "/css",
         "html"        :               dist      + "/html"
        };
        
        
// Compile sass
// 
gulp.task("sass", function() {
    return gulp.src(config.sass + "/*.scss")
        .pipe(plugins.sass())
        .pipe(gulp.dest(config.css));
});


// Code compilation
//
gulp.task("riot", function() {
            
    return gulp.src(config.tag + "/*.tag") 
        .pipe(plugins.riot())
        .pipe(plugins.concat("tags.js"))
        .pipe(gulp.dest(config.temp));
});

gulp.task("copy_libs", function() {
    return gulp.src(config.jsLibs + "/*.js")
        .pipe(gulp.dest(config.temp));
});

gulp.task("copy_scripts", function() {
     return gulp.src(config.jsDev + "/*.js")
        .pipe(gulp.dest(config.temp));
});

gulp.task("concat_tags", function() {
    var mainSource = gulp.src(config.temp + "/main.js");
    var tagSource  = gulp.src(config.temp + "/tags.js");
    
    return plugins.merge(mainSource, tagSource)
        .pipe(plugins.order([
            "main.js",
            "tags.js"
        ]))
        .pipe(plugins.concat("main.js"))
        .pipe(gulp.dest(config.temp));
});

gulp.task("scripts", ["riot", "copy_libs", "copy_scripts"]); 

// Polyfills
gulp.task("polyfill", function() {
    var promiseSource = gulp.src(config.promise + "/promise.min.js");     
    var fetchSource   = gulp.src(config.fetchSrc + "/fetch.js");
    
    return plugins.merge(promiseSource, fetchSource)
        .pipe(plugins.order([
            "promise.min.js",
            "fetch.js"
        ]))
        .pipe(plugins.concat("polyfill.js"))
        .pipe(gulp.dest(config.temp));
});

// These happen after all source has been copied into /dist folder
gulp.task("browserify", function() {
    
    function browserifySetup(file, end, next) {
        browserify(file.path, { debug: process.env.NODE_ENV === 'development' })
            .bundle(function (err, res) {
                if (err) { 
                    return next(err); 
                }

                file.contents = res;
                next(null, file);
            });
    }
    
    return gulp.src(config.temp + "/main.js")
        .pipe(through2.obj(browserifySetup))
        .pipe(plugins.rename("bundle.js"))
        .pipe(gulp.dest(config.temp));
});

gulp.task("combine_scripts_polyfills", function() {
    var polyfills = gulp.src(config.temp + "/polyfill.js"),
        bundle    = gulp.src(config.temp + "/bundle.js");
    
    return plugins.merge(polyfills, bundle)
        .pipe(plugins.order([
            "polyfill.js",
            "bundle.js"
        ]))
        .pipe(plugins.concat("bundle.js"))
        .pipe(gulp.dest(config.jsDist));
});

gulp.task("lint", function() {
    return gulp.src(config.jsDev + "/*.js")
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter("default"));
});

gulp.task("uglify", function() {
    return gulp.src([config.jsDist + "/bundle.js"])
        .pipe(plugins.uglify())
        .pipe(gulp.dest(config.jsDist));
});

gulp.task("static_resources", function() {
    // Copy everything that isn't a main development source directory
    return gulp.src(["!" + config.dev + "/js/",
                    "!" + config.dev + "/js/**/*",
                    "!" + config.dev + "/sass/",
                    "!" + config.dev + "/sass/**/*",
                    "!" + config.dev + "/tag/",
                    "!" + config.dev + "/tag/**/*",
                    config.dev + "/*",
                    config.dev + "/*/**/*.*"])
        .pipe(gulp.dest(config.dist));
});

gulp.task("watch_tags", function() {
    return gulp.watch(config.tag + "/*.tag", ["build_debug"]);
});

gulp.task("watch_sass", function() {
    return gulp.watch(config.sass + "/*.scss", ["sass"]);
});

gulp.task("cleanup_temp", function() {
    return del([
        config.temp
    ]);
});

gulp.task("clean", function() {
    return del([
        config.dist + "/*",
        config.temp
    ]);
});

gulp.task("test_ci", function(done) {
    return karma.start({
        configFile: config.test + "/karma.conf.js",
        singleRun: false,
        browsers: ["Chrome"],
        junitReporter: {
            outputFile: config.testReports + "/TEST-client-results.xml"
        }
    }, done);
});

gulp.task("test", function(done) {
    return karma.start({
        configFile: config.test + "/karma.conf.js",
        junitReporter: {
            outputFile: config.testReports + "/TEST-client-results.xml"
        }
    }, done);
});

gulp.task("watch", function(callback) {
    runSequence(["watch_tags", "watch_sass"], "test_ci", callback);
});

gulp.task("build", function() {
    runSequence(
        "clean", 
        "sass", 
        "scripts", 
        "concat_tags",
        "browserify", 
        "polyfill", 
        "combine_scripts_polyfills", 
        "uglify", 
        "static_resources", 
        "cleanup_temp"
    );
});

gulp.task("build_debug", function() {
    runSequence(
        "clean", 
        "sass", 
        "scripts", 
        "concat_tags",
        "browserify", 
        "polyfill", 
        "combine_scripts_polyfills", 
        "lint", 
        "static_resources", 
        "cleanup_temp"
    );
});

gulp.task("default",   ["build_debug"]);

