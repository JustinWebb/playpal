var gulp = require('gulp');
var livereload = require('gulp-livereload');
var path = require('path');
var config = require('./build-config.js');




var updateActiveProblem = function (filename) {
  config.activeProblem = config.problemDir.concat('/'+ filename + '.js');
};

// Reload the specRunner.html file after changes to its related
// Javascript, including spec and source files.
gulp.task('default', function () {

  // Create Glob pattern to include test scripts and toy problem
  // source code.
  var toyProblemSrc = config.problemDir.concat('/**/*.js');

  // Start Livereload
  livereload.listen();

  // Make sure Gulp watches the actively-edited toy problem and
  // its support files and reloads the associated spec runner.
  gulp.watch(toyProblemSrc, function (file) {
    var editedDirname =  path.basename(path.dirname(file.path));
    var specRunnerHTML = config.problemDir.concat('/'+ editedDirname +'/index.html');

    updateActiveProblem(editedDirname);
    livereload.reload(specRunnerHTML);
  });
});

gulp.task('check-syntax', function () {

  return gulp.src(config.activeProblem)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
});

