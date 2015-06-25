var gulp        = require('gulp'),
  minifyCSS     = require('gulp-minify-css'),
  sass          = require('gulp-sass'),
  browserify    = require('gulp-browserify'),
  uglify        = require('gulp-uglify'),
  rename        = require('gulp-rename'),
  jshint        = require('gulp-jshint'),
  jshintStyle   = require('jshint-stylish'),
  replace       = require('gulp-replace'),
  notify        = require('gulp-notify'),
  path          = require('path');

gulp.task('sass', function () {
  return gulp.src('sass/**/*.scss')
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(gulp.dest('./build/css/'))
    .pipe(notify({ message: 'CSS complete' }));
});

gulp.task('jshint', function() {
  return gulp.src(['./js/**/*.js', './bin/*'])
    .pipe(jshint())
    .pipe(jshint.reporter(jshintStyle))
    .pipe(jshint.reporter('fail'))
    .pipe(notify({ message: 'JSHint complete' }));
});

gulp.task('scripts', function() {
  gulp.src('js/*.js')
    .pipe(browserify({
      insertGlobals : true,
      debug : !gulp.env.production
    }))
    .pipe(gulp.dest('./build/js/'))
    .pipe(uglify())
    .pipe(rename({
	     extname: '.min.js'
	   }))
    .pipe(replace('./build/js/*.min.js'))
    .pipe(gulp.dest('./build/js'))
    .pipe(notify({ message: 'JS files complete' }));
});

gulp.task('watch', function() {
  gulp.watch('sass/**/*.scss', ['sass']);
  gulp.watch('js/**/*.js', ['jshint', 'scripts']);
  gulp.watch('views/**/*.html', ['html']);
});

gulp.task('test', ['jshint']);
gulp.task('default', ['watch']);
