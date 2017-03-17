import test from './class/test.js';

var oTest = new test();

alert( oTest.nom);


/******************************************************************
                      _        __        __         _
  ___  ___ _ ____   _(_) ___ __\ \      / /__  _ __| | _____ _ __
 / __|/ _ \ '__\ \ / / |/ __/ _ \ \ /\ / / _ \| '__| |/ / _ \ '__|
 \__ \  __/ |   \ V /| | (_|  __/\ V  V / (_) | |  |   <  __/ |
 |___/\___|_|    \_/ |_|\___\___| \_/\_/ \___/|_|  |_|\_\___|_|

******************************************************************/

if ( 'serviceWorker' in navigator ) {

  navigator.serviceWorker.register('sw.js').then( function(registration) {

    registration.onupdatefound = function() {

        if ( navigator.serviceWorker.controller) {
          var installingWorker = registration.installing;

          installingWorker.onstatechange = function() {

            switch (installingWorker.state) {

              case 'installed':
                // mise en cache OK
                break;

              case 'redundant':
              default:
                // Service est devenu redondant.
            }
          };
      }
    };

  }).catch(function(e) {
    // pas trouvé le worker
  });
}
