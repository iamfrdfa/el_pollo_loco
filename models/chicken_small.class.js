/**
 * Represents a tiny chicken as an enemy object in the game.
 * Inherits from MovableObject.
 * @class
 * @extends MovableObject
 */
class TinyChicken extends MovableObject {
    /**
     * Reference to the current game world.
     * @type {?World}
     */
    world;
    
    /**
     * Vertical position of the tiny chicken.
     * @type {number}
     */
    y = 385;
    
    /**
     * Height and width of the tiny chicken (in pixels).
     * @type {number}
     */
    height = 40;
    width = 50;
    
    /**
     * Offset for collision detection.
     * @type {{top: number, bottom: number, left: number, right: number}}
     */
    offset = {
        top: 0,
        bottom: 0,
        right: 5,
        left: 5,
    }
    
    /**
     * Image paths for the tiny chicken's walking animation.
     * @type {string[]}
     */
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];
    
    /**
     * Image path for the dead tiny chicken.
     * @type {string[]}
     */
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ]
    
    /**
     * Indicates whether the tiny chicken is currently dying.
     * @type {boolean}
     */
    isDying = false;
    
    /**
     * Creates a new instance of TinyChicken and initializes it.
     * Loads images and starts the animation.
     *
     * @constructor
     */
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        super.loadImages(this.IMAGES_WALKING);
        super.loadImages(this.IMAGES_DEAD);
        
        this.x = this.getRandomPosition();
        this.speed = 0.2 + Math.random() * 0.6;
        this.animate();
    }
    
    /**
     * Generates a random position for the tiny chicken.
     * Places the chicken on the field considering the end boss and minimum distance.
     * Falls back to a safe position if no valid position is found.
     * @returns {number} X-position for the tiny chicken
     */
    getRandomPosition() {
        const endBossPosition = 2200;
        const safetyDistanceBoss = 350;
        const maxAttempts = 10;
        let attempts = 0;
        let position;
        
        do {
            position = Math.random() * (endBossPosition - safetyDistanceBoss);
            attempts++;
            
            if (attempts >= maxAttempts) {
                position = this.world?.character?.x + 500 || 500;
                break;
            }
        } while (
            this.world &&
            this.world.character &&
            !this.world.isValidSpawnPosition(position)
            );
        
        return position;
    }
    
    /**
     * Plays the death animation, shows the death image and removes the tiny chicken
     * from the game after 1 second.
     * Prevents multiple executions.
     */
    playDeathAnimation() {
        if (this.isDying) return;
        
        this.isDying = true;
        this.speed = 0;
        this.img = this.imageCache[this.IMAGES_DEAD[0]];
        
        setTimeout(() => {
            const index = this.world?.level?.enemies?.indexOf(this);
            if (this.world && index > -1) {
                this.world.level.enemies.splice(index, 1);
            }
        }, 1000);
    }
    
    /**
     * Starts the movement and animation cycles for the tiny chicken.
     * Moves the tiny chicken to the left and plays the walking animation if not dying.
     */
    animate() {
        setInterval(() => {
            if (!this.isDying) {
                this.moveLeft();
            }
        }, 1000 / 60);
        
        setInterval(() => {
            if (!this.isDying) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }
}
