import  {mobileAndTabletcheck} from './utility.js';


	/**
	 * [_sortDataSize description]
	 * @return {[type]} [description]
	 */
	function _sortDataSize ( oBreak){
		var sKey,
				aValue,
				i,
				tuples = [];


		for( sKey in oBreak){

			oBreak[sKey].sort( function(a, b){
				return a-b;
			});

			if( oBreak[sKey].length == 1){

				oBreak[sKey].push(100000000);

			}
		}

		for ( sKey in oBreak) tuples.push([sKey, oBreak[sKey]]);

		tuples.sort( function(a, b){
			return a[1][0] - b[1][0];
		});

		oBreak = {};

		for ( i = 0; i < tuples.length; i++) {

				sKey   = tuples[i][0];
				aValue = tuples[i][1];

				oBreak[sKey] = aValue;
		}

		return this;
	}

	/**
	 * [_getRatio description]
	 * @param  {[type]} iW [description]
	 * @param  {[type]} iH [description]
	 * @return {[type]}    [description]
	 */
	function _getRatio( iW, iH){
		return Math.round( Math.atan( iW / iH) * 100);
	}

	/**
	 * [_treatBreakPoint description]
	 * @param  {[type]} aBreak [description]
	 * @return {[type]}        [description]
	 */
	function _treatBreakPoint( aIn, oOut){
			var i      = 0,
					iCount = aIn.length,
					aSize  = [],
					tuples = [],
					iValue = 0,
					sKey   = '',
					sName;

			for( ; i < iCount; i++){
				sName = aIn[ i ];

				if( ~aIn[ i ].indexOf('x')){

					aSize = aIn[ i ].split('x');
					oOut.fixed[ sName] = [ parseInt( aSize[0]), parseInt( aSize[1])];

				}else if( ~aIn[ i ].indexOf(':')){

					aSize = aIn[ i ].split(':');
					sName = 'r'+sName.replace(':', '_');

					oOut.ratio[ sName] =  _getRatio( aSize[0], aSize[1]);
				}

			}

			_sortDataSize( oOut.fixed);

			for ( sKey in oOut.ratio) tuples.push([sKey, oOut.ratio[ sKey ]]);

			tuples.sort( function( a, b){
					return a[1] - b[1];
			});

			oOut.ratio = {};

			for ( i = 0; i < tuples.length; i++) {

					sKey   = tuples[i][0];
					iValue = tuples[i][1];

					oOut.ratio[sKey] = iValue;
			}

	}

	/**
	 * [getWidth description]
	 * @return {[type]} [description]
	 */
 function _getWidth(){

	return Math.max(
			 /* document.body.scrollWidth, document.documentElement.scrollWidth, */
				document.body.offsetWidth, document.documentElement.offsetWidth,
				document.body.clientWidth, document.documentElement.clientWidth
			);

	}

	/*
	* [getWidth description]
	* @return {[type]} [description]
	*/
function _getHeight(){

 return Math.max(
			/* document.body.scrollWidth, document.documentElement.scrollWidth, */
			 document.body.offsetHeight, document.documentElement.offsetHeight,
			 document.body.clientHeight, document.documentElement.clientHeight
		 );

	}



	/**
	 * [MediaQuery description]
	 */
	var MediaQuery = function( _oOption){

		var jDefault = {

			breakpoint_mode : false,
			concat          : false,
			wait            : true,
			width           : [],
			height          : [],
			callback        : function(){return false;},
			breakpoint      : []

		},key;

		for ( key in _oOption ) {
		    jDefault[key] = _oOption[key];
		}

		this.bConcat       = jDefault.concat;
		this.bWait         = jDefault.wait;
		this.oWidth        = jDefault.width;
		this.oHeight       = jDefault.height;
		this.aBreakpoint   = jDefault.breakpoint;
		this.fnCb          = jDefault.callback;
		this.bBreakpoint   = jDefault.breakpoint_mode;

		this.bRead         = false;
		this.oTimer        = 0;
		this.oBreakRange   = { fixed : {}, ratio : {}};

		this.sDefaultClass = '';
		this.sKeepClass    = '';

		this.iSensibility  = 250;// en milliseconde

		this.sCompute      = ( this.bBreakpoint)? '_getClassByRatio' : '_getClassBySize';



		this._init();
	};


	MediaQuery.prototype._init = function(){
		this.sDefaultClass = document.body.className;

		if ( mobileAndTabletcheck() && 'ontouchstart' in window) {
		}else{
			this.sDefaultClass += ( this.sDefaultClass.trim() != '')? ' ':'';
			this.sDefaultClass += 'desktop';
		}

		if( !this.bBreakpoint){

			_sortDataSize( this.oWidth);
			_sortDataSize( this.oHeight);

		}else{

			_treatBreakPoint( this.aBreakpoint, this.oBreakRange);

		}

		this.run( true);

		return this;
	};

	/**
	 * [_update description]
	 * @return {[type]} [description]
	 */
	MediaQuery.prototype._update = function( sClass){

		document.body.className = this.sDefaultClass+this.sKeepClass;

		if( sClass !== ''){

			document.body.className += (this.sDefaultClass !== '')? ' ' : '';
			document.body.className += sClass;

			this.fnCb();
		}

		return this;
	};


	/**
	 * [_getClassBySize description]
	 * @return {[type]} [description]
	 */
	MediaQuery.prototype._getClassByRatio = function(){
		var iWidthCurrent  = _getWidth(),
			iHeightCurrent = _getHeight(),
			iRatio         = _getRatio( iWidthCurrent, iHeightCurrent),
			sKeyPrev       = '',
      		sKey;

		for( sKey in this.oBreakRange.fixed){// par  largeur
			if( iWidthCurrent  == this.oBreakRange.fixed[sKey][0] &&
				 	iHeightCurrent == this.oBreakRange.fixed[sKey][1] ){
				return sKey;
			}
		}

		for( sKey in this.oBreakRange.ratio){// par ratio

			if( this.oBreakRange.ratio[sKeyPrev] &&
			    this.oBreakRange.ratio[sKey] &&
				  iRatio >= this.oBreakRange.ratio[sKeyPrev] &&
				  iRatio < this.oBreakRange.ratio[sKey]){
				return sKeyPrev;
			}

			sKeyPrev = sKey;
		}

		return '';
	};

	/**
	 * [_getClassByRatio description]
	 * @return {[type]} [description]
	 */
	MediaQuery.prototype._getClassBySize = function(){
		var iWidthCurrent  = _getWidth(),
				iHeightCurrent = _getHeight(),
				aClass         = [],
				sKey;

		for( sKey in this.oWidth){// gestion largeur

			if( iWidthCurrent >= this.oWidth[sKey][0] &&
				( iWidthCurrent < this.oWidth[sKey][1] || this.bConcat )){

				aClass.push( sKey);
			}
		}

		for( sKey in this.oHeight){// gestion hauteur

			if( iRatio >= this.oHeight[sKey][0] &&
				( iHeightCurrent < this.oHeight[sKey][1] || this.bConcat )){

				aClass.push( sKey);
			}
		}

		return aClass.join(" ");

	};

	/**
	 * [description]
	 * @param  {[type]} sClass [description]
	 * @return {[type]}        [description]
	 */
	MediaQuery.prototype.setKeep = function( sClass){

		this.sKeepClass = ' '+sClass;

		return this;
	};

	/**
	 * [description]
	 * @return {[type]} [description]
	 */
	MediaQuery.prototype.clearKeep = function(){

		this.sKeepClass = '';

		return this;
	};

	/**
	 * [description]
	 * @param  {[type]} sClass [description]
	 * @return {[type]}        [description]
	 */
	MediaQuery.prototype.addKeep = function( sClass){

		this.sKeepClass += ' '+sClass;

		return this;
	}

	/**
	 * [run description]
	 * @return {[type]} [description]
	 */
	MediaQuery.prototype.run  = function( bStart){
		var self = this, sClass;

		bStart = ( typeof( bStart) != 'boolean')? false : bStart ;


		if( this.bWait && !bStart){

			if( this.oTimer !== 0){
				window.clearTimeout( this.oTimer);
			}

			this.oTimer = setTimeout( function(){

					sClass = self[self.sCompute].call( self);
	      	self._update( sClass);

	    }, this.iSensibility);

		}else{

			sClass = this[this.sCompute].call( this);
			this._update( sClass);

		}

	    return this;

	};

export default MediaQuery;
