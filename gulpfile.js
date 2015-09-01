var gulp = require('gulp'),
    SubTask = require('gulp-subtask')(gulp),
    del = require('del'),
    browserify = require('gulp-browserify');
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify');


/*
* Copies sudoku.html into the webapp directory
*/
var copySudokuHtmlTask = new SubTask('copySudokuHtmlTask')
    .src('src/sudoku.html')
    .pipe(rename, 'index.html')
    .pipe(gulp.dest, 'webapp');


//
// Tasks for deploying test files
//

var copySpecRunnerTask = new SubTask('copySpecRunnerTask')
    .src('SpecRunner.html')
    .pipe(gulp.dest, 'webapp');

var browserifySudokuSpecTask = new SubTask('browserifySudokuSpecTask')
    .src('__tests__/sudokuSpec.js')
    .pipe(browserify)
    .pipe(gulp.dest, 'webapp');

var browserifySudokuViewSpecTask = new SubTask('browserifySudokuViewSpecTask')
    .src('__tests__/viewSpec.js')
    .pipe(browserify)
    .pipe(gulp.dest, 'webapp');


gulp.task('clean', function(cb) {
    del('webapp', cb);
});


gulp.task('browserifyJS', ['clean'], function() {
    return gulp.src('src/init.js')
        .pipe(browserify())
        .pipe(rename('app.js'))
        .pipe(gulp.dest('webapp'))
    ;
});


gulp.task('uglifyJS', ['browserifyJS'], function() {
    return gulp.src('webapp/app.js')
        .pipe(uglify())
        .pipe(gulp.dest('webapp'))
    ;
});


/*
* Dev build. Browserifies JS src files with no obfuscation, and also deploys test files.
*/
gulp.task('dev', ['browserifyJS'], function(){
    copySudokuHtmlTask.run();
    copySpecRunnerTask.run();
    browserifySudokuSpecTask.run();
    browserifySudokuViewSpecTask.run();
});


/*
* Production build. Browserifies JS src files *with* obfuscation.
*/
gulp.task('deploy', ['uglifyJS'], function(){
    copySudokuHtmlTask.run();
});
