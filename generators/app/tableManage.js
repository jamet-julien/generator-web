( function(){
  //'use strict';

  /**
   * [_init description]
   * @param  {[type]} oConnect [description]
   * @return {[type]}          [description]
   */
  function _init( oOpConnect){
      _oVarConnect   = oOpConnect || _oVarConnect;
      _oVarConnect.multipleStatements = true;
      _oConnection   = _mysql.createConnection( _oVarConnect);
      return oPublic;
  }

  /**
   * [_saveInfo description]
   * @param  {[type]} err    [description]
   * @param  {[type]} rows   [description]
   * @param  {[type]} fields [description]
   * @return {[type]}        [description]
   */
  function _saveInfo( err, aResult, fields) {

      var iCount        = 0,
          i             = 0,
          oModelSave    = {},
          sTmpName      = aResult[ 0 ].name,
          aRefValid     = ['serial'],
          sModelParent = _.upperFirst( _.camelCase( _oVarConnect.database));

      iCount = aResult.length;

      oModelSave             = {};
      oModelSave.modelRef    = 'id';
      oModelSave.bUseId      = false;
      oModelSave.data        = [];
      oModelSave.field       = [];
      oModelSave.child       = [];
      oModelSave.parent      = [];
      oModelSave.modelParent = sModelParent;


      for(; i < iCount ; i++){


        if( sTmpName != aResult[ i ].name || i == (iCount-1) ){
          this.table[ sTmpName ] = oModelSave;

          sTmpName               = aResult[ i ].name;
          oModelSave             = {};
          oModelSave.modelRef    = 'id';
          oModelSave.bUseId      = false;
          oModelSave.data        = [];
          oModelSave.field       = [];
          oModelSave.modelParent = sModelParent;
          oModelSave.child       = [];
          oModelSave.parent      = [];
        }

        oModelSave.modelName   = _.upperFirst( _.camelCase( aResult[ i ].name));
        oModelSave.modelTable  =  aResult[ i ].name;

        if(  ~aRefValid.indexOf( aResult[ i ].field.toLowerCase() )){
          oModelSave.modelRef    = aResult[ i ].field;
        }

        if( aResult[ i ].field == 'id'){
          oModelSave.bUseId = true;
        }

        oModelSave.fileName    = _.camelCase( aResult[ i ].name).toLowerCase();
        oModelSave.data.push({value : aResult[ i ].field});
        oModelSave.field.push(aResult[ i ].field);

      }
  }

  /**
   * [_computeRelation description]
   * @return {[type]} [description]
   */
  function _computeRelation(err, aResult, fields){
      var iCount        = aResult.length,
          i             = 0,
          oModelCurrent = {};

      for(; i < iCount ; i++){
        oModelCurrent = aResult[ i ];
        oModelCurrent.classChild    = _.upperFirst( _.camelCase( oModelCurrent.childmodel));
        oModelCurrent.classParent   = _.upperFirst( _.camelCase( oModelCurrent.parentmodel));

        if( this.table[ oModelCurrent.parentmodel ]){
            this.table[ oModelCurrent.parentmodel ].child.push( oModelCurrent );
        }

        if( this.table[ oModelCurrent.childmodel ]){
            this.table[ oModelCurrent.childmodel ].parent.push( oModelCurrent );
        }
      }
  }
  /**
   * [_getTableName description]
   * @return {[type]} [description]
   */
  function _getTableRelation( fCallBack ){
      var sQuery2     = 'SELECT DISTINCT i.TABLE_NAME as childmodel , k.REFERENCED_TABLE_NAME as parentmodel , k.COLUMN_NAME as field , k.REFERENCED_COLUMN_NAME as reference FROM information_schema.TABLE_CONSTRAINTS i LEFT JOIN information_schema.KEY_COLUMN_USAGE k ON i.CONSTRAINT_NAME = k.CONSTRAINT_NAME WHERE i.CONSTRAINT_TYPE = \'FOREIGN KEY\' AND i.TABLE_SCHEMA = \''+_oVarConnect.database+'\'';

      _oConnection.query( sQuery2, _computeRelation.bind( oPublic));
      _oConnection.end( function(){
        fCallBack.call( oPublic);
      });
  }

  /**
   * [_getTableName description]
   * @return {[type]} [description]
   */
  function _getTableName( fCallBack , _sCondition){
      var sCondition = _sCondition || '1' ,
          sQuery1     = 'SELECT `TABLE_NAME` as name , `COLUMN_NAME` as field FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = \''+_oVarConnect.database+'\' AND ' + sCondition + ' ORDER BY TABLE_NAME DESC';

      this.table = [];


      _oConnection.connect();
      _oConnection.query( sQuery1, _saveInfo.bind( oPublic));

     _getTableRelation( fCallBack);
  }

  /**
   * [_getTableName description]
   * @return {[type]} [description]
   */
  function _getCheckTable( fCallBack){
      var sQuery = 'SELECT `TABLE_NAME` as name FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = \''+_oVarConnect.database+'\' ORDER BY TABLE_NAME DESC';
      this.table  = [];
      _oConnection.connect();
      _oConnection.query( sQuery, _formatInfo.bind( oPublic));
      _oConnection.end( function(){
        fCallBack.call( oPublic);
      });
  }

  function _formatInfo( err, aResult, fields) {

      var iCount        = 0,
          i             = 0,
          oModelSave    = {};

      iCount = aResult.length;

      for(; i < iCount ; i++){
        oModelSave       = {};
        oModelSave.value = aResult[ i ].name;
        oModelSave.name  = aResult[ i ].name;
        this.table.push( oModelSave);
      }

  }


    /**
     * [_getPrompt description]
     * @return {[type]} [description]
     */
    function _getPrompt( appName){
      return [{
          type    : 'input',
          name    : 'host',
          message : 'host',
          default : 'localhost' // Default to current folder name
      },
      {
          type    : 'input',
          name    : 'user',
          message : 'user',
          default : 'root' // Default to current folder name
      },
      {
          type    : 'input',
          name    : 'password',
          message : 'password',
          default : '' // Default to current folder name
      },
      {
          type    : 'input',
          name    : 'port',
          message : 'port',
          default : '8889' // Default to current folder name
      },
      {
          type    : 'input',
          name    : 'database',
          message : 'database',
          default : appName// Default to current folder name
      }];
    }



/******************************************************************************
  ____  ____   ___   ____ _____ ____  _   _ ____  _____
 |  _ \|  _ \ / _ \ / ___| ____|  _ \| | | |  _ \| ____|
 | |_) | |_) | | | | |   |  _| | | | | | | | |_) |  _|
 |  __/|  _ <| |_| | |___| |___| |_| | |_| |  _ <| |___
 |_|   |_| \_\\___/ \____|_____|____/ \___/|_| \_\_____|

******************************************************************************/


  var _mysql        = require('mysql'),
      _             = require('lodash'),

      _oVarConnect  = {
            host     : 'localhost',
            user     : 'root',
            password : '',
            port     : '8889',
            database : 'socialwall'
      },

      _oConnection,

      oPublic = {
        table             : [],
        init              : _init,
        getTableName      : _getTableName,
        getTableRelation  : _getTableRelation,
        getPrompt         : _getPrompt,
        getCheckTable     : _getCheckTable
      };


  module.exports = oPublic;

})();
