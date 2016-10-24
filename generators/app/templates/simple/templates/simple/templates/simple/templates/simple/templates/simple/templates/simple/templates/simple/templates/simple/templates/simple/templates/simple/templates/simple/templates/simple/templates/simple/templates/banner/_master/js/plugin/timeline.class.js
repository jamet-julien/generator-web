(function( win, doc){
	var Timeline = function Timeline( json){

			var oPublic = {
						run : run
			},
			_json = json;

			/**
			 * [_launchAnimation description]
			 * @param  {[type]} iStep     [description]
			 * @param  {[type]} iTimeline [description]
			 * @return {[type]}           [description]
			 */
			function _launchAnimation(  iStep, iTimeline){

					setTimeout( function(){
							var el  = doc.querySelector( _json[ iStep ].selector);

							if( el){
								el.classList.add(_json[ iStep ].step);
							}

					}, iTimeline);

			}

			/**
			 * [run description]
			 * @return {[type]} [description]
			 */
			function run(){
					var _iTimeline = 0, iStep = 0, iCount = _json.length;

					for(; iStep < iCount; iStep++){
							_iTimeline = parseInt( _json[ iStep ].delay, 10) + parseInt( _iTimeline, 10);
							_launchAnimation( iStep, _iTimeline);
					}
			}

			return oPublic;

	};

	win.Timeline = Timeline;

})( window, document);
