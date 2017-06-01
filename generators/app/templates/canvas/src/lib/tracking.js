class Tracking{

    /**
     * [constructor description]
     * @param  {[type]} aElement [description]
     * @param  {[type]} sEvent   [description]
     * @return {[type]}          [description]
     */
    constructor(aElement, sEvent){
        this.aElement = [].slice.call(aElement);
        this.sEvent = sEvent || 'click';
    }

    /**
     * [trigger description]
     * @return {[type]} [description]
     */
    trigger(){
      var aTracking = ['send','event'],
          aData     = [].slice.call( arguments);

      window.ga.apply(
       window,
       aTracking.concat( aData)
      );
    }

    /**
     * [launch description]
     * @return {[type]} [description]
     */
    launch(){
        this.aElement.map((oElement)=>{
            oElement.addEventListener(this.sEvent, function(){
                var aTracking = ['send','event'],
                    aIndexGA  = ['track_category','track_action','track_label','track_value'],
                    oDataset  = Object.assign({}, this.dataset);
                aIndexGA.forEach(function(element){
                    if( oDataset[element] != undefined)
                        aTracking.push(oDataset[element]);
                })
                window.ga.apply(
                 window,
                 aTracking
                );
            });
        })
    }
}

export default Tracking;
