const gulp       = require('gulp');
const livereload = require('gulp-livereload');
const babel      = require('gulp-babel');
const watch      = require('gulp-watch');
const rename     = require('gulp-rename');
var uglify       = require('gulp-uglify');
var pump         = require('pump');

gulp.task('watch', () => {
	gulp.watch('src/*.js', ['js']);
	livereload.listen();
});

gulp.task('js', (cb) => {
	 pump([
    		gulp.src('src/*.js'),
        babel({
            presets: ['es2015']
        }),
				uglify(),
				rename( {suffix: ".min"}),
        gulp.dest('js/')
		], cb
	);
});

gulp.task('default', ['js', 'watch']);
