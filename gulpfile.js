var path = require('path');
var fs =  require('fs');
var config = require('./build-config.js');
var gulp = require('gulp');
var livereload = require('gulp-livereload');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');


//-----------------------------------------------------------------------------
// Helper Methods
//-----------------------------------------------------------------------------

/**
 * Retrieve a reference to the JS file for given name. Reference
 * assumes file exists in a directory of the same name located 
 * at the project root.
 * @param  {String} name JS file identifer
 * @return {String}      path to file from root
 */
var getPathToProblem = function (name) {
  return config.problemDir.concat('/'+ name, '/'+ name +'.js');
};

/**
 * Test file name for visibility. File names that have '.' as
 * the first character are considered hidden.
 * @param  {String}  dirname name of file or directory
 * @return {Boolean}         
 */
var isNotHiddenFile = function (dirname) {
  return dirname.charAt(0) != '.';
};

//-----------------------------------------------------------------------------
// Tasks
//-----------------------------------------------------------------------------
gulp.task('default', ['startup']);

gulp.task('startup', function () {

  // Create Glob pattern to include test scripts and toy problem
  // source code.
  var devSrc = config.problemDir.concat('/**/*.js');

  // Start Livereload
  livereload.listen();

  // Watch all toy problem and test scripts
  gulp.watch(devSrc, function (file) {
    var activeDir =  path.basename(path.dirname(file.path));
    var specRunnerHTML = config.problemDir.concat('/'+ activeDir, '/index.html');
    var activeProblem = getPathToProblem(activeDir);

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

    // Set toyProblems by filtering out hidden directories and 
    // configuring the remaining paths as source files.
    files
      .filter(isNotHiddenFile)
      .forEach(function (fp) {toyProblems.push(getPathToProblem(fp));});

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
