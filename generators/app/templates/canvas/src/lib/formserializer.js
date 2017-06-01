

var FormSerializer = function( oData, fAction ){

  var _element     = null,
      _isForm      = false,
      _data        = new FormData(),
      _action      = fAction || function( aData){},
      _obj         = {},
      _dynFunction = {};

  if( oData instanceof NodeList){

    _element = [].slice.call( oData);

  }else if( oData instanceof Element){

    if( oData.tagName.toLowerCase() !== 'form'){
      _element = [oData];
    }else{
      _isForm = true;
      _data   = new FormData( oData);
    }

  }

  /***************************************************
    ______   ___   _
   |  _ \ \ / / \ | |
   | | | \ V /|  \| |
   | |_| || | | |\  |
   |____/ |_| |_| \_|
  ***************************************************/
  /**
   * [_buildInputGetValue description]
   * @param  {[type]} oElement [description]
   * @param  {[type]} sKey     [description]
   * @param  {[type]} action   [description]
   * @return {[type]}          [description]
   */
  _dynFunction._buildInputGetValue = function( oElement, sKey, action) {
   return function( e){
     _insert( sKey, oElement.value);
     action.call( oElement, _obj);
   };
  }

  /**
  * [_buildCheckboxGetValue description]
  * @param  {[type]} oElement [description]
  * @param  {[type]} sKey     [description]
  * @param  {[type]} action   [description]
  * @return {[type]}          [description]
  */
  _dynFunction._buildCheckboxGetValue = function( oElement, sKey, action) {
     return function( e){

     if( oElement.checked){
       _insert( sKey, oElement.value);
     }else if( sKey in _obj){
       _delete( sKey);
     }
     action.call( oElement, _obj);
   };
  }

  /**
  * [_buildFileGetValue description]
  * @param  {[type]} oElement [description]
  * @param  {[type]} sKey     [description]
  * @param  {[type]} action   [description]
  * @return {[type]}          [description]
  */
  _dynFunction._buildFileGetValue = function( oElement, sKey, action) {

      var oReader = new FileReader();

      oReader.onloadend = function(e) {
        if (e.target.readyState == FileReader.DONE) { // DONE == 2
           oElement.result = e.target.result;
          _insert( sKey, e.target.result, oElement.value);
        }
      };

     return function( e){
                var sValue;

               if( e && e.target && e.target.files[0]){
                 oReader.readAsDataURL( e.target.files[0]);
               }else if( sKey in _obj){
                 _delete( sKey);
               }else{
                 sValue = oElement.result || oElement.value;
                 _insert( sKey, sValue);
               }

               action.call( oElement, _obj);
           };
  }

  /****************************************************
    _____ _   _ _   _  ____ _____ ___ ___  _   _
   |  ___| | | | \ | |/ ___|_   _|_ _/ _ \| \ | |
   | |_  | | | |  \| | |     | |  | | | | |  \| |
   |  _| | |_| | |\  | |___  | |  | | |_| | |\  |
   |_|    \___/|_| \_|\____| |_| |___\___/|_| \_|

  *****************************************************/

  /**
   * [_init description]
   * @return {[type]} [description]
   */
  function _init(){
    var i        = 0,
        iLen     = _element.length,
        oElement = null,
        oData    = {},
        sKey     = '';

    for(; i < iLen ; i++ ){

      oElement = _element[ i ];
      sKey     = oElement.getAttribute( "name") || '';

      if( sKey !== ''){
        _computeListener( sKey, oElement);
      }
    }
  }

  /**
   * [_insert description]
   * @param  {[type]} sKey   [description]
   * @param  {[type]} sValue [description]
   * @return {[type]}        [description]
   */
  function _insert( sKey, sValue, filename){
    //var fInsert = _data.has( sKey)? 'set' : 'append';
    //_data[ fInsert ].apply( _data, arguments);
    _obj[ sKey ] = sValue;

  }


  /**
   * [_insert description]
   * @param  {[type]} sKey   [description]
   * @param  {[type]} sValue [description]
   * @return {[type]}        [description]
   */
  function _delete( sKey){

    //if( _data.has( sKey)){
    // _data.delete( sKey);
      delete _obj[ sKey ];
    //}

  }

  /**
   *
   */
  function _computeListener( sKey, oElement){

    var sName   = oElement.tagName.toLowerCase(),
        sType   = (oElement.getAttribute('type') || '').toLowerCase(),
        sAction = sName !== 'select' ? 'input' : 'change',
        sMethode = '_buildInputGetValue',
        fAction;

    sAction = ( !~[ 'radio', 'checkbox', 'file'].indexOf( sType))? sAction : 'change';

    if( sType == 'checkbox'){
      sMethode = '_buildCheckboxGetValue'
    }else if( sType == 'file'){
      sMethode = '_buildFileGetValue';
    }

    fAction = _dynFunction[ sMethode ]( oElement, sKey, _action);

    oElement.addEventListener( sAction, fAction);
    fAction();
  }


  _isForm || _init();

  return {
    formData  : _data,
    object    : _obj
  };

};

export default FormSerializer;
