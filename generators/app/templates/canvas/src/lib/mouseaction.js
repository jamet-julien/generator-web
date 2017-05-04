import  {mobileAndTabletcheck} from './utility.js';

var oEventAction = {
  down : 'mousedown',
  move : 'mousemove',
  up   : 'mouseup'
};

if ( mobileAndTabletcheck() && 'ontouchstart' in window) {
  oEventAction = {
    down : 'touchstart',
    move : 'touchmove',
    up   : 'touchend'
  };

}

export default oEventAction;
