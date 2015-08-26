var gulp = require('gulp'),
    SubTask = require('gulp-subtask')(gulp),
    del = require('del'),
    concat = require('gulp-concat'),
    wrap = require('gulp-wrap'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify');

var jsSrcFiles = ['src/Sudoku.js', 'src/view.js', 'src/init.js'];


/*
* Wraps the javascript inside a self-calling function.
*/
var wrapTask = new SubTask('wrapTask')
    .pipe(wrap, "(function () {'use strict';<%= contents %>})();");


/*
* Copies sudoku.html into the webapp directory
*/
var copyHtmltask = new SubTask('copyHtmlTask')
    .src('src/sudoku.html')
    .pipe(gulp.dest, 'webapp');


gulp.task('clean', function(cb) {
    del('webapp', cb)
});


gulp.task('concatJS', ['clean'], function() {
    return gulp.src(jsSrcFiles)
        .pipe(concat('app.js'))
        .pipe(gulp.dest('webapp'))
    ;
});


gulp.task('uglifyJS', ['concatJS'], function() {
    return gulp.src('webapp/app.js')
        .pipe(uglify())
        .pipe(gulp.dest('webapp'))
    ;
});


/*
* Dev build. Concats and wraps JS src files with no obfuscation.
*/
gulp.task('dev', ['concatJS'], function(){
    gulp.src('webapp/app.js')
        .pipe(wrapTask.run())
        .pipe(gulp.dest('webapp'))
    ;
    copyHtmltask.run();
});


/*
* Production build. Concats, obfuscates and wraps JS src files.
*/
gulp.task('deploy', ['uglifyJS'], function(){
    gulp.src('webapp/app.js')
        .pipe(wrapTask.run())
        .pipe(gulp.dest('webapp'))
    ;
    copyHtmltask.run();
});
