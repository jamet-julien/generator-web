var childProcess = require('child_process');
var chokidar     = require('chokidar');


function runScript( scriptPath) {

    var invoked = false;

    var process = childProcess.fork(scriptPath);

    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;;
    });

    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
    });

}
// https://github.com/styledown/styledown
// Now we can run a script and invoke a callback when complete, e.g.


chokidar.watch('webroot/**/*.(js)',{ignored: /(node_modules|bower_components|dist|_build)/}).on('change', function(event, path){

  runScript('./_build/build.js');

});
