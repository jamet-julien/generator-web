// Requis
var gulp = require('gulp');

// Include plugins
var plugins = require('gulp-load-plugins')(
  {
  rename: {
    'gulp-inline-source': 'inlineSource'
  }
});

// Variables de chemins
var source      = './_master/'; // dossier de travail
var destination = './_deploy/'; // dossier à livrer


gulp.task('minimize', function(){
  return gulp.src( source + '*.html')
      .pipe( plugins.inlineSource())
      .pipe( plugins.replace(/<\/script>(\s*)<script type="text\/javascript">/g, ''))
      .pipe( plugins.replace(/<\/style>(\s*)<style media="all">/g, ''))
      .pipe( plugins.htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest( destination ));
});

/**
 * [task description]
 * @param  {[type]} 'deploy' [description]
 * @param  {[type]} function (             [description]
 * @return {[type]}          [description]
 */
gulp.task( 'deploy',['minimize'], function () {
    return gulp.src( destination + '*')
        .pipe(plugins.gzip())
        .pipe(gulp.dest( destination + '.' ));

});

/**
 * [task description]
 * @param  {[type]} 'svg'    [description]
 * @param  {[type]} function (             [description]
 * @return {[type]}          [description]
 */
gulp.task( 'svg', function () {
    return gulp.src( source + 'svg/*.svg')
        .pipe( plugins.svgSprite({
                mode                    : {
                    symbol              : {
                      dest   : source + 'svg/',
                      sprite : 'sprite.svg'
                    },
                }
            }))
          .pipe(gulp.dest( './' ));
});
