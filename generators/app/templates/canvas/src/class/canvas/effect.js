import { indexToXY, XYToIndex} from '../lib/utility.js';


class Effect{

  /**
   *
   */
  constructor( oCallback){
    this.x = 0;
    this.y = 0;
    this.callBack = oCallback || function( R, G, B, A){
        return [ R, G, B, A]
    };
  }

  /**
   *
   */
  apply( oCtx){
    let oImageData = oCtx.getPixel(),
        iLength    = oImageData.data.length,
        j          = 0,
        i          = 0,
        iWidth     = oCtx.width,
        aResult    = [];

    for( ; j < iLength; i++ , j +=4 ){

        let [x, y]    = indexToXY( i, iWidth);

        this.x = x;
        this.y = y;

        aResult = this.callBack(
                    oImageData.data[ j + 0],//R
                    oImageData.data[ j + 1],//V
                    oImageData.data[ j + 2],//B
                    oImageData.data[ j + 3]//A
                );

      oImageData.data.set( aResult, j);

    }

    oCtx.setPixel( oImageData);

  }


}


export default Effect;
