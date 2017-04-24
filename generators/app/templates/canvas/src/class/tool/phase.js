

class Phase {

  /**
   *
   *
   */
  constructor( sPhase) {
      this.sPhaseName    = sPhase;
      this.oPhase        = {};
      this.oPhaseCurrent = null;
  }

  /**
   *
   *
   */
  setPhase( sName){
    this.sPhaseName = sName;

    if( this.oPhase[ this.sPhaseName ]){
      this.oPhaseCurrent = this.oPhase[ this.sPhaseName ];
    }
  }

  /**
   *
   *
   */
  computePhase( oPhase){

    this.oPhase = oPhase;
    this.setPhase( this.sPhaseName);

    return this;
  }

  /**
   *
   *
   */
  run(){

    this.oPhaseCurrent.apply( this, arguments);
    return this;
  }
}

export default Phase;
