(function(){
  'use strict';

  var generators   = require('yeoman-generator'),
      copydir      = require('copy-dir'),
      _            = require('lodash'),
      tableManage  = require('../app/tableManage'),
      replace      = require("replace"),
      fileExists   = require('file-exists'),
      mkdirp       = require('mkdirp'),
      connection,
      replacePattern = {
        conf    : {
           search  : "// replace:{ADD CONF}",
           replace : "$aModule[ $a_locales['<%= newController %>']['referer'] ]['controller']      = '/<%= newController %>/<%= newController %>.php';\n// replace:{ADD CONF}",
           path    : '*.php',
        },
        local   : {
           search  : "// replace:{ADD TRAD}",
           replace : "$a_locales['<%= newController %>']['referer']      = '<%= newController %>';\n// replace:{ADD TRAD}",
           path    : '*.php',
        },
        sub : {
           search  : "// replace:{ADD SUB}",
           replace : "case $a_locales['<%= newController %>']['referer']:\n\t\t\t\trequire_once( __DIR__.\"/../<%= newController %>/<%= newController %>.php\");\n\t\t\t\tbreak;\n\t\t\t// replace:{ADD SUB}",
           path    : "*.php",
        },
      },
      aTplView  = [
        {tpl : 'theme/device/css/style.css', dest : '{DEVICE}/css/{CTRL}.css'},
//        {tpl : 'theme/device/src/js/scrypt.js', dest : '{DEVICE}/src/js/{CTRL}.js'},
        {tpl : 'theme/device/view/newcontroller/newcontroller.phtml', dest : '{DEVICE}/view/{CTRL}/{CTRL}.phtml'}
      ];

  module.exports = generators.Base.extend({

    constructor : function(){
        generators.Base.apply( this, arguments);
    },

    initializing : function(){
      var sFile    = this.destinationPath( 'yo-config.json'),
          oConnect = {};
      if( fileExists( sFile)){
        oConnect = this.fs.readJSON( sFile);
        tableManage.init( oConnect);
      }

    },

    prompting : function(){

      var aPrompts, done = this.async();

        aPrompts = [{
            type    : 'list',
            name    : "type",
            message : "Ajouter : ",
            choices : [
              {
                name : 'un chemin',
                value: 'controller'
            },{
                name : 'un model',
                value: 'model'
            },{
                name : 'une langue',
                value: 'local'
            }
          ]
        }];

        return this.prompt(aPrompts).then(function (oResponse) {
          this.props = oResponse;
          done();
        }.bind(this));

    },
    /**
     * [function description]
     * @return {[type]} [description]
     */
    writing : function(){
      var self = this;
      switch( this.props.type){

        case 'controller':
          this._promptPath();
          break;

        case 'model':
          tableManage.getCheckTable( function(){
            self._promptModel( this.table);
          });

          break;

        case 'local':
          this._promptLocal();
          break;
        default:
          break;
      }

    },

    _promptLocal : function( aTable){

      var aPrompts, done = this.async(), yo = this ;

        aPrompts = [{
          type    : 'input',
          name    : 'lang',
          message : 'locale',
          default : 'en_EN' // Default to current folder name
        }];

        tableManage.init();

        return this.prompt(aPrompts).then( function (oResponse) {
          this._buildLocale( oResponse.lang);
          done();
        }.bind(this));

    },


    _promptModel : function( aTable){

      var aPrompts, done = this.async(), yo = this ;

        aPrompts = [{
          type    : 'checkbox',
          name    : 'table',
          message : 'le model :',
          choices : aTable
        }];

        tableManage.init();

        return this.prompt(aPrompts).then( function (oResponse) {
          var sCond = " TABLE_NAME IN ('" + oResponse.table.join("','")+"') ";
          tableManage.getTableName( function( ){
            yo._buildModel( this.table);
          }, sCond);
          done();
        }.bind(this));

    },

    _buildLocale : function( sLang){
      var yo = this;
      mkdirp( this.destinationPath('locales/' + sLang), function (err) {
        copydir.sync(
          yo.destinationPath('locales/fr_FR') ,
          yo.destinationPath('locales/' + sLang)
        );
      });
    },

    _buildModel : function( oTable){
      var sRoot         = '/complexe',
         // iCountTable   = aTable.length,
          oModelDefault = {},
          y             = 0;

      // model build
//      for(; y < iCountTable ; y++){
      for( var sTable in oTable){

        oModelDefault = oTable[ sTable ];
        this.fs.copyTpl(
          this.templatePath( '_file/classes/model/sub/template.class.php'),
          this.destinationPath( 'classes/model/sub/' + oModelDefault.fileName + '.class.php'),
          oModelDefault
        );
      }
    },


    _promptPath : function(){
      var aPrompts, done = this.async();

        aPrompts = [{
          type    : 'input',
          name    : 'path',
          message : 'le chemin :',
          default : 'nouveauchemin'
        },{
          type    : 'input',
          name    : 'theme',
          message : 'le theme :',
          default : 'default'
        }];

        return this.prompt(aPrompts).then(function (oResponse) {
          this._buildPath( oResponse.path, oResponse.theme);
          done();
        }.bind(this));
    },

    _buildPath: function( sPath, sTheme){

      var aPath        = sPath.split('/'),
          iCount       = aPath.length,
          i            = 0,
          sCurrentPath = '',
          bConf        = true;

      for(; i < iCount ; i++ ){

        sCurrentPath = 'controller/' + aPath[ i ] + '/' + aPath[ i ] + '.php';

        if( fileExists( this.destinationPath( sCurrentPath))){
          bConf        = false;
          this._updateOn('sub', aPath[ i + 1 ], sCurrentPath );
        }else{
          this._buildFile( aPath[ i ], sTheme,  bConf);
        }

      }

    },

    _buildFile : function( sController, sTheme, bConf){

      this.fs.copyTpl(
        this.templatePath( 'controller/newcontroller.php'),
        this.destinationPath( 'controller/' + sController + '/' + sController + '.php'),
        {newController : sController}
      );

      if( bConf){
        this._addOn('conf', sController);
      }

      this._addOn('local', sController);

      this._buildView( sController, sTheme, 'desktop');

    },


    _buildView : function( sController, sTheme, sDevice){
      var i        = 0,
          regDe    = new RegExp("{DEVICE}","g"),
          regCo    = new RegExp("{CTRL}","g"),
          sDest    = '',
          oTplFile = {},
          iCount   = aTplView.length;

      for(; i < iCount ; i++ ){

        oTplFile = aTplView[ i ];
        sDest    = 'webroot/' + sTheme + '/' + oTplFile.dest;

        this.fs.copyTpl(
          this.templatePath( 'webroot/' + oTplFile.tpl ),
          this.destinationPath( sDest.replace( regDe, sDevice).replace( regCo, sController) ),
          {newController : sController}
        );
      }
    },



    _addOn    : function( sKey, sName){

        var oCodeCurrent = replacePattern[ sKey ],
            reg          = new RegExp("<%= newController %>","g"),
            oOpt         = {
              regex      : oCodeCurrent.search,
              replacement: oCodeCurrent.replace.replace( reg, sName),
              recursive  : true,
              paths      : [ this.destinationRoot()+'/.' ],
              include    : oCodeCurrent.path
            };

        replace( oOpt);
    },

    _updateOn    : function( sKey, sName, sFile){

        var oCodeCurrent = replacePattern[ sKey ],
            reg          = new RegExp("<%= newController %>","g"),
            oOpt         = {
              regex      : oCodeCurrent.search,
              replacement: oCodeCurrent.replace.replace( reg, sName),
              recursive  : true,
              paths      : [ this.destinationRoot()+'/'+sFile ],
            };

        replace( oOpt);
    },

    conflicts : function(){},
    install   : function(){},
    end       : function(){}

  });

})();
