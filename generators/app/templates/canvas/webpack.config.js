var path    = require('path');
var root    = path.resolve( __dirname);
var webpack = require('webpack');

var production = process.argv.indexOf("--prod") > -1

module.exports = {

    entry :{
      app : ['babel-regenerator-runtime','./src/index.js']
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
      })
    ]:[]

};
