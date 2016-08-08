var gulp 		= require('gulp');
var less 		= require('gulp-less');
var browserSync = require('browser-sync').create();
var uglify 		= require('gulp-uglify');
var gulpIf 		= require('gulp-if');
var cssnano 	= require('gulp-cssnano');
var imagemin 	= require('gulp-imagemin');
var cache 		= require('gulp-cache'); //help make optimizing img faster
var rename		= require('gulp-rename');
var runSequence = require('run-sequence');
var del 		= require('del');

//compile (less, scss etc) files
gulp.task('less', function() {
	return gulp.src('source/less/**/*.less') // Gets all files ending with .less in dev/less and children dirs
	.pipe(less()) //convert less to css with gulp-less
	.pipe(gulp.dest('source/css'))
	.pipe(cssnano())
	.pipe(rename({ suffix: '.min' }))
	.pipe(gulp.dest('www/src/css'))
	.pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('minjs', function() {
	gulp.src('source/js/**/*.js')
	//.pipe(gulpIf('*.js', uglify())) or call other condition like linting
	.pipe(uglify())
	.pipe(rename({ suffix: '.min' }))
	.pipe(gulp.dest('www/src/js'))
});

gulp.task('images', function() {
	return gulp.src('source/img/**/*.+(png|jpg|jpeg|gif|svg)')
	//Cache images that runs through imagemin
	.pipe(cache(imagemin({
		interlaced:true
	})))
	.pipe(gulp.dest('www/src/img'))
});

//watch for changes of any files
gulp.task('watch', ['browserSync', 'less'], function() {
	gulp.watch('source/less/**/*.less', ['less']);
	gulp.watch('source/js/**/*.js', ['minjs']);
	gulp.watch('source/img/**/*.+(png|jpg|jpeg|gif|svg)', ['images']);
	gulp.watch('www/src/js/**/*.js', browserSync.reload);
	gulp.watch('www/src/img/**/*.+(png|jpg|jpeg|gif|svg)', browserSync.reload);
	gulp.watch('www/**/*.php', browserSync.reload);
});

//sync browser whenever changes are made to files
gulp.task('browserSync', function() {
	browserSync.init({
		//===for static sites
		//server: {
			//baseDir: 'www'
		//},
		//===for vhost
		proxy: 'http://localhost/base-web/www'
	})
});

gulp.task('default', function(callback) {
	runSequence(
		['less', 'minjs', 'images', 'browserSync', 'watch'],
		callback
	);
});

//resetting folder structure
gulp.task('clean', function() {
  del(['source/css', 'www/src/**']);
});