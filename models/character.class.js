/**
 * Die Character-Klasse beschreibt den spielbaren Charakter inklusive Steuerung, Animationen
 * und Sounds. Sie erbt von MovableObject.
 *
 * @class
 * @extends MovableObject
 */
class Character extends MovableObject {
    /**
     * Die Höhe des Charakters in Pixel.
     * @type {number}
     */
    height = 200;
    /**
     * Die Y-Position des Charakters im Canvas.
     * @type {number}
     */
    y = 130;
    /**
     * Die maximale Geschwindigkeit des Charakters.
     * @type {number}
     */
    speed = 20;
    /**
     * Referenz auf die Weltinstanz.
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
     * Kollisions-Offsets für genauere Collision-Checks.
     * @type {{top: number, bottom: number, left: number, right: number}}
     */
    offset = {
        top: 80,
        bottom: 10,
        left: 25,
        right: 25
    }
    
    /**
     * Anzahl der eingesammelten Münzen.
     * @type {number}
     */
    coinAmount = 0;
    
    /**
     * Anzahl der eingesammelten Flaschen.
     * @type {number}
     */
    bottleAmount = 0;
    
    /**
     * Bildpfade für bestehende Lauf-Animationen.
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
     * Bildpfade für Sprung-Animationen.
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
     * Bildpfade für Hurt-Animationen.
     * @type {string[]}
     */
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];
    
    /**
     * Bildpfade für Death-Animationen.
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
     * Bildpfade für Idle-/Schlafanimationen.
     * @type {string[]}
     */
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
    ];
    
    /**
     * Letzter Zeitstempel der Aktivität.
     * @type {number}
     */
    lastActivity = new Date().getTime();
    
    /**
     * Gibt an, ob der Charakter aktuell schläft (Inaktiv-Animation).
     * @type {boolean}
     */
    isSleeping = false;
    
    /**
     * Index des aktuell angezeigten Animationsbilds.
     * @type {number}
     */
    currentImage = 0;
    
    /**
     * ID des Intervals für die Animation.
     * @type {number|undefined}
     */
    animationInterval;
    
    /**
     * ID des Intervals für Bewegung.
     * @type {number|undefined}
     */
    movementInterval;
    
    /**
     * Initialisiert den Character, lädt Animationen, wendet Schwerkraft an und startet die Animation.
     * @constructor
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
     * Steuert fortlaufend Bewegung und Animation des Charakters.
     */
    animate() {
        // Bewegungssteuerung (z.B. durch Tasteneingaben)
        this.movementInterval = setInterval(() => {
            this.handleMovement();
        }, 1000 / 30);
        
        // Bildwechsel der Animation basierend auf Status
        this.animationInterval = setInterval(() => {
            this.updateAnimation();
        }, 100);
    }
    
    /**
     * Verarbeitet Eingaben und steuert Position sowie Sound des Charakters.
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
     * Aktualisiert Animation und Sounds anhand des Charakterszustands (tot, verletzt, hüpfend, idle, laufend).
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
            this.snoring_sound.play();
        }
        else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }
    
    /**
     * Prüft, ob der Charakter länger als 7 Sekunden inaktiv war.
     * @returns {boolean} true, wenn der Charakter "idle" ist.
     */
    isIdle() {
        let currentTime = new Date().getTime();
        let timePassed = (currentTime - this.lastActivity) / 1000;
        return timePassed > 7;
    }
    
    /**
     * Setzt den Inaktivitäts-Timer zurück und beendet Schlafgeräusch.
     */
    resetIdleTimer() {
        this.lastActivity = new Date().getTime();
        this.isSleeping = false;
        this.snoring_sound.pause();
    }
    
    /**
     * Heilt den Charakter um 20 Punkte, falls mindestens 5 Münzen gesammelt wurden und die Energie unter 100 liegt.
     * Verringert die Münzanzahl um 5 und aktualisiert die Statusleisten.
     *
     * @returns {boolean} true, wenn Heilung durchgeführt wurde, sonst false.
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
     * Lässt den Charakter springen, indem die Y-Geschwindigkeit gesetzt wird.
     */
    jump() {
        this.speedY = 20;
    }
}