var path              = require('path');
var webpack           = require('webpack');
var config            = require('./webpack.base');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractCSS        = new ExtractTextPlugin('[name].css');
var cssLoader;

var sTheme  = '../webroot/default/desktop';

config.entry = {

      home    : [
        'babel-regenerator-runtime',
        path.resolve( __dirname , sTheme + '/src/js/home.js'),
        path.resolve( __dirname , sTheme + '/src/css/home.css')
      ]

};

config.output.path = path.resolve( __dirname , sTheme + '/dist/');

extractCSS.extract( 'css-loader!postcss-loader');

config.module.loaders[0].loaders = null;
config.module.loaders[0].loader  = extractCSS.extract( 'css-loader!postcss-loader');

config.plugins = config.plugins.concat([
  extractCSS,
  new webpack.optimize.UglifyJsPlugin({
    comments : false
  })
]);


module.exports = config;
