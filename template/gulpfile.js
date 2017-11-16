const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const browserify = require('gulp-browserify');
const merge = require('merge-stream');

const SOURCEPATHS = {
  sassSource: 'src/scss/*.scss',
  htmlSource: 'src/*.html',
  jsSource: 'src/js/**'
}
const APPPATH = {
  root: 'app/',
  css: 'app/css',
  js: 'app/js',
  fonts: 'app/fonts'
}

gulp.task('clean-html', () => {
  return gulp.src(APPPATH.root + '/*.html', { read: false, force: true})
            .pipe(clean());
});

gulp.task('sass', () => {
  const bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');

  const sassFile = gulp.src(SOURCEPATHS.sassSource)
        .pipe(autoprefixer())
        .pipe(sass({outputStyle: 'expanded'}).on('error',sass.logError));

  return merge(bootstrapCSS, sassFile)
        .pipe(concat('app.css'))
        .pipe(gulp.dest(APPPATH.css));
});

gulp.task('clean-scripts', () => {
  return gulp.src(APPPATH.js + '/*.js', { read: false, force: true})
            .pipe(clean());
});

gulp.task('scripts',['clean-scripts'], () => {
  gulp.src(SOURCEPATHS.jsSource)
      .pipe(concat('main.js'))
      .pipe(browserify())
      .pipe(gulp.dest(APPPATH.js));
});

gulp.task('moveFonts', () => {
  gulp.src('./node_modules/bootstrap/dist/fonts/*.{eot,svg,woff,woff2}')
      .pipe(gulp.dest(APPPATH.fonts));
});

gulp.task('copy',['clean-html'], () => {
  gulp.src(SOURCEPATHS.htmlSource)
      .pipe(gulp.dest(APPPATH.root));
});


gulp.task('serve', ['sass'], () => {
  browserSync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
    server: {
      baseDir : APPPATH.root
    }
  })
});

gulp.task('watch', ['serve', 'sass', 'scripts', 'copy', 'clean-html', 'clean-scripts', 'moveFonts'], () => {
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
  gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
});

gulp.task('default',['watch']);
