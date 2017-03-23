(function(){
  'use strict';

  var generators   = require('yeoman-generator'),
      copydir      = require('copy-dir'),
      gitClone     = require('git-clone'),
      _            = require('lodash'),
      tableManage  = require('./tableManage'),
      fileExists   = require('file-exists'),
      fs           = require('fs'),
      mkdirp       = require('mkdirp'),
      connection,
      launchWebpack = false,
      launchInstall = true,

      aTplView  = [
        {tpl : '_api/controller/template/_add.php', dest : '_api/controller/{CTRL}/_add.php'},
        {tpl : '_api/controller/template/_update.php', dest : '_api/controller/{CTRL}/_update.php'},
        {tpl : '_api/controller/template/_read.php', dest : '_api/controller/{CTRL}/_read.php'},
        {tpl : '_api/controller/template/_delete.php', dest : '_api/controller/{CTRL}/_delete.php'},
        {tpl : '_api/controller/template/template.php', dest : '_api/controller/{CTRL}/{CTRL}.php'},
      ];

  module.exports = generators.Base.extend({

    varTpl    : {
      "pathRoot"    : "",
      "modelParent" : ""
    },

    constructor : function(){
        generators.Base.apply( this, arguments);
    },

    initializing : function(){
      var aRoot     = this.destinationRoot().split('htdocs/'),
          sPathRoot = aRoot[1];

      this.varTpl.pathRoot = sPathRoot;
    },

    prompting : function(){

      var aPrompts, done = this.async();

        aPrompts = [{
            type    : 'list',
            name    : "type",
            message : "Quelle type de structure ?",
            choices : [
                {
                    name : 'html, js, css',
                    value: 'simple'
                },{
                    name : 'Structure Canvas',
                    value: 'canvas'
                },{
                    name : 'Plugin js',
                    value: 'medium'
                },/*{
                    name : 'php, html, js, postcss',
                    value: 'complexe_postcss'
                },*/{
                    name : 'Structure Php',
                    value: 'complexe_css'
                },{
                    name : 'Structure API',
                    value: 'full_api'
                },{
                    name : 'Structure Banner',
                    value: 'banner'
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

      switch( this.props.type){
        case 'simple':
          this._buildSimple();
          break;

        case 'canvas':
          this._buildSimple("canvas");
          break;

        case 'medium':
            this._buildSimple("medium");
          break;

        case 'complexe_postcss':
        case 'complexe_css':
          launchWebpack = true;
          this._needMoreInfo( this.props.type);
          break;

        case 'full_api':
          launchWebpack = false;
          launchInstall = false;
          this._needMoreInfo( this.props.type);
          break;

        case 'banner':
          this._buildBanner();
          break;

        default:
          break;
      }

    },

    /**
     * [function description]
     * @return {[type]} [description]
     */
    _needMoreInfo : function( sFolder){

      var aPrompts, done = this.async(), yo = this;

        aPrompts = tableManage.getPrompt( this.appname);

        return this.prompt(aPrompts).then(function (oResponse) {

          var oConnect = {},
              sFile    = this.destinationPath( 'yo-config.json');


          this.varTpl.host        = oResponse.host;
          this.varTpl.user        = oResponse.user;
          this.varTpl.password    = oResponse.password;
          this.varTpl.port        = oResponse.port;
          this.varTpl.database    = oResponse.database;

          this.varTpl.modelParent = _.upperFirst( _.camelCase( oResponse.database));

          oConnect = {
            host        : oResponse.host,
            user        : oResponse.user,
            password    : oResponse.password,
            port        : oResponse.port,
            database    : oResponse.database,
          };

          this.fs.writeJSON( sFile, oConnect);

          tableManage.init( oConnect);

          tableManage.getTableName( function( ){
            if( sFolder == 'full_api'){
              yo._buildComplexeAPI( this.table, '/'+sFolder);

            }else{
              yo._buildComplexe( this.table, '/'+sFolder);
              mkdirp.sync( this.destinationPath()+'/_tmp');

            }
          });

          done();

        }.bind( this));


    },


    _writeIgnore : function(){
        var string = `*~
.DS_Store
_tmp/*
node_modules
yo-config.json`;

        fs.writeFile( this.destinationPath('.gitignore'), string, { flag: 'wx' }, function (err) {
            if (err) throw err;
        });
    },

    /**
     * [function description]
     * @return {[type]} [description]
     */
    _buildSimple : function( sFolder){
      var sRoot = sFolder || "simple";
      copydir.sync(
        this.templatePath() + '/' + sRoot,
        this.destinationPath()
      );
    },

    /**
     * [function description]
     * @param  {[type]} aTable [description]
     * @return {[type]}        [description]
     */
    _buildComplexeAPI : function( oTable, sFolder){
      var sRoot    = sFolder,
          aTplFile = [
            'vars/mysql.vars.php',
            'vars/global.vars.php'
          ],
          iCountTpl     = aTplFile.length,
          oModelDefault = {},
          y             = 0,
          i             = 0;



      // copy all
      copydir.sync( this.templatePath() + sRoot, this.destinationPath());


      //template update
      for( ; i < iCountTpl ; i++){
        this.fs.copyTpl(
          this.templatePath( '_file/_api/' + aTplFile[ i ]),
          this.destinationPath( '_api/'+aTplFile[ i ]),
          this.varTpl
        );
      }

      // model build
      for( var sTable in oTable){
        oModelDefault = oTable[ sTable ];

        this.fs.copyTpl(
          this.templatePath( '_file/_api/classes/model/sub/template.class.php'),
          this.destinationPath( '_api/classes/model/sub/' + oModelDefault.fileName + '.class.php'),
          oModelDefault
        );

        this._buildView( oModelDefault, oModelDefault.fileName );

      }

      //parent model build
      this.fs.copyTpl(
        this.templatePath( '_file/_api/classes/model/template.class.php'),
        this.destinationPath( '_api/classes/model/' + this.varTpl.modelParent.toLowerCase() + '.class.php'),
        oModelDefault
      );

      this._writeIgnore();
    },

    /**
     * [_buildView description]
     * @param  {[type]} oModelDefault [description]
     * @param  {[type]} sController   [description]
     * @return {[type]}               [description]
     */
    _buildView : function( oModelDefault, sController){
      var i        = 0,
          regCo    = new RegExp("{CTRL}","g"),
          sDest    = '',
          oTplFile = {},
          iCount   = aTplView.length;

      for(; i < iCount ; i++ ){

        oTplFile = aTplView[ i ];
        sDest    = oTplFile.dest;

        this.fs.copyTpl(
          this.templatePath( '_file/' + oTplFile.tpl ),
          this.destinationPath( sDest.replace( regCo, sController) ),
          oModelDefault
        );
      }
    },

    /**
     * [function description]
     * @param  {[type]} aTable [description]
     * @return {[type]}        [description]
     */
    _buildComplexe : function( oTable, sFolder){
      var sRoot    = sFolder || '/complexe_postcss',
          aTplFile = [
            'vars/mysql.vars.php',
            'vars/global.vars.php'
          ],
          iCountTpl     = aTplFile.length,
          oModelDefault = {},
          y             = 0,
          i             = 0;

      // copy all
      copydir.sync( this.templatePath() + sRoot, this.destinationPath());


      //template update
      for( ; i < iCountTpl ; i++){
        this.fs.copyTpl(
          this.templatePath( '_file/' + aTplFile[ i ]),
          this.destinationPath( aTplFile[ i ]),
          this.varTpl
        );
      }

      // model build
      for( var sTable in oTable){
        oModelDefault = oTable[ sTable ];

        this.fs.copyTpl(
          this.templatePath( '_file/classes/model/sub/template.class.php'),
          this.destinationPath( 'classes/model/sub/' + oModelDefault.fileName + '.class.php'),
          oModelDefault
        );

      }

      //parent model build
      this.fs.copyTpl(
        this.templatePath( '_file/classes/model/template.class.php'),
        this.destinationPath( 'classes/model/' + this.varTpl.modelParent.toLowerCase() + '.class.php'),
        oModelDefault
      );

      this._writeIgnore();
    },

    _buildBanner : function(){
      var sRoot = '/banner';
      copydir.sync( this.templatePath() + sRoot, this.destinationPath());
    },

    conflicts : function(){},

    install   : function(){

      if(launchInstall == true){
        console.log('npm install');
        this.npmInstall();
      }
    },

    end       : function(){

      if( launchWebpack){
        this.spawnCommand('npm', ['start']);
      }
    }

  });

})();
