class Character extends MovableObject {
    height = 200;
    y =  130;
    speed = 20;
    world;
    walking_sound = new Audio('audio/walking.mp3');
    hurt_sound = new Audio('audio/hurt_sound.mp3');
    game_over = new Audio('audio/game_over.mp3');
    coin_sound = new Audio('audio/coin_collect.mp3');
    bottle_sound = new Audio('audio/glass-bottles.mp3');
    throwBottle_sound = new Audio('audio/throw_sound.mp3');
    chickenDeath_sound = new Audio('audio/chicken_death.mp3');
    weaponFail_sound = new Audio('audio/fail.mp3');
    offset = {
        top: 80,
        bottom: 10,
        left: 25,
        right: 25
    }
    coinAmount = 0;
    bottleAmount = 0;
    
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];
    
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
    
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];
    
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];
    
    IMAGES_SLEEPING = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
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
    ]
    
    lastActivity = new Date().getTime();
    isSleeping = false;
    currentImage = 0;
    animationInterval;
    movementInterval;
    
    /**
     * Initialisiert den Character mit Bildern und startet die Animationen
     */
    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        super.loadImages(this.IMAGES_WALKING);
        super.loadImages(this.IMAGES_JUMPING);
        super.loadImages(this.IMAGES_HURT);
        super.loadImages(this.IMAGES_DEAD);
        super.loadImages(this.IMAGES_SLEEPING);
        this.applyGravity();
        this.animate();
    }
    
    /**
     * Steuert die Bewegungen und Animationen des Characters
     */
    animate() {
        // Bewegungs-Interval
        this.movementInterval = setInterval(() => {
            this.handleMovement();
        }, 1000 / 30);
        
        // Animations-Interval
        this.animationInterval = setInterval(() => {
            this.updateAnimation();
        }, 100);
    }
    
    /**
     * Verarbeitet die Bewegungseingaben und aktualisiert die Position
     */
    handleMovement() {
        this.walking_sound.pause();
        
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.walking_sound.play();
            this.otherDirection = false;
            this.resetIdleTimer();
        }
        
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.walking_sound.play();
            this.otherDirection = true;
            this.resetIdleTimer();
        }
        
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
            this.resetIdleTimer();
        }
        
        this.world.camera_x = -this.x + 100;
    }
    
    /**
     * Aktualisiert die aktuelle Animation basierend auf dem Charakterzustand
     */
    updateAnimation() {
        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
            this.game_over.play();
            clearInterval(this.movementInterval);
            clearInterval(this.animationInterval);
        }
        else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
            this.hurt_sound.play();
            this.resetIdleTimer();
        }
        else if (this.isAboveGround()) {
            this.playAnimation(this.IMAGES_JUMPING);
            this.resetIdleTimer();
        }
        else if (this.isIdle()) {
            this.playAnimation(this.IMAGES_SLEEPING);
            this.isSleeping = true;
        }
        else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }
    
    /**
     * Prüft, ob der Character länger als 5 Sekunden inaktiv war
     * @returns {boolean} - true wenn inaktiv, sonst false
     */
    isIdle() {
        let currentTime = new Date().getTime();
        let timePassed = (currentTime - this.lastActivity) / 1000;
        return timePassed > 7;
    }
    
    /**
     * Setzt den Inaktivitäts-Timer zurück
     */
    resetIdleTimer() {
        this.lastActivity = new Date().getTime();
        this.isSleeping = false;
    }
    
    /**
     * Heilt den Character wenn 5 Münzen gesammelt wurden
     * @returns {boolean} true wenn Heilung erfolgt ist
     */
    healWithCoins() {
        if (this.coinAmount >= 5 && this.energy < 100) {
            this.coinAmount -= 5; // 5 Münzen abziehen
            this.energy = Math.min(this.energy + 20, 100); // Energie um 20 erhöhen, maximal 100
            this.world.statusBar.setPercentage(this.energy); // Statusbar aktualisieren
            this.world.statusBarCoin.setPercentageCoin(this.coinAmount); // Münzen-Statusbar aktualisieren
            return true;
        }
        return false;
    }
    
    
    /**
     * Lässt den Character springen
     */
    jump() {
        this.speedY = 20;
    }
}
