var gulp = require('gulp'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    cleanCSS = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer');

var templateCache = require('gulp-angular-templatecache');

gulp.task('html.js', function() {
    return gulp.src('app/**/*.html')
        .pipe(templateCache({
            module: 'app',
            root: 'app/'
        }))
        .pipe(gulp.dest('dist'))
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
        .pipe(concat('app.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./dist'));
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

gulp.task('appMinify', function() {
    return gulp.src('app/app.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest('dist/js'));
});

gulp.watch(['app/app.js'], ['appMinify']);

gulp.watch(['app/services/*.js'], ['serviceMinify']);


var imagemin = require('gulp-imagemin');
//image
gulp.task('img', function() {
    return gulp.src('./img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/images'));
});



//web
var webserver = require("gulp-webserver");
gulp.task('webserver', function() {
    return gulp.src('./')
        .pipe(webserver({
            port: 8080,
            livereload: {
                enable: true, // need this set to true to enable livereload
                filter: function(fileName) {
                  
                    if(fileName.indexOf('dist')!==-1){
                        return true;
                    }else{
                        return false;
                    }
                }
            },
            directoryListing: {
                enable: true
            },
            open: 'http://localhost:8080/',
            proxies: [{
                source: '/marketconditions',
                target: 'http://qbmf.trenddata.cn/marketconditions'
            }]
        }));
});

var md5 = require("gulp-md5");
//发布
gulp.task('build-js', function() {
    return gulp.src(["./dist/**/*.min.js", "./dist/*.min.js"])
        .pipe(concat('app.min.js'))
        .pipe(md5())
        .pipe(gulp.dest("./src"));
});

gulp.task('build-css', function() {
    return gulp.src("./dist/app.css")
        .pipe(md5())
        .pipe(gulp.dest("./src"));
});
//默认命令，在cmd中输入gulp
gulp.task('default', function() {
    //gulp.start('img');
    gulp.start(['webserver', 'html.js', 'appMinify', 'controllerMinify', 'componentMinify', 'directivesMinify', 'serviceMinify', 'css']);
});
