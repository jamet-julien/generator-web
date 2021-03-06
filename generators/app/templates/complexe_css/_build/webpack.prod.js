var path              = require('path');
var webpack           = require('webpack');
var config            = require('./webpack.base');
var CompressionPlugin = require("compression-webpack-plugin");
var SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

var sTheme   = '../webroot/default/desktop';

config[0].entry = {

      home    : [
        'babel-regenerator-runtime',
        path.resolve( __dirname , sTheme + '/src/js/index.js')
      ]

};

config[0].output.path = path.resolve( __dirname , sTheme + '/dist/');

config[0].plugins = config[0].plugins.concat(
  [
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.UglifyJsPlugin({
       mangle: true,
       compress: {
         warnings: false, // Suppress uglification warnings
         pure_getters: true,
         unsafe: true,
         unsafe_comps: true,
         screw_ie8: true
       },
       output: {
         comments: false,
       },
       exclude: [/\.min\.js$/gi] // skip pre-minified libs
  }),
  new CompressionPlugin({
     asset: "[path].gz[query]",
     algorithm: "gzip",
     test: /\.js$|\.css$|\.html$/,
     threshold: 10240,
     minRatio: 0
   }),
   new SWPrecacheWebpackPlugin(
     {
       cacheId       : require('../package.json').name,
       filename      : '../../../../sw.js',

       forceDelete   : true,

       maximumFileSizeToCacheInBytes: 4194304,
       minify: true,
       staticFileGlobsIgnorePatterns: [
         /[.]\.map$/
       ],

       runtimeCaching: [{
         handler: 'cacheFirst',
         urlPattern: /[.](jpg|png|gif)$/,
       },{
         handler: 'networkFirst',
         urlPattern: /[.]css$/,
       }],

       staticFileGlobs: [
          'webroot/**/*.css',
          'webroot/**/**/dist/**/*.js',
          'webroot/media/**/*.*',
        ],

     }
   )
  ]
);

module.exports = config;
