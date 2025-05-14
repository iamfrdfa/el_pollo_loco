/**
 * Repräsentiert den Endboss im Spiel.
 * Enthält Animationen, Bewegung, Kollisionslogik und Status-Flags.
 * Erbt von MovableObject.
 *
 * @class
 * @extends MovableObject
 */
class Endboss extends MovableObject {
    /**
     * Höhe des Endbosses in Pixeln.
     * @type {number}
     */
    height = 400;
    
    /**
     * Breite des Endbosses in Pixeln.
     * @type {number}
     */
    width = 300;
    
    /**
     * Y-Position des Endbosses auf dem Spielfeld.
     * @type {number}
     */
    y = 55;
    
    /**
     * Offset für die Kollisionslogik.
     * @type {{top: number, bottom: number, right: number, left: number}}
     */
    offset = {
        top: 70,
        bottom: 10,
        right: 10,
        left: 35
    }
    
    /**
     * Enthält Bildpfade für die Laufanimation.
     * @type {string[]}
     */
    IMAGES_WALKING = [
        'img/4_enemy_boss_chicken/1_walk/G1.png',
        'img/4_enemy_boss_chicken/1_walk/G2.png',
        'img/4_enemy_boss_chicken/1_walk/G3.png',
        'img/4_enemy_boss_chicken/1_walk/G4.png'
    ];
    
    /**
     * Enthält Bildpfade für die "Hurt"-Animation.
     * @type {string[]}
     */
    IMAGES_HURT = [
        'img/4_enemy_boss_chicken/4_hurt/G21.png',
        'img/4_enemy_boss_chicken/4_hurt/G22.png',
        'img/4_enemy_boss_chicken/4_hurt/G23.png'
    ];
    
    /**
     * Enthält Bildpfade für die "Alert"-Warnanimation.
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
     * Enthält Bildpfade für die Todesanimation.
     * @type {string[]}
     */
    IMAGES_DEATH = [
        'img/4_enemy_boss_chicken/5_dead/G24.png',
        'img/4_enemy_boss_chicken/5_dead/G25.png',
        'img/4_enemy_boss_chicken/5_dead/G26.png'
    ];
    
    /**
     * Referenz auf die Welt-Instanz.
     * @type {Object}
     */
    world;
    
    /**
     * Bildindex der aktuellen Animation.
     * @type {number}
     */
    currentImage = 0;
    
    /**
     * ID des Intervalls für Animationen.
     * @type {number}
     */
    animationInterval;
    
    /**
     * ID des Intervalls für die Bewegungslogik.
     * @type {number}
     */
    movementInterval;
    
    /**
     * Zeigt, ob momentan die Hurt-Animation läuft.
     * @type {boolean}
     */
    isHurtAnimation = false;
    
    /**
     * Zeigt, ob der Endboss stirbt.
     * @type {boolean}
     */
    isDying = false;
    
    /**
     * Bewegungsrichtung: true = vorwärts, false = rückwärts.
     * @type {boolean}
     */
    isMovingForward = true;
    
    /**
     * Anzahl der Schritte nach vorne.
     * @type {number}
     */
    stepsForward = 0;
    
    /**
     * Anzahl der Schritte nach hinten.
     * @type {number}
     */
    stepsBackward = 0;
    
    /**
     * Maximale Schritte vorwärts.
     * @type {number}
     */
    maxStepsForward = 5;
    
    /**
     * Maximale Schritte rückwärts.
     * @type {number}
     */
    maxStepsBackward = 3;
    
    /**
     * Bewegungsgeschwindigkeit.
     * @type {number}
     */
    speed = 5;
    
    /**
     * Audiospur für Treffer-Feedback.
     * @type {HTMLAudioElement}
     */
    endboss_hit = new Audio('audio/endboss-sound-intro.mp3');
    
    /**
     * Flag, ob die Alert-Animation einmalig ausgelöst wurde.
     * @type {boolean}
     */
    hasTriggeredAlert = false;
    
    /**
     * Flag, ob die Alert-Animation aktuell läuft.
     * @type {boolean}
     */
    isPlayingAlert = false;
    
    /**
     * Zähler für aktuelle Alert-Frame.
     * @type {number}
     */
    alertAnimationFrame = 0;
    
    /**
     * Initialisiert den Endboss mit allen Animationen, Bildern und startet Animation und Bewegung.
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
    }
    
    /**
     * Startet die Alert-Animation, wenn der Character in der Nähe ist – nur einmalig.
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
     * Startet die Hauptanimation des Endbosses (laufen, verletzt, etc.).
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
     * Bewegt den Endboss basierend auf der Distanz zum Character.
     * Startet auch die Alert-Animation, wenn der Character nahekommt.
     */
    moveBasedOnDistance() {
        if (!this.world || !this.world.character) return;
        
        const distance = this.x - this.world.character.x;
        
        // Alert wenn nah genug
        if (distance <= 400 && !this.hasTriggeredAlert) {
            this.playAlertAnimation();
        }
        
        // Bewegungslogik vor/zurück
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
     * Initialisiert das Bewegungsintervall und ruft regelmäßig moveBasedOnDistance auf.
     */
    initMovement() {
        this.movementInterval = setInterval(() => {
            if (this.endbossEnergy > 0) {
                this.moveBasedOnDistance();
            }
        }, 50);
    }
    
    /**
     * Startet die Todesanimation, stoppt andere Intervalle und zeigt Sterbesequenz.
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
     * Führt einen Treffer auf den Endboss aus, setzt Energie herab und spielt Sound.
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
     * Prüft, ob der Endboss in letzter Zeit getroffen wurde (verletzt ist).
     * @returns {boolean} Gibt true zurück, wenn letzter Treffer < 1 Sekunde her ist.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }
    
    /**
     * Bewegt den Endboss nach links.
     */
    moveLeft() {
        this.x -= this.speed;
        this.otherDirection = false;
    }
    
    /**
     * Bewegt den Endboss nach rechts.
     */
    moveRight() {
        this.x += this.speed;
        this.otherDirection = false;
    }
    
    /**
     * Spielt eine Animation mit einem Array von Bildpfaden ab.
     * @param {string[]} images - Array der zu verwendenden Bildpfade.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}