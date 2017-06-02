import  {mobileAndTabletcheck} from './lib/utility.js';

var oBreakpoint = {
  width : {
    tiny     : [   0, 340],
    small    : [ 341, 400],
    medium   : [ 401, 518],
    grande   : [ 519, 896],
    large    : [ 897, 1232],
    s_large  : [ 1232, 1640],
    x_large  : [ 1640, 10000]
  }
};




if ( mobileAndTabletcheck() && 'ontouchstart' in window) {
  /*oBreakpoint = {
      breakpoint_mode : true,
      breakpoint : [
                    "320x480",
                    "320x568",
                    "360x640",
                    "375x667",
                    "412x732",
                    "414x736",
                    "750x1334"
                    "768x1024",
                    "1024x1366",
                  ]

    };*/
}

export default oBreakpoint;
