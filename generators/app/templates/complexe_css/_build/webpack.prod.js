var path     = require('path');
var webpack  = require('webpack');
var config   = require('./webpack.base');

var sTheme   = '../webroot/default/desktop';

config.entry = {

      home    : [
        'babel-regenerator-runtime',
        path.resolve( __dirname , sTheme + '/src/js/index.js')
      ]

};

config.output.path = path.resolve( __dirname , sTheme + '/dist/');

config.plugins = config.plugins.concat([
  new webpack.optimize.UglifyJsPlugin({
    comments : false
  })
]);

module.exports = config;
