var gulp       = require('gulp'),
    postcss    = require('gulp-postcss'),
    filter     = require('gulp-filter'),
    rename     = require("gulp-rename"),
    livereload = require('gulp-livereload');

var processors = [
    require('precss'),
    require("postcss-color-function"),
    require('rucksack-css')({
      fallbacks : true
    }),
    require('autoprefixer')({ browsers: ['last 5 versions'] }),
    require("css-mqpacker")()
];


gulp.task( 'default', function(){
    var oRegex = /\d{2}[a-zA-Z_\-]+\/(?!_)[a-zA-Z_0-9\-]+\.css/;

    gulp.src( './webroot/**/*.css')
        .pipe( filter( function( file){
            return oRegex.test( file.path);
        }))
        .pipe( rename( function( path) {
            path.dirname = path.dirname.replace(/(\d{2}-)/, '');
         }))
        .pipe( postcss( processors))
        .pipe( gulp.dest('./webroot/'))
        .pipe(livereload());
});



gulp.task( 'watch', function(){
    livereload.listen();
    gulp.watch('./webroot/**/*.css', ['default']);
});
