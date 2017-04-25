import {indexToXY,map} from '../../lib/utility.js';
import Vector          from '../class/canvas/vector.js';
import Geometry        from '../class/canvas/geometry.js';

class Particule {

  /**
   *
   */
  constructor( ctx) {

    var x = map( Math.random(), 0, 1, 0, ctx.width ),
        y = map( Math.random(), 0, 1, 0, ctx.height );

    this.position = new Vector( x , y );

    this.velocity = new Vector( 0, 0);
    this.force    = new Vector( 0, 0),

    this.scene    = ctx;
    this.geometry = new Geometry( this.scene);

  }

  /**
   *
   */
  update(){

    this.velocity.add( this.force);
    this.position.add( this.velocity);
    this.velocity.limit( 5);

    return this;
  }

  /**
   *
   */
  draw(){

    this.geometry.point( this.position.x , this.position.y);

    return this;
  }

}

export default Particule;
