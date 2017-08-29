const gulp = require('gulp');
const sass = require('gulp-sass');
const minifyCSS = require('gulp-minify-css');
const jshintStyle = require('jshint-stylish');
const eslint = require('gulp-eslint');
const browserify = require('browserify');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const source = require('vinyl-source-stream');

gulp.task('sass', function () {
  return gulp.src('sass/**/*.scss') // find all .scss files in sass directory
    .pipe(sass()) // run sass
    .pipe(minifyCSS()) // mimnify CSS
    .pipe(gulp.dest('./public/css/')); // create css file in directory public/css
});

// --------------------------------------------------------------
//  ESLint
// --------------------------------------------------------------
gulp.task('lint', function () {
  // lint all JS in all project directories except node_modules and public/js
  return gulp.src(['**/*.js', '!node_modules/**', '!public/js/**/*.js'])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});

// --------------------------------------------------------------
//  build javascript bundles
// --------------------------------------------------------------
gulp.task('javascript', function() {
 const jsxPath = './jsx/';
 const files = ['./js/'];
 const streams = files.map(function(fileName) {
  const fullFile = jsxPath + fileName + '.jsx';
  const bundler = browserify({
    extensions: ['.js', '.jsx'],
    transform: ['babelify'] // use babel to transpile
  });
  // bundler add the fullfile
  bundler.add(fullFile);

  const stream = bundler.bundle();
  stream.on('error', function (err) { console.error(err.toString()); });

  stream
    .pipe(source(fullFile))
    .pipe(rename(fileName + '.js'))
    .pipe(gulp.dest('public/js/'));
  console.log(`${fileName}.js created`)
 });
  
});

// --------------------------------------------------------------
//  Compress/minify JavaScript
// --------------------------------------------------------------
gulp.task('compress', function() {
  return gulp.src('./public/js/*.js') // look for all files in public/js/ directory
    .pipe(uglify()) // minify JavaScript files
    .pipe(rename({
       extname: '.min.js' // add .min.js to minified JavaScript file name
     }))
    .pipe(gulp.dest('./public/js/min/')); // save minified JavaScript files in public/js/min/ directory
});

// --------------------------------------------------------------
//  Watch
// --------------------------------------------------------------
gulp.task('watch', function() {
  gulp.watch('sass/**/*.scss', ['sass']); // watch all .scss files in sass/ directory. When files change run sass task
  gulp.watch(['./jsx/**/*'], ['lint', 'javascript', 'compress']);
});

// default task is watch
gulp.task('default', ['watch']);