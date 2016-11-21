

class Canvas {

  /**
   *
   */
  constructor( sCanvasId, iWidth, iHeight){
    this.TO_RADIANS      = Math.PI/180;

    this.width    = iWidth;
    this.height   = iHeight;
    this.canvasId = sCanvasId;

    this.canvas   = null;
    this.context  = null;
  }

  /**
   *
   */
  init() {

    this.canvas  = document.getElementById( this.canvasId);
    this.context = this.canvas.getContext('2d');

    this.canvas.setAttribute('width', this.width);
    this.canvas.setAttribute('height', this.height);

    this.canvas.style.width  = this.width + 'px';
    this.canvas.style.height = this.height + 'px';

  }

  /**
   *
   */
  clear(){
    this.context.clearRect( 0, 0, this.width, this.height);
  }

  /**
   *
   */
  drawImage( ...args){

    this.context.drawImage.apply( this.context, args);
    // list args : image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
  }

  /**
   *
   */
  getPixel(){
    let oImageData = this.context.getImageData(0, 0, this.width, this.height);
    return oImageData;
  }

  /**
   *
   */
  setPixel( oImageData){
    this.context.putImageData( oImageData, 0, 0);
    return this;
  }


  /**
   *
   */
  rotate( oImage, iX, iY, iWidth, iHeight,  iAngle){

    this.context.save();
    this.context.translate( iX,  iY);
    this.context.rotate( iAngle * this.TO_RADIANS);
    this.drawImage(
            oImage,
           -( iWidth / 2),
           -( iHeight / 2)
    );
    this.context.restore();

  }

  /**
   *
   */
  rotateAnime( oImage, iX, iY, iWidth, iHeight, iAngle, aCoor){

    this.context.save();

    this.context.translate( iX + ( iWidth/2),
                            iY + ( iHeight/2)
                          );

    this.context.rotate( iAngle * this.TO_RADIANS);

    this.drawImage(
        oImage,//
        aCoor[0] * iWidth,//
        aCoor[1] * iHeight,//
        iWidth,//
        iHeight,//
        -( iWidth/2),
        -( iHeight/2),
        iWidth, iHeight
    );

    this.context.restore();

  }

}

export default Canvas;
