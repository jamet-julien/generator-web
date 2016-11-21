window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

var _fCallBack = function( iTime){},
    _iThen     = 0,
    _iInterval = 10,
    _bPlay     = true,
    _iBegin    = null,
    _oCounter = null;




class Timer {

/*
  constructor() {
    this.out = false;
  }
*/

  /**
   *
   */
  static setCounter( oCounter){
    _oCounter = oCounter;
    return Timer;
  }

  /**
   *
   *
   */
  static restart(){
    _iBegin    = null;
    return Timer;
  }


  /**
   *
   *
   */
  static setCadence( iCadence){
    Timer.restart();
    _iInterval = iCadence;
    return Timer;
  }

  /**
   *
   *
   */
  static run( fCallBack){
    _fCallBack = fCallBack;
    return Timer;
  }

  /**
   *
   *
   */
  static start(){

    if( _bPlay){
      requestAnimationFrame( Timer.start);
    }

    var iNow   = Date.now();
    var iDelta = iNow - _iThen;

    if( _oCounter){
      _oCounter.run( iNow);
    }

    if ( iDelta > _iInterval && _bPlay ){
      _iThen = iNow - ( iDelta % _iInterval);

      if( _iBegin == null) {
        _iBegin = _iThen;
      }

      _fCallBack.call( null, _iThen - _iBegin);
    }
  }

  static play(){
    _bPlay = true;
  }

  static stop(){
    _bPlay = false;
  }

  /**
   *
   *
   */
  static togglePlay(){
    _bPlay = !_bPlay;
  }

}

export default Timer;
