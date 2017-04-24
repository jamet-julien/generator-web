import Spritesheet from './spritesheet.js';
import Animate     from './animate.js';
import { indexToXY, XYToIndex} from '../lib/utility.js';

/**
 * [_treatVariable description]
 * @param  {[type]} mVar [description]
 * @return {[type]}      [description]
 */
function _treatVariable( mVarious){

  if( mVarious instanceof Spritesheet){
    this.spritesheet = mVarious;
  }else{
    this.load( mVarious);
  }

  return this;

}

/**
 * [_animeFrame description]
 * @return {[type]} [description]
 */
function _animeFrame( mVarious){
  let iCurrentFrame = 0;

  if( this.anim.delay++ >= this.cadence){

      this.anim.delay = 0;
      this.anim.indexCounter++;

      if( this.anim.indexCounter >= mVarious.length){
        this.anim.indexCounter = 0;
      }

      iCurrentFrame = this.anim.indexCounter;
      this.anim.currentFrame = mVarious[ iCurrentFrame ];
  }

  return this.anim.currentFrame;

}

class Sprite{

  /**
   *
   */
  constructor( mVarious, iCadence){

    this.spritesheet     = null;
    this.is_pattern      = false;
    this.pattern         = null;
    this.pattern_x_times = 0;
    this.cadence         = iCadence || 3;

    this._tmp            = {};
    this.anim            = new Animate( 0, 0, 0);
    this.ctx             = null;

    _treatVariable.call( this, mVarious);

  }

  /**
   *
   */
  load( sFilename){
    this.spritesheet = Spritesheet.getInstance( sFilename);
    return this;
  }

  /**
   *
   */
  draw( oCtx,  iX, iY, mVarious){

    let aRes = [],
        iCurrentFrame;

    if( Number.isInteger( mVarious)){

      aRes = indexToXY( Math.abs( mVarious), this.grid);

      oCtx.drawImage(
          this.image,
          aRes[0] * this.width,
          aRes[1] * this.height,
          this.width,
          this.height,
          iX, iY,
          this.width, this.height
      );

    }else if( Array.isArray( mVarious)){

      iCurrentFrame = _animeFrame.call( this, mVarious);

      aRes = indexToXY( Math.abs( iCurrentFrame), this.grid);

      oCtx.drawImage(
          this.image,
          aRes[0] * this.width,
          aRes[1] * this.height,
          this.width,
          this.height,
          iX, iY,
          this.width, this.height
      );

    }else{
      oCtx.drawImage( this.image, iX, iY, this.width, this.height);
    }

  }

  /**
   *
   */
  rot( oCtx,  iX, iY, iAngle){

    oCtx.rotate( this.image,
                   iX,iY,
                   this.width,
                   this.height,
                   iAngle);

  }

  /**
   *
   */
  rotAnim( oCtx,  iX, iY, iAngle, aSequence)
  {
    let iCurrentFrame = _animeFrame.call( this, aSequence);
    let aRes = indexToXY( Math.abs( iCurrentFrame), this.grid);
    oCtx.rotateAnime( this.image,
                        iX,iY,
                        this.width,
                        this.height,
                        iAngle,
                        aRes)
  };

  /**
   * [image description]
   * @return {[type]} [description]
   */
  get image(){
    return this.spritesheet.image;
  }

  /**
   * [width description]
   * @return {[type]} [description]
   */
  get width(){
    return this.spritesheet.width;
  }

  /**
   * [width description]
   * @return {[type]} [description]
   */
  get grid(){
    return this.spritesheet.grid;
  }

  /**
   * [height description]
   * @return {[type]} [description]
   */
  get height(){
    return this.spritesheet.height;
  }

}


export default Sprite;
