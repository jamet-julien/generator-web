
function eventHandler( sEventName, oParam) {

  var element     = oParam.element    || document.documentElement,
      bUseCapture = oParam.useCapture || false,
      aList       = oParam.list       || [],
      useArray    = oParam.array      || false,
      fDefault    = function( e){ return true;},
      _handler;

  function _delegateDom( fCriteria) {
      _handler = function ( e) {
        var el = e.target;
        do {
          if ( !fCriteria.call(null, el)) continue;

          e.delegateTarget = el;

          if (typeof oParam.callBack === 'function') {
            oParam.callBack.apply( this, arguments);
          }

          return;

        } while( (el = el.parentNode) );
      };

      return _handler;
  }

  function _delegateList( fCriteria) {
      _handler = function ( e) {

        var i  = aList.length - 1;

        for( ; i >= 0; i-- ){

          if ( !fCriteria.call( this, aList[ i ])) continue;

          e.delegateTarget = aList[ i ];

          if (typeof oParam.callBack === 'function') {
            oParam.callBack.apply( this, arguments);
          }

          break;
        }
      };

      return _handler;
  }

  _handler = useArray ?
                      _delegateList( oParam.criteria || fDefault):
                      _delegateDom(  oParam.criteria || fDefault);

  _handler.addElement = function( element){
    aList.push( element);
  };

  _handler.destroy = function () {
    return element.removeEventListener( sEventName, _handler, bUseCapture);
  };

  element.addEventListener( sEventName, _handler, bUseCapture);

  return _handler;
}

export default eventHandler;
