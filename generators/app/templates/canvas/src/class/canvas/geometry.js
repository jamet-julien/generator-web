


class Geometry{


  constructor( oContext){
    this.context = oContext.context;
    this.begin   = false;
  }

  /**
   *
   */
  beginPath(){

    if( !this.begin){
      this.context.beginPath();
      this.begin = true;
    }else{
      this.closePath()
          .beginPath();
    }

    return this;
  }

  /**
   * [font description]
   * @param  {[type]} sString [description]
   * @return {[type]}         [description]
   */
  set font( sString){
    this.context.font = sString;
  }

  /**
   * [font description]
   * @param  {[type]} sString [description]
   * @return {[type]}         [description]
   */
  set textAlign( sString){
    this.context.textAlign = sString;
  }

  /**
   *
   */
  closePath(){

    this.context.closePath();
    this.begin = false;

    return this;
  }

  /**
   *
   */
  moveTo( iX, iY){
      this.context.moveTo( iX, iY);
      return this;
  }

  /**
   *
   */
  fillText( sString, x, y){
    this.context.fillText(  sString, x, y);
    return this;
  }

  /**
   *
   */
  pattern( oSprite , _sMode){

    var sMode  = _sMode|| "repeat",
        mValue = this.context.createPattern( oSprite.image, sMode);

    return this.fill( mValue);
  }

  /**
   * [fillStyle description]
   * @param  {[type]} mValue [description]
   * @return {[type]}        [description]
   */
  fill( mValue){

    this.context.fillStyle = mValue;
    this.context.fill();

    return this;
  }

  /**
   *
   */
  stroke( mValue, iSize){

      if( iSize){
        this.context.lineWidth = iSize;
      }

      if( mValue){
        this.context.strokeStyle = mValue;
      }

      this.context.stroke();

      return this;
  }

  /**
   *
   */
  rectangle( iX,iY, iWidth, iHeight){

    this.beginPath();
    this.context.rect( iX, iY, iWidth, iHeight);

    return this;
  }

  /**
   *
   */
  circle( iX, iY, iSize){

    this.beginPath();
    this.context.arc( iX, iY, iSize, 0, 2 * Math.PI, false);

    return this;
  }

  /**
  *
  * */
  pie( iSizePart, iX, iY, iSize){

    var arcsector = Math.PI * ( 2 * iSizePart / 100);
    var offset    = Math.PI/2;

    this.beginPath();
    this.context.arc( iX, iY, iSize,  -offset,  arcsector - offset, false);
    this.context.lineTo( iX, iY);

    return this;
  }


  polygon( aPoint){
    var i       = 1,
        iLenght = aPoint.length;

    this.beginPath()
        .moveTo( aPoint[0][0], aPoint[0][1]);

    for(; i < iLenght ; i++ ){
      this.lineTo( aPoint[i][0], aPoint[i][1]);
    }

    this.closePath();

    return this;
  }


  /**
   *
   */
  line( iX, iY, iX2, iY2, icolor, size = 1, cap = "round"){

    //this.beginPath();
     this.context.beginPath();

     this.context.moveTo( iX, iY);
     this.context.lineTo( iX2, iY2);
     this.context.lineWidth   = size;
     this.context.lineCap     = cap;
     this.context.strokeStyle = icolor;
     this.context.stroke();

    //this.closePath();
    //this.stroke( icolor, size);

    return this;

  }

  /**
   *
   */
  point( iX,iY){
    return this.rectangle( iX,iY, 1, 1);
  }

  /**
   *
   */
  lineTo( iX, iY){
      this.context.lineTo( iX, iY);
      return this;
  }


  save(){
    this.context.save();
    return this;
  }

  restore(){
    this.context.restore();
    return this;
  }

  rotate( iAngle){
    this.context.rotate( iAngle);
    return this;
  }

  translate( iX, iY){
    this.context.translate( iX, iY);
    return this;
  }

}


export default Geometry;
