var gulp          = require('gulp'),
		sass          = require('gulp-sass'),
		cleancss      = require('gulp-clean-css'),
		server   			= require('browser-sync'),
		posthtml 			= require('gulp-posthtml'),
		include 			= require('posthtml-include'),
		rename        = require('gulp-rename'),
		autoprefixer  = require('gulp-autoprefixer'),
		notify        = require('gulp-notify'),
		del 					= require('del');

var	concat				= require('gulp-concat'),
		uglify				= require('gulp-uglify');
		
// var	imagemin 			= require('gulp-imagemin'),
// 		webp 					= require('gulp-webp'),
// 		svgstore 			= require('gulp-svgstore');

gulp.task('serve', function() {
	server({
		server: {
			baseDir: 'build'
		},
		notify: false,
		// open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	})
});

gulp.task('styles', function() {
	return gulp.src('source/sass/style.scss')
		.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
		.pipe(rename({ suffix: '.min', prefix : '' }))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleancss( {level: { 1: { specialComments: 0 } } }))
		.pipe(gulp.dest('build/css'))
		.pipe(server.stream())
});

gulp.task('scripts', function() {
	return gulp.src([
		'source/js/main.js',
		])
		.pipe(concat('scripts.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('build/js'))
		.pipe(server.reload({ stream: true }))
});

gulp.task('code', function() {
	return gulp.src('source/*.html')
		.pipe(posthtml([
			include()
		]))
		.pipe(gulp.dest('build'))
		.pipe(server.reload({ stream: true }))
});

gulp.task('watch', function() {
	gulp.watch('source/sass/**/*.scss', gulp.parallel('styles'));
	gulp.watch('source/js/**', gulp.parallel('scripts'));
	gulp.watch('source/*.html', gulp.parallel('code'));
});

gulp.task('copy', function () {
	return gulp.src([
		'source/fonts/**/*.{woff, woff2}',
		'source/img/**',
		'source/video/**',
		'source/js/**'
	], {
		base: 'source'
	})
		.pipe(gulp.dest('build'));
});

gulp.task('clean', function () {
  return del('build');
});

// gulp.task('images', function () {
//     return gulp.src('source/img/**/*.{png,jpg,svg}')
//         .pipe(imagemin([
//             imagemin.optipng({optimizationLevel: 3}),
//             imagemin.jpegtran({progressive: true}),
//             imagemin.svgo()
//         ]))
//         .pipe(gulp.dest('source/img'));
// });

// gulp.task('webp', function () {
//     return gulp.src('source/img/**/*.{png,jpg}')
//         .pipe(webp({quality: 90}))
//         .pipe(gulp.dest('source/img'));
// });

// gulp.task('sprite', function () {
//     return gulp.src('source/img/icon-*.svg')
//         .pipe(svgstore({
//             inlineSvg: true
//         }))
//         .pipe(rename('sprite.svg'))
//         .pipe(gulp.dest('build/img'));
// });

gulp.task('build', gulp.series('clean', 'copy', 'styles', 'code', 'scripts'))

gulp.task('default', gulp.parallel('watch', 'serve'));