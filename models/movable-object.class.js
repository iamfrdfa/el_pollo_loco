/**
 * This class represents a movable object in the game.
 * It includes methods for movement, collision, animation, gravity, and states like health, immunity, etc.
 * Inherits from {@link DrawableObject}.
 *
 * @class
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
    /**
     * Horizontal movement speed.
     * @type {number}
     */
    speed = 0.15;
    
    /**
     * Indicates whether the object is facing the opposite direction.
     * @type {boolean}
     */
    otherDirection = false;
    
    /**
     * Vertical speed (e.g., for jumping).
     * @type {number}
     */
    speedY = 0;
    
    /**
     * Acceleration in the Y direction (e.g., gravity).
     * @type {number}
     */
    acceleration = 1;
    
    /**
     * Energy level (hit points).
     * @type {number}
     */
    energy = 100;
    
    /**
     * Timestamp of the last hit (in ms).
     * @type {number}
     */
    lastHit = 0;
    
    /**
     * Maximum number of collectible coins.
     * @type {number}
     */
    maxCoinAmount = 5;
    
    /**
     * Maximum number of collectible bottles.
     * @type {number}
     */
    maxBottleAmount = 5;
    
    /**
     * Energy level of the endboss (if applicable).
     * @type {number}
     */
    endbossEnergy = 100;
    
    /**
     * Immunity duration after being hit (in seconds).
     * @type {number}
     */
    immunityTime = 1;
    
    /**
     * Applies gravity to the object and updates speedY (called periodically).
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }
    
    /**
     * Checks whether the object is above the ground.
     * Always true for ThrowableObject, otherwise y < 230.
     * @returns {boolean} true if above ground
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 230;
        }
    }
    
    /**
     * Checks whether this object is colliding with another object.
     *
     * @param {MovableObject} mo - The other game object
     * @returns {boolean} true if a collision is detected
     */
    isColliding(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom >= mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }
    
    /**
     * Called when the object (e.g., Character) is hit.
     * Reduces energy only if not immune.
     */
    hit() {
        if (!this.isImmune()) {
            this.energy -= 20;
            if (this.energy < 0) {
                this.energy = 0;
            }
            this.lastHit = new Date().getTime();
            if (this instanceof Character) {
                this.world.statusBar.setPercentage(this.energy);
                this.checkAndHealAfterHit(); // new line
            }
        }
    }
    
    /**
     * Checks if the object was recently hurt (used for animation).
     * @returns {boolean} true if the last hit was less than 0.5s ago
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 0.5;
    }
    
    /**
     * Checks if the object is currently immune to damage.
     * @returns {boolean} true if immunity is still active
     */
    isImmune() {
        if (this.lastHit === 0) return false;
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < this.immunityTime;
    }
    
    /**
     * Checks if the character can be healed after taking damage,
     * using collected coins. Resets coins if healed.
     */
    checkAndHealAfterHit() {
        if (this.coinAmount >= this.maxCoinAmount && this.energy < 100) {
            this.energy = Math.min(this.energy + 20, 100);
            this.coinAmount = 0;
            if (this instanceof Character) {
                this.world.statusBar.setPercentage(this.energy);
                this.world.statusBarCoin.setPercentageCoin(0);
            }
        }
    }
    
    /**
     * Checks whether the object (or endboss) is dead.
     * @returns {boolean} true if energy <= 0
     */
    isDead() {
        if (this instanceof Endboss) {
            return this.endbossEnergy <= 0;
        }
        return this.energy <= 0;
    }
    
    /**
     * Plays an animation using an array of image paths.
     * @param {string[]} images - Array of image paths
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
    
    /**
     * Moves the object to the right.
     */
    moveRight() {
        this.x += this.speed;
    }
    
    /**
     * Moves the object to the left.
     */
    moveLeft() {
        this.x -= this.speed;
    }
    
    /**
     * Makes the object jump by setting vertical speed.
     */
    jump() {
        this.speedY = 30;
    }
}
