var path              = require('path');
var root              = path.resolve( __dirname, '../');
var webpack           = require('webpack');

var sTheme     = 'webroot/default/desktop';
var sThemePath = '../'+sTheme;
var sRootDist  = sTheme + '/dist';

module.exports = [{

  entry :{},

  output : {
    path       : path.resolve( __dirname , sThemePath + '/dist/'),
    filename   : 'core.js'
  },
  
  cache  : false,
  devtool: 'cheap-module-source-map',

  resolve : {
    extensions : ['', '.json', '.js']
  },

  module: {

    loaders: [
      {
        test    : /\.js$/,
        loader  : 'babel',
        exclude : /(node_modules|bower_components)/,
        include : root
      }
    ]
  },

  plugins : []

}];
