var gulp = require('gulp'),
    concat = require('gulp-concat'),
    gulpSequence = require('gulp-sequence'),
    livereload = require('gulp-livereload'),
    minifyCSS = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),
    rename = require('gulp-rename'),
    sequence = require('gulp-watch-sequence'),
    del = require('del'),
    angularTemplatecache = require('gulp-angular-templatecache'),
    htmlmin = require('gulp-htmlmin');

// Path settings for Gulp
var clientApp = './src/app/';
var config = {
    html: clientApp + '**/*.html',
    js: [
        clientApp + 'app.module.js',
        clientApp + '**/*.module.js',
        clientApp + '**/*.constants.js',
        clientApp + '**/*.services.js',
        clientApp + '**/*.js',
        '!' + clientApp + '**/*.spec.js',
    ],
    css: './src/content/*.css',
    htmltemplates: './src/htmltemplates/*.html',
    images: ['./src/content/images/*.png',
        './src/content/images/*.jpg',
        './src/content/images/*.gif'],
    templateCache: {
        file: 'templates.js',
        options: {
            module: 'dap.app',
            root: 'app/',
            standAlone: false
        }
    },
    pre_output: 'pre.js',
    min_output: 'min.js',
    output: 'app.js',
    dest: './dist/'
};

//bundle & minify JS 
gulp.task('js', function () {
    return gulp
        .src(config.js)
        .pipe(concat(config.pre_output))
        .pipe(rename(config.min_output))
        .pipe(uglify())
        .pipe(gulp.dest(config.dest));
});


//create angular template cache
gulp.task('templatecache', function () {
    return gulp
        .src(config.html)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(angularTemplatecache(
            config.templateCache.file,
            config.templateCache.options
        ))
        .pipe(gulp.dest(config.dest));
});

//merge app.js with templates.js
gulp.task('merge', function () {
    return gulp
        .src([config.dest + config.min_output,
        config.dest + config.templateCache.file
        ])
        .pipe(concat(config.output))
        .pipe(gulp.dest(config.dest));
});

//css
gulp.task('css', function () {
    return gulp
        .src(config.css)
        .pipe(minifyCSS())
        .pipe(gulp.dest(config.dest + 'content/'));
});

//html templates
gulp.task('htmltemplates', function () {
    return gulp.src(config.htmltemplates)
        .pipe(gulp.dest(config.dest + 'htmltemplates/'));
});

//images
gulp.task('images', function () {
    return gulp.src(config.images)
        .pipe(gulp.dest(config.dest + 'content/images/'));
});

//delete templates.js
gulp.task('clean', function () {
    return del([config.dest + '*.js',
    '!' + config.dest + config.output
    ]);
});

//execute
gulp.task('default',
    gulpSequence('js', 'templatecache', 'merge', 'css', 'htmltemplates', 'images', 'clean'));