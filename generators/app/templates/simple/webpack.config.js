var path    = require('path');
var root    = path.resolve( __dirname);
var webpack = require('webpack');
var SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

var production = process.argv.indexOf("--prod") > -1

module.exports = {

    entry :{
      app : [ "babel-polyfill", 'babel-regenerator-runtime','./src/index.js']
    },

    output : {
      path : path.resolve( __dirname , './js'),
      filename : 'index.js'
    },

    resolve: {

     extensions: [
       "",
       ".js",
       ".json",
     ],

   },

    module: {
      loaders: [
        {
          test    : /\.js$/,
          loader  : 'babel',
          exclude : /(node_modules|bower_components)/,
          include : root
        },{
          test: /\.json$/,
          loaders: [
            "json",
          ],
        }
      ]
    },

    plugins : production ? [
      new webpack.optimize.UglifyJsPlugin({
        comments : false
      }),
      new SWPrecacheWebpackPlugin(
        {
          cacheId       : require('./package.json').name,
          filename      : '../sw.js',

          forceDelete   : true,

          maximumFileSizeToCacheInBytes: 4194304,
          minify: true,
          staticFileGlobsIgnorePatterns: [/\.map$/],

          runtimeCaching: [{
            handler: 'cacheFirst',
            urlPattern: /[.](jpg|png|gif)$/,
          },{
            handler: 'networkFirst',
            urlPattern: /[.]css$/,
          }],

          staticFileGlobs: [
             'js/lib/**.js',
             'style/img/**.*',
             'style/**.css',
           ],

        }
      )
    ]:[]

};
