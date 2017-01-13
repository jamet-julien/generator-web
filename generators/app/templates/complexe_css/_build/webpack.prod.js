var path     = require('path');
var webpack  = require('webpack');
var config   = require('./webpack.base');

var sTheme   = '../webroot/default/desktop';

config[0].entry = {

      home    : [
        'babel-regenerator-runtime',
        path.resolve( __dirname , sTheme + '/src/js/index.js')
      ]

};

config[0].output.path = path.resolve( __dirname , sTheme + '/dist/');

config[0].plugins = config[0].plugins.concat([
  new webpack.optimize.UglifyJsPlugin({
    comments : false
  })
]);

module.exports = config;
