(function (global, factory) {

    if (typeof define === "function" && define.amd) define( factory);
    else if (typeof module === "object") module.exports = factory();
    else global.pluginName = factory();

}( this, function () {
    "use strict";

    var Plugin = function(){
      
    };

    return Plugin;
}));
