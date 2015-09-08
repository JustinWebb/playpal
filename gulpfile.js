var gulp = require('gulp');
var livereload = require('gulp-livereload');
var path = require('path');
var specRunnerPath = 'problems/[TARGET]/index.html'
var config = {
  toyProblems: ['problems/**/*.js']
};

// Reload the specRunner.html file after changes to its related
// Javascript, including spec and source files.
gulp.task('default', function () {

  livereload.listen();

  gulp.watch(config.toyProblems, function (file) {
    var editedDirname =  path.basename(path.dirname(file.path));
    var specRunnerHTML = specRunnerPath.replace('[TARGET]', editedDirname);
    console.log('Spec Runner: ', specRunnerHTML);
    livereload.reload(specRunnerHTML);
  });
});