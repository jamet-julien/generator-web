(function(){
  'use strict';

  var generators   = require('yeoman-generator'),
      copydir      = require('copy-dir'),
      gitClone     = require('git-clone'),
      _            = require('lodash'),
      tableManage  = require('./tableManage'),
      fileExists   = require('file-exists'),
      connection;

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
                    name : 'html, js, css, canvas',
                    value: 'canvas'
                },{
                    name : 'html, js, postcss',
                    value: 'medium'
                },{
                    name : 'php, html, js, postcss',
                    value: 'complexe_postcss'
                },{
                    name : 'php, html, js, css',
                    value: 'complexe_css'
                },{
                    name : 'banner',
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
            //tableManage.getTableRelation( function(){
                yo._buildComplexe( this.table, '/'+sFolder);
            //});
          });

          done();

        }.bind( this));


    },


    _writeIgnore : function(){
        var string = `*~
        .DS_Store
        .babelrc
        package.json
        _tmp/*
        _stat/*
        _TODO/*
        _build/*
        _TODO.php
        node_modules/*
        deployment-config.json
        yo-config.json`;

        this.fs.writeFile( this.destinationPath('.gitignore'), string, { flag: 'wx' }, function (err) {
            if (err) throw err;
        });

    },

    /**
     * [function description]
     * @return {[type]} [description]
     */
    _buildSimple : function( sFolder){
      var sRoot = sFolder || "simple";
      copydir.sync( this.templatePath() + '/' + sRoot, this.destinationPath());
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

        this.npmInstall();

    },

    end       : function(){}

  });

})();
