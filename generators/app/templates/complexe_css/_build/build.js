require( 'shelljs/global');

var webpackConfig = require( './webpack.prod'),
    ora           = require( 'ora'),
    webpack       = require( 'webpack'),
    spinner       = ora('On compile pour la PROD …');

var sTheme     = 'webroot/default/desktop';
var sRootDist  = sTheme + '/dist';

rm( '-rf', sRootDist);

spinner.start();
    // run webpack
webpack( webpackConfig, function(err, stats) {

  spinner.stop();

  if( err) throw err;

  process.stdout.write( stats.toString({
      colors       : true,
      modules      : false,
      children     : false,
      chunks       : false,
      chunkModules : false
  })+'\n');


});
