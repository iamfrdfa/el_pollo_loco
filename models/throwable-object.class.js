/**
 * Class for objects that can be thrown (e.g., bottles).
 * This object has animations for flying and shattering,
 * as well as its own collision and movement logic.
 * Inherits from {@link MovableObject}.
 *
 * @class
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
    /**
     * Image paths for the rotation animation of the bottle during the throw.
     * @type {string[]}
     */
    BOTTLE_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ];
    
    /**
     * Image paths for the splash/shatter animation.
     * @type {string[]}
     */
    BOTTLE_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ];
    
    /**
     * Flag indicating whether the object (e.g., bottle) has already hit an obstacle.
     * @type {boolean}
     */
    hasHitObstacle = false;
    
    /**
     * Flag indicating whether the object is currently in the splash/shatter animation.
     * @type {boolean}
     */
    isSplashing = false;
    
    /**
     * Contains the interval handle of the splash animation.
     * @type {number|undefined}
     */
    splashAnimation;
    
    /**
     * Offset values for collision detection.
     * @type {{top: number, bottom: number, left: number, right: number}}
     */
    offset = {
        top: 10,
        bottom: 10,
        left: 20,
        right: 20
    };
    
    /**
     * Playable audio element for the splash sound.
     * @type {HTMLAudioElement}
     */
    splashing_bottle = new Audio('audio/breaking-bottle.mp3');
    
    /**
     * Creates a new {@link ThrowableObject} object at a given position with a throwing direction.
     * @param {number} x - Start position X
     * @param {number} y - Start position Y
     * @param {boolean} direction - Direction (true/false)
     * @param {boolean} otherDirection - Direction according to character alignment
     */
    constructor(x, y, direction, otherDirection) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        super.loadImages(this.BOTTLE_ROTATION);
        super.loadImages(this.BOTTLE_SPLASH);
        
        /**
         * X-coordinate of the object.
         * @type {number}
         */
        this.x = x;
        /**
         * Y-coordinate of the object.
         * @type {number}
         */
        this.y = y;
        /**
         * Height of the object.
         * @type {number}
         */
        this.height = 60;
        /**
         * Width of the object.
         * @type {number}
         */
        this.width = 50;
        
        /**
         * Determines the direction of the object's movement.
         * @type {boolean}
         */
        this.otherDirection = otherDirection;
        
        this.animate();
        this.throw();
    }
    
    /**
     * Starts the throw of the object, ensures movement and splash when the ground is reached.
     */
    throw() {
        this.speedY = 10;  // Increase for higher throw
        this.applyGravity();
        
        setInterval(() => {
            if (!this.isSplashing) {
                if (this.otherDirection) {
                    this.x -= 15;
                } else {
                    this.x += 15;
                }
                if (this.y + this.height > 430 && !this.hasHitObstacle) {
                    this.playSplashAnimation();
                    this.hasHitObstacle = true;
                }
            }
        }, 50);
    }
    
    /**
     * Checks if the object is still above the ground.
     * @returns {boolean} true as long as the object has not touched the ground
     */
    isAboveGround() {
        return this.y + this.height < 430;
    }
    
    /**
     * Starts the animation loop for the flight rotation, as long as the object is not splashing.
     */
    animate() {
        setInterval(() => {
            if (!this.isSplashing) {
                this.playAnimation(this.BOTTLE_ROTATION);
            }
        }, 100);
    }
    
    /**
     * Plays the splash animation when the object breaks.
     * Plays a sound and then fades out the object.
     */
    playSplashAnimation() {
        this.isSplashing = true;
        let splashIndex = 0;
        this.splashing_bottle.play();
        this.splashAnimation = setInterval(() => {
            if (splashIndex < this.BOTTLE_SPLASH.length) {
                this.img = this.imageCache[this.BOTTLE_SPLASH[splashIndex]];
                splashIndex++;
            } else {
                clearInterval(this.splashAnimation);
                this.width = 0;
                this.height = 0;
            }
        }, 100);
    }
}