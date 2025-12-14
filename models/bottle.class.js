/**
 * Represents a bottle in the game that can be collected or thrown.
 * This class extends MovableObject.
 */
class Bottle extends MovableObject {
    /**
     * The Y position of the bottle.
     * @type {number}
     */
    y = 380;
    
    /**
     * The height of the bottle.
     * @type {number}
     */
    height = 400 / 8;
    
    /**
     * The width of the bottle.
     * @type {number}
     */
    width = 400 / 8;
    
    /**
     * Offset for collision detection.
     * @type {{top: number, bottom: number, left: number, right: number}}
     */
    offset = {
        top: 10,
        bottom: 5,
        left: 20,
        right: 10,
    }
    
    /**
     * Array with image paths for the bottle on the ground.
     * @type {string[]}
     */
    BOTTLE_ON_GROUND = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    ];
    
    /**
     * Creates a new bottle.
     */
    constructor() {
        super().loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.loadImages(this.BOTTLE_ON_GROUND);
        /**
         * The X position is randomly set within the range.
         * @type {number}
         */
        this.x = 100 + Math.random() * 2000;
    }
}