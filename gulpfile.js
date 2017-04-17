var gulp = require('gulp'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    cleanCSS = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    html2js = require('gulp-html2js');

// html2js
gulp.task('html.js', function() {
    gulp.src(['app/**/*.html'])
        .pipe(html2js('templates.js', {
            adapter: 'angular',
            base: 'templates',
            name: 'app'
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));
});

gulp.watch(['app/**/*.html'], ['html.js']);

//css
gulp.task('css', function() {
    gulp.src('app/**/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist'))
        .pipe(sourcemaps.init())
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css'));
});

gulp.watch(['app/**/*.css'], ['css']);

//controller
gulp.task('controllerMinify', function() {
    return gulp.src('app/controllers/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('controllers.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest('dist/js'));
});

gulp.watch(['app/controllers/**/*.js'], ['controllerMinify']);

//component
gulp.task('componentMinify', function() {
    return gulp.src(['app/components/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('components.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest('dist/js'));
});

gulp.watch(['app/components/**/*.js'], ['componentMinify']);

//mini directives js
gulp.task('directivesMinify', function() {
    return gulp.src('app/directives/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('directives.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest('dist/js'));
});

gulp.watch(['app/directives/**/*.js'], ['directivesMinify']);

//service
gulp.task('serviceMinify', function() {
    return gulp.src('app/services/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('services.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest('dist/js'));
});

gulp.watch(['app/services/*.js'], ['serviceMinify']);



var webserver = require("gulp-webserver");
gulp.task('webserver', function() {
    return gulp.src('./')
        .pipe(webserver({
            port: 8080,
            livereload: false,
            directoryListing: {
                enable: true
            },
            open: 'http://localhost:8080/',
            proxies: [{
                source: '/yourApi',
                target: 'http://your host name/yourApi'
            }]
        }));
});
//默认命令，在cmd中输入gulp
gulp.task('default', function() {
    //gulp.start('img');
    gulp.start(['webserver', 'html.js', 'controllerMinify', 'componentMinify', 'directivesMinify', 'serviceMinify', 'css']);
});
