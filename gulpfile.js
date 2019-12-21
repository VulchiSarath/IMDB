"use strict";

const gulp = require('gulp');
const mocha = require('gulp-mocha');
const gutil = require('gulp-util');

// Run unit test using mocha
gulp.task('mocha', () => {
  return gulp.src([
    'tests/**/*.js'
  ], { read: false })
    .pipe(mocha({ timeout: 20000, reporter: 'list', exit: true }))
    .on('error', gutil.log)
    .once('end', function () {
    });
});
