
import Canvas          from './class/canvas/canvas.js';
import Phase           from './class/tool/phase.js';
import Timer           from './class/tool/timer.js';


/*********************************************************
 __     ___    ____  ___    _    ____  _     _____ ____
 \ \   / / \  |  _ \|_ _|  / \  | __ )| |   | ____/ ___|
  \ \ / / _ \ | |_) || |  / _ \ |  _ \| |   |  _| \___ \
   \ V / ___ \|  _ < | | / ___ \| |_) | |___| |___ ___) |
    \_/_/   \_\_| \_\___/_/   \_\____/|_____|_____|____/
**********************************************************/

var W             = window.innerWidth,
    H             = window.innerHeight,
    PAPER         = new Canvas( "paper", W, H ),

    PHASE         = new Phase('setup'),

    oPhase = {
      setup : fnSetup,
      draw  : fnDraw
    },

    datGUI;


/*********************************************************
  _____ _   _ _   _  ____ _____ ___ ___  _   _
 |  ___| | | | \ | |/ ___|_   _|_ _/ _ \| \ | |
 | |_  | | | |  \| | |     | |  | | | | |  \| |
 |  _| | |_| | |\  | |___  | |  | | |_| | |\  |
 |_|    \___/|_| \_|\____| |_| |___\___/|_| \_|

**********************************************************/

/**
 * [fnSetup description]
 * @param  {[type]} iTime [description]
 * @return {[type]}       [description]
 */
function fnSetup( iTime){
  PAPER.init();


  Timer.restart();
  this.setPhase( 'draw');
}


/**
 * [fnDraw description]
 * @param  {[type]} iTime [description]
 * @return {[type]}       [description]
 */
function fnDraw( iTime){
  PAPER.clear();

}



/*********************************************************
   ____ ___  _   _ _____ ___ ____ _   _ ____      _  _____ ___ ___  _   _
  / ___/ _ \| \ | |  ___|_ _/ ___| | | |  _ \    / \|_   _|_ _/ _ \| \ | |
 | |  | | | |  \| | |_   | | |  _| | | | |_) |  / _ \ | |  | | | | |  \| |
 | |__| |_| | |\  |  _|  | | |_| | |_| |  _ <  / ___ \| |  | | |_| | |\  |
  \____\___/|_| \_|_|   |___\____|\___/|_| \_\/_/   \_\_| |___\___/|_| \_|
**********************************************************/

PHASE.computePhase( oPhase);

Timer.setCadence( 12)
     .run( ( iTime) => {
        PHASE.run( iTime);
      }).play();



/*****************************************************************
   ____    _    __  __ _____   ____ _____  _    ____ _____
  / ___|  / \  |  \/  | ____| / ___|_   _|/ \  |  _ \_   _|
 | |  _  / _ \ | |\/| |  _|   \___ \ | | / _ \ | |_) || |
 | |_| |/ ___ \| |  | | |___   ___) || |/ ___ \|  _ < | |
  \____/_/   \_\_|  |_|_____| |____/ |_/_/   \_\_| \_\|_|

*****************************************************************/

document.addEventListener("DOMContentLoaded", ( event) => {
    Timer.start();
});

/*****************************************************************
 __        _____  ____  _  _______ ____
 \ \      / / _ \|  _ \| |/ / ____|  _ \
  \ \ /\ / / | | | |_) | ' /|  _| | |_) |
   \ V  V /| |_| |  _ <| . \| |___|  _ <
    \_/\_/  \___/|_| \_\_|\_\_____|_| \_\

*****************************************************************/

if ( 'serviceWorker' in navigator ) {
  navigator.serviceWorker.register('sw.js');
}

/******************************
  ____  _____ ____  _   _  ____
 |  _ \| ____| __ )| | | |/ ___|
 | | | |  _| |  _ \| | | | |  _
 | |_| | |___| |_) | |_| | |_| |
 |____/|_____|____/ \___/ \____|
 ******************************/
 window.datGUI = datGUI;
 window.onload = function() {
   datGUI = new dat.GUI();
 };
