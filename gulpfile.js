var gulp = require('gulp');
var livereload = require('gulp-livereload');
var path = require('path');
var config = require('./build-config.js');

// Reload the specRunner.html file after changes to its related
// Javascript, including spec and source files.
gulp.task('default', function () {

  // Create Glob pattern to include test scripts and toy problem
  // source code.
  config.toyProblemSrc = config.problemDir.concat('/**/*.js');

  // Start Livereload
  livereload.listen();

  // Make sure Gulp watches the actively-edited toy problem and
  // its support files and reloads the associated spec runner.
  gulp.watch(config.toyProblemSrc, function (file) {
    var editedDirname =  path.basename(path.dirname(file.path));
    var specRunnerHTML = config.problemDir.concat('/'+ editedDirname +'/index.html');
    livereload.reload(specRunnerHTML);
  });
});

