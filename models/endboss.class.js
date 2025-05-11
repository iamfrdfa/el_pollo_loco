class Endboss extends MovableObject {
    /**
     * Grundlegende Eigenschaften des Endbosses
     */
    height = 400;
    width = 300;
    y = 55;
    offset = {
        top: 70,
        bottom: 10,
        right: 10,
        left: 35
    }
    
    /**
     * Arrays für die verschiedenen Animations-Bilder
     */
    IMAGES_WALKING = [
        'img/4_enemy_boss_chicken/1_walk/G1.png',
        'img/4_enemy_boss_chicken/1_walk/G2.png',
        'img/4_enemy_boss_chicken/1_walk/G3.png',
        'img/4_enemy_boss_chicken/1_walk/G4.png'
    ];
    
    IMAGES_HURT = [
        'img/4_enemy_boss_chicken/4_hurt/G21.png',
        'img/4_enemy_boss_chicken/4_hurt/G22.png',
        'img/4_enemy_boss_chicken/4_hurt/G23.png'
    ];
    
    IMAGES_DEATH = [
        'img/4_enemy_boss_chicken/5_dead/G24.png',
        'img/4_enemy_boss_chicken/5_dead/G25.png',
        'img/4_enemy_boss_chicken/5_dead/G26.png'
    ];
    
    /**
     * Eigenschaften für Animation und Bewegung
     */
    world;
    currentImage = 0;
    animationInterval;
    movementInterval;
    isHurtAnimation = false;
    isDying = false;
    isMovingForward = true;
    stepsForward = 0;
    stepsBackward = 0;
    maxStepsForward = 5;
    maxStepsBackward = 3;
    speed = 5;
    
    /**
     * Initialisiert den Endboss mit Bildern und startet die Animationen
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEATH);
        this.x = 2200;
        this.startAnimation();
        this.initMovement();
    }
    
    /**
     * Startet die Animations-Logik des Endbosses
     * Wechselt zwischen verschiedenen Animationen basierend auf dem Zustand
     */
    startAnimation() {
        this.animationInterval = setInterval(() => {
            if (this.endbossEnergy <= 0) {
                if (!this.isDying) {
                    this.playDeathAnimation();
                }
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 150);
    }
    
    /**
     * Initialisiert die Bewegungslogik des Endbosses
     * Überprüft regelmäßig die Distanz zum Character und bewegt sich entsprechend
     */
    initMovement() {
        this.movementInterval = setInterval(() => {
            if (this.endbossEnergy > 0) {
                this.moveBasedOnDistance();
            }
        }, 50);
    }
    
    /**
     * Berechnet die Distanz zum Character und steuert die Bewegung
     * Bewegt sich 5 Schritte vorwärts und 3 Schritte rückwärts wenn der Character in Reichweite ist
     */
    moveBasedOnDistance() {
        if (!this.world || !this.world.character) return;
        
        const distance = this.x - this.world.character.x;
        
        if (distance <= 300) {
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
     * Spielt die Todesanimation einmalig ab
     * Stoppt alle anderen Animationen und zeigt die Todessequenz
     */
    playDeathAnimation() {
        this.isDying = true;
        clearInterval(this.animationInterval);
        clearInterval(this.movementInterval);
        
        let deathImage = 0;
        const deathInterval = setInterval(() => {
            if (deathImage < this.IMAGES_DEATH.length) {
                this.img = this.imageCache[this.IMAGES_DEATH[deathImage]];
                deathImage++;
            } else {
                clearInterval(deathInterval);
                this.img = this.imageCache[this.IMAGES_DEATH[this.IMAGES_DEATH.length - 1]];
            }
        }, 200);
    }
    
    /**
     * Wird aufgerufen wenn der Endboss getroffen wird
     * Reduziert die Energie und setzt den Zeitpunkt des letzten Treffers
     */
    hit() {
        this.endbossEnergy -= 20;
        if (this.endbossEnergy < 0) {
            this.endbossEnergy = 0;
        }
        this.lastHit = new Date().getTime();
    }
    
    /**
     * Prüft ob der Endboss verletzt ist
     * @returns {boolean} true wenn der letzte Treffer weniger als 1 Sekunde her ist
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }
    
    /**
     * Bewegt den Endboss nach links
     * Überschreibt die moveLeft Methode von MovableObject
     */
    moveLeft() {
        this.x -= this.speed;
        this.otherDirection = false;
    }
    
    /**
     * Bewegt den Endboss nach rechts
     * Überschreibt die moveRight Methode von MovableObject
     */
    moveRight() {
        this.x += this.speed;
        this.otherDirection = false;
    }
    
    /**
     * Spielt eine Animation basierend auf einem Bilder-Array ab
     * @param {Array} images - Array mit Bildpfaden für die Animation
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}