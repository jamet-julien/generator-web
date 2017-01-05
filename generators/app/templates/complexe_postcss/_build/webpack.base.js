var path              = require('path');
var root              = path.resolve( __dirname, '../');
var webpack           = require('webpack');

var processors = [
    require('precss'),
    require("postcss-color-function"),
    require('rucksack-css')({fallbacks : true}),
    require('autoprefixer')({ browsers: ['last 5 versions'] }),
    require("css-mqpacker")()
];

var sTheme     = 'webroot/default/desktop';
var sThemePath = '../'+sTheme;
var sRootDist  = sTheme + '/dist';

module.exports = {

  entry :{},

  output : {
    path       : path.resolve( __dirname , sThemePath + '/dist/'),
    filename   : '[name].js'
  },

  resolve : {
    extensions : ['', '.css', '.js']
  },

  module: {

    loaders: [
      {
          test    : /\.css$/,
          loaders : [ 'style', 'css'],
      },

      {
        test    : /\.js$/,
        loader  : 'babel',
        exclude : /(node_modules|bower_components)/,
        include : root
      },

      {
        test  : /\.(png|jpg|gif|svg|woff2?|eot|ttf)$/,
        loader:'url',
        query : {
          limit : 10000,
          name  : 'img/[name].[ext]'
        }
      }
    ]
  },

  postcss : processors,

  plugins : []

};
