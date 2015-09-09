var path = require('path');
var fs =  require('fs');
var config = require('./build-config.js');
var gulp = require('gulp');
var livereload = require('gulp-livereload');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');


gulp.task('default', ['startup']);

gulp.task('startup', function () {

  // Create Glob pattern to include test scripts and toy problem
  // source code.
  var devSrc = config.problemDir.concat('/**/*.js');

  // Start Livereload
  livereload.listen();

  // Watch all toy problem and test scripts
  gulp.watch(devSrc, function (file) {
    var pd = config.problemDir;
    var activeDir =  path.basename(path.dirname(file.path));
    var specRunnerHTML = pd.concat('/'+ activeDir, '/index.html');
    var activeProblem = pd.concat('/'+ activeDir, '/'+ activeDir +'.js');

    // Lint JS files in background. Warnings are output to the 
    // console. Errors are caught by the interpreter upon reload. 
    gulp.src(activeProblem)
      .pipe(jshint())
      .pipe(jshint.reporter(stylish));

    // Reload the spec runner associated with the active problem.
    livereload.reload(specRunnerHTML);
  });
});

gulp.task('validate', function (cb) {
  var toyProblems = [];

  fs.readdir(config.problemDir, function (err, files) {
    if (err) throw err;

    // Set toyProblems by filtering out hidden directory in a
    // somewhat janky way, then configuring paths to each
    // remaining directory's source file.
    files
      .filter(function (fn) {return fn.charAt(0) != '.';})
      .forEach(function (fp){
        var name = '/'+ fp;
        toyProblems.push(config.problemDir.concat(name, name +'.js'));
      });

    // Lint toyProblems. Warning and Errors output to the
    // console and break the build, requiring 'gulp startup'
    // to restart.
    gulp.src(toyProblems)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'));

    cb();
  });
});
