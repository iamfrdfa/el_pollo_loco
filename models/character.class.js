/**
 * The Character class defines the playable character, including controls, animations,
 * and sounds. Inherits from MovableObject.
 * @class
 * @extends MovableObject
 */
class Character extends MovableObject {
    /**
     * Height of the character in pixels.
     * @type {number}
     */
    height = 200;
    
    /**
     * Y-position of the character on the canvas.
     * @type {number}
     */
    y = 130;
    
    /**
     * Maximum speed of the character.
     * @type {number}
     */
    speed = 20;
    
    /**
     * Reference to the world instance.
     * @type {?World}
     */
    world;
    
    /** @type {HTMLAudioElement} */
    walking_sound = new Audio('audio/walking.mp3');
    /** @type {HTMLAudioElement} */
    hurt_sound = new Audio('audio/hurt_sound.mp3');
    /** @type {HTMLAudioElement} */
    game_over = new Audio('audio/game_over.mp3');
    /** @type {HTMLAudioElement} */
    coin_sound = new Audio('audio/coin_collect.mp3');
    /** @type {HTMLAudioElement} */
    bottle_sound = new Audio('audio/glass-bottles.mp3');
    /** @type {HTMLAudioElement} */
    throwBottle_sound = new Audio('audio/throw_sound.mp3');
    /** @type {HTMLAudioElement} */
    chickenDeath_sound = new Audio('audio/chicken_death.mp3');
    /** @type {HTMLAudioElement} */
    weaponFail_sound = new Audio('audio/fail.mp3');
    /** @type {HTMLAudioElement} */
    snoring_sound = new Audio('audio/snoring.mp3');
    
    /**
     * Collision offset values for accurate hit detection.
     * @type {{top: number, bottom: number, left: number, right: number}}
     */
    offset = {
        top: 80,
        bottom: 10,
        left: 25,
        right: 25
    }
    
    /**
     * Number of collected coins.
     * @type {number}
     */
    coinAmount = 0;
    
    /**
     * Number of collected bottles.
     * @type {number}
     */
    bottleAmount = 0;
    
    /**
     * Image paths for Idle animation.
     * @type {string[]}
     */
    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png'
    ];
    
    /**
     * Image paths for walking animation.
     * @type {string[]}
     */
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];
    
    /**
     * Image paths for jumping animation.
     * @type {string[]}
     */
    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];
    
    /**
     * Image paths for hurt animation.
     * @type {string[]}
     */
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];
    
    /**
     * Image paths for death animation.
     * @type {string[]}
     */
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];
    
    /**
     * Image paths for idle/sleeping animation.
     * @type {string[]}
     */
    IMAGES_SLEEPING = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png',
    ];
    
    /**
     * Timestamp of the last activity.
     * @type {number}
     */
    lastActivity = new Date().getTime();
    
    /**
     * Indicates whether the character is currently sleeping (idle animation).
     * @type {boolean}
     */
    isSleeping = false;
    
    /**
     * Index of the currently displayed animation image.
     * @type {number}
     */
    currentImage = 0;
    
    /**
     * Interval ID for animation.
     * @type {number|undefined}
     */
    animationInterval;
    
    /**
     * Interval ID for movement.
     * @type {number|undefined}
     */
    movementInterval;
    
    /**
     * Initializes the character, loads animations, applies gravity, and starts animation.
     * @constructor
     */
    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        super.loadImages(this.IMAGES_IDLE);
        super.loadImages(this.IMAGES_WALKING);
        super.loadImages(this.IMAGES_JUMPING);
        super.loadImages(this.IMAGES_HURT);
        super.loadImages(this.IMAGES_DEAD);
        super.loadImages(this.IMAGES_SLEEPING);
        this.chickenDeath_sound.volume = 0.1;
        this.applyGravity();
        this.animate();
    }
    
    /**
     * Continuously handles movement and animation of the character.
     */
    animate() {
        this.movementInterval = setInterval(() => {
            this.handleMovement();
        }, 1000 / 30);
        
        this.animationInterval = setInterval(() => {
            this.updateAnimation();
        }, 100);
    }
    
    /**
     * Handles user input to control movement and sound effects.
     */
    handleMovement() {
        this.walking_sound.pause();
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight(); this.walking_sound.play();
            this.otherDirection = false;
            this.resetIdleTimer();
        }
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft(); this.walking_sound.play();
            this.otherDirection = true;
            this.resetIdleTimer();
        }
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump(); this.resetIdleTimer();
        }
        this.world.camera_x = -this.x + 100;
    }
    
    /**
     * Updates the animation and plays sounds based on character state.
     */
    updateAnimation() {
        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
            clearInterval(this.movementInterval);
            clearInterval(this.animationInterval);
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
            this.hurt_sound.play();
            this.resetIdleTimer();
        } else if (this.isAboveGround()) {
            this.playAnimation(this.IMAGES_JUMPING);
            this.resetIdleTimer();
        } else if (this.isIdle()) {
            this.playAnimation(this.IMAGES_SLEEPING);
            this.isSleeping = true;
            this.snoring_sound.play();
        } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING);
        } else if (!this.isAboveGround()) {
            this.playAnimation(this.IMAGES_IDLE);
        }
    }
    
    /**
     * Checks whether the character has been idle for more than 7 seconds.
     * @returns {boolean} true if character is idle.
     */
    isIdle() {
        let currentTime = new Date().getTime();
        let timePassed = (currentTime - this.lastActivity) / 1000;
        return timePassed > 7;
    }
    
    /**
     * Resets idle timer and stops snoring sound.
     */
    resetIdleTimer() {
        this.lastActivity = new Date().getTime();
        this.isSleeping = false;
        this.snoring_sound.pause();
    }
    
    /**
     * Heals the character by 20 points if at least 5 coins are collected and energy is below 100.
     * Reduces coin count by 5 and updates status bars.
     * @returns {boolean} true if healing was performed, otherwise false.
     */
    healWithCoins() {
        if (this.coinAmount >= 5 && this.energy < 100) {
            this.coinAmount -= 5;
            this.energy = Math.min(this.energy + 20, 100);
            this.world.statusBar.setPercentage(this.energy);
            this.world.statusBarCoin.setPercentageCoin(this.coinAmount);
            return true;
        }
        return false;
    }
    
    /**
     * Makes the character jump by setting the vertical speed.
     */
    jump() {
        this.speedY = 20;
    }
}
