/**
 * Represents the final boss in the game.
 * Contains animations, movement, collision logic and status flags.
 * Inherits from MovableObject.
 *
 * @class
 * @extends MovableObject
 */
class Endboss extends MovableObject {
    /**
     * Height of the end boss in pixels.
     * @type {number}
     */
    height = 400;
    
    /**
     * Width of the end boss in pixels.
     * @type {number}
     */
    width = 300;
    
    /**
     * Y-position of the end boss on the game field.
     * @type {number}
     */
    y = 55;
    
    /**
     * Offset for the collision logic.
     * @type {{top: number, bottom: number, right: number, left: number}}
     */
    offset = {
        top: 70,
        bottom: 10,
        right: 10,
        left: 35
    }
    
    /**
     * Contains image paths for the walking animation.
     * @type {string[]}
     */
    IMAGES_WALKING = [
        'img/4_enemy_boss_chicken/1_walk/G1.png',
        'img/4_enemy_boss_chicken/1_walk/G2.png',
        'img/4_enemy_boss_chicken/1_walk/G3.png',
        'img/4_enemy_boss_chicken/1_walk/G4.png'
    ];
    
    /**
     * Contains image paths for the "Hurt" animation.
     * @type {string[]}
     */
    IMAGES_HURT = [
        'img/4_enemy_boss_chicken/4_hurt/G21.png',
        'img/4_enemy_boss_chicken/4_hurt/G22.png',
        'img/4_enemy_boss_chicken/4_hurt/G23.png'
    ];
    
    /**
     * Contains image paths for the "Alert" warning animation.
     * @type {string[]}
     */
    IMAGES_ALERT = [
        'img/4_enemy_boss_chicken/2_alert/G5.png',
        'img/4_enemy_boss_chicken/2_alert/G6.png',
        'img/4_enemy_boss_chicken/2_alert/G7.png',
        'img/4_enemy_boss_chicken/2_alert/G8.png',
        'img/4_enemy_boss_chicken/2_alert/G9.png',
        'img/4_enemy_boss_chicken/2_alert/G10.png',
        'img/4_enemy_boss_chicken/2_alert/G11.png',
        'img/4_enemy_boss_chicken/2_alert/G12.png'
    ];
    
    /**
     * Contains image paths for the death animation.
     * @type {string[]}
     */
    IMAGES_DEATH = [
        'img/4_enemy_boss_chicken/5_dead/G24.png',
        'img/4_enemy_boss_chicken/5_dead/G25.png',
        'img/4_enemy_boss_chicken/5_dead/G26.png'
    ];
    
    /**
     * Reference to the world instance.
     * @type {Object}
     */
    world;
    
    /**
     * Image index of the current animation.
     * @type {number}
     */
    currentImage = 0;
    
    /**
     * ID of the interval for animations.
     * @type {number}
     */
    animationInterval;
    
    /**
     * ID of the interval for the movement logic.
     * @type {number}
     */
    movementInterval;
    
    /**
     * Indicates whether the Hurt animation is currently playing.
     * @type {boolean}
     */
    isHurtAnimation = false;
    
    /**
     * Indicates whether the end boss is dying.
     * @type {boolean}
     */
    isDying = false;
    
    /**
     * Movement direction: true = forward, false = backward.
     * @type {boolean}
     */
    isMovingForward = true;
    
    /**
     * Number of steps forward.
     * @type {number}
     */
    stepsForward = 0;
    
    /**
     * Number of steps backward.
     * @type {number}
     */
    stepsBackward = 0;
    
    /**
     * Maximum steps forward.
     * @type {number}
     */
    maxStepsForward = 10;
    
    /**
     * Maximum steps backward.
     * @type {number}
     */
    maxStepsBackward = 1;
    
    /**
     * Movement speed.
     * @type {number}
     */
    speed = 10;
    
    /**
     * Audio track for hit feedback.
     * @type {HTMLAudioElement}
     */
    endboss_hit = new Audio('audio/endboss-hit.mp3');
    
    /**
     * Flag, if the alert animation was triggered once.
     * @type {boolean}
     */
    hasTriggeredAlert = false;
    /**
     * Flag, if the alert animation is currently playing.
     * @type {boolean}
     */
    isPlayingAlert = false;
    
    /**
     * Counter for current alert frame.
     * @type {number}
     */
    alertAnimationFrame = 0;
    
    /**
     * Initializes the end boss with all animations, images, and starts animation and movement.
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEATH);
        this.loadImages(this.IMAGES_ALERT);
        this.x = 2200;
        this.startAnimation();
        this.initMovement();
        this.endboss_hit.volume = 0.2;
    }
    
    /**
     * Starts the alert animation, when the character is nearby - only once.
     */
    playAlertAnimation() {
        if (this.hasTriggeredAlert || this.isPlayingAlert) return;
        
        this.isPlayingAlert = true;
        this.alertAnimationFrame = 0;
        
        const alertInterval = setInterval(() => {
            if (this.alertAnimationFrame < this.IMAGES_ALERT.length) {
                this.img = this.imageCache[this.IMAGES_ALERT[this.alertAnimationFrame]];
                this.alertAnimationFrame++;
            } else {
                this.isPlayingAlert = false;
                this.hasTriggeredAlert = true;
                clearInterval(alertInterval);
            }
        }, 150);
    }
    
    /**
     * Starts the main animation of the end boss (walking, hurt, etc.).
     */
    startAnimation() {
        this.animationInterval = setInterval(() => {
            if (this.endbossEnergy <= 0) {
                if (!this.isDying) {
                    this.playDeathAnimation();
                }
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (!this.isPlayingAlert) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 150);
    }
    
    /**
     * Moves the end boss based on the distance to the character.
     * Also starts the alert animation, when the character approaches.
     */
    moveBasedOnDistance() {
        if (!this.world || !this.world.character) return;
        
        const distance = this.x - this.world.character.x;
        
        if (distance <= 500 && !this.hasTriggeredAlert) {
            this.playAlertAnimation();
            this.endboss_hit.play();
        }
        
        if (distance <= 500) {
            if (this.isMovingForward) {
                if (this.stepsForward < this.maxStepsForward) {
                    this.moveLeft();
                    this.stepsForward++;
                } else {
                    this.isMovingForward = false;
                    this.stepsForward = 0;
                }
            } else {
                if (this.stepsBackward < this.maxStepsBackward) {
                    this.moveRight();
                    this.stepsBackward++;
                } else {
                    this.isMovingForward = true;
                    this.stepsBackward = 0;
                }
            }
        }
    }
    
    /**
     * Initializes the movement interval and calls moveBasedOnDistance regularly.
     */
    initMovement() {
        this.movementInterval = setInterval(() => {
            if (this.endbossEnergy > 0) {
                this.moveBasedOnDistance();
            }
        }, 50);
    }
    
    /**
     * Endboss jumps back when he has hurt the character
     */
    jumpBack() {
        this.x += 250;
        this.isMovingForward = false;
        this.stepsForward = 0;
    }
    
    /**
     * Starts the death animation, stops other intervals and shows death sequence.
     */
    playDeathAnimation() {
        if (!this.isDying) {
            this.isDying = true;
            clearInterval(this.animationInterval);
            clearInterval(this.movementInterval);
            
            this.animationInterval = setInterval(() => {
                this.playAnimation(this.IMAGES_DEATH);
            }, 200);
            
            setTimeout(() => {
                clearInterval(this.animationInterval);
                this.img = this.imageCache[this.IMAGES_DEATH[this.IMAGES_DEATH.length - 1]];
            }, 1000); // Anpassbar je nach gewünschter Animationsdauer
        }
    }
    
    /**
     * Executes a hit on the end boss, reduces energy and plays sound.
     */
    hit() {
        if (!this.isImmune()) {
            this.endbossEnergy -= 20;
            if (this.endbossEnergy < 0) {
                this.endbossEnergy = 0;
            }
            this.lastHit = new Date().getTime();
            this.endboss_hit.play();
        }
    }
    
    /**
     * Checks, if the end boss was hit recently (is hurt).
     * @returns {boolean} Returns true, if last hit was < 1 second ago.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }
    
    /**
     * Moves the end boss to the left.
     */
    moveLeft() {
        this.x -= this.speed;
        this.otherDirection = false;
    }
    
    /**
     * Moves the end boss to the right.
     */
    moveRight() {
        this.x += this.speed;
        this.otherDirection = false;
    }
    
    /**
     * Plays an animation with an array of image paths.
     * @param {string[]} images - Array of the image paths to use.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}
