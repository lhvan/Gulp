const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');

const SOURCEPATHS = {
  sassSource: 'src/scss/*.scss',
  htmlSource: 'src/*.html',
  jsSource: 'src/js/**'
}
const APPPATH = {
  root: 'app/',
  css: 'app/css',
  js: 'app/js'
}

gulp.task('clean-html', () => {
  return gulp.src(APPPATH.root + '/*.html', { read: false, force: true})
            .pipe(clean());
});

gulp.task('sass', () => {
  return gulp.src(SOURCEPATHS.sassSource)
        .pipe(autoprefixer())
        .pipe(sass({outputStyle: 'expanded'}).on('error',sass.logError))
        .pipe(gulp.dest(APPPATH.css));
});
gulp.task('clean-scripts', () => {
  return gulp.src(APPPATH.js + '/*.js', { read: false, force: true})
            .pipe(clean());
});
gulp.task('scripts',['clean-scripts'], () => {
  gulp.src(SOURCEPATHS.jsSource)
            .pipe(gulp.dest(APPPATH.js));
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

gulp.task('watch', ['serve', 'sass', 'scripts', 'copy', 'clean-html', 'clean-scripts'], () => {
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
  gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
});

gulp.task('default',['watch']);
