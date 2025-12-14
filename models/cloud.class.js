/**
 * Represents a cloud in the game.
 * This class extends MovableObject and handles animated cloud movement.
 */
class Cloud extends MovableObject {
    /**
     * The Y-position of the cloud.
     * @type {number}
     */
    y = 20;
    
    /**
     * The height and width of the cloud.
     * @type {number}
     */
    height = 250;
    width = 500;
    
    /**
     * Creates a new cloud and starts the animation.
     */
    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        /**
         * The X-position is chosen randomly.
         * @type {number}
         */
        this.x = Math.random() * 500;
        this.animate();
    }
    
    /**
     * Starts the movement of the cloud to the left.
     */
    animate() {
        this.moveLeft();
    }
}
