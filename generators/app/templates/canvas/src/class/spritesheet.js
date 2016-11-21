let BUFFER_SPRITESHEET = {};

class Spritesheet {

   constructor( sFilename, { grid, width, height }){
      this.image     = new Image();
      this.image.src = sFilename;

      this.image.addEventListener('load', ()=>{});

      this.grid   = grid   || 1;
      this.width  = width  || 32;
      this.height = height || 32;

  }


  static getInstance( sFilename, { grid, width, height }){
    let oSpriteSheet,
        sId = sFilename + ":" + grid + ":" + width + ":" + height;

    if( BUFFER_SPRITESHEET[ sId ]){

      oSpriteSheet = BUFFER_SPRITESHEET[ sId ];

    }else{
      oSpriteSheet = new Spritesheet( sFilename, { grid, width, height });
      BUFFER_SPRITESHEET[ sId ] = oSpriteSheet;
    }

    return oSpriteSheet;
  }

}


export default Spritesheet
