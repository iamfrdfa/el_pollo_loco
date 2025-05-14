/**
 * Diese Klasse repräsentiert ein bewegliches Objekt im Spiel.
 * Sie enthält Methoden für Bewegung, Kollision, Animation, Gravitation und Zustände wie Leben, Immunität, usw.
 * Erbt von {@link DrawableObject}.
 *
 * @class
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
    /**
     * Horizontale Bewegungs­geschwindigkeit.
     * @type {number}
     */
    speed = 0.15;
    
    /**
     * Gibt an, ob die andere Richtung angenommen wird.
     * @type {boolean}
     */
    otherDirection = false;
    
    /**
     * Vertikale Geschwindigkeit (z.B. fürs Springen).
     * @type {number}
     */
    speedY = 0;
    
    /**
     * Beschleunigung in Y-Richtung (z.B. Schwerkraft).
     * @type {number}
     */
    acceleration = 1;
    
    /**
     * Energie des Objekts (Lebenspunkte).
     * @type {number}
     */
    energy = 100;
    
    /**
     * Zeitpunkt des letzten Treffers (Zeitstempel in ms).
     * @type {number}
     */
    lastHit = 0;
    
    /**
     * Maximale Anzahl an sammelbaren Münzen.
     * @type {number}
     */
    maxCoinAmount = 5;
    
    /**
     * Maximale Anzahl an sammelbaren Flaschen.
     * @type {number}
     */
    maxBottleAmount = 5;
    
    /**
     * Energie des Endbosses (falls zutreffend).
     * @type {number}
     */
    endbossEnergy = 100;
    
    /**
     * Immunitätsdauer nach Treffer in Sekunden.
     * @type {number}
     */
    immunityTime = 1;
    
    /**
     * Wendet Schwerkraft auf das Objekt an und aktualisiert speedY (wird periodisch aufgerufen).
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
     * Überprüft, ob sich das Objekt über dem Boden befindet.
     * Bei ThrowableObject immer true, sonst y < 230.
     *
     * @returns {boolean} true, wenn das Objekt über dem Boden ist
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 230;
        }
    }
    
    /**
     * Prüft, ob dieses Objekt mit einem anderen kollidiert.
     *
     * @param {MovableObject} mo - Das andere Spielobjekt
     * @returns {boolean} true, wenn eine Kollision vorliegt
     */
    isColliding(mo) {
        // Offset ist in drawableObject.js definiert
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom >= mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }
    
    /**
     * Wird aufgerufen, wenn das Objekt (z.B. Character) getroffen wird.
     * Reduziert Energie nur, wenn keine Immunität besteht.
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
            }
        }
    }
    
    /**
     * Prüft, ob das Objekt kürzlich Schaden genommen hat (für Animation).
     * @returns {boolean} true, wenn der letzte Treffer < 0,5 s zurückliegt
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 0.5;
    }
    
    /**
     * Prüft, ob das Objekt aktuell immun gegen Schaden ist.
     * @returns {boolean} true, wenn Immunitätszeit noch nicht abgelaufen
     */
    isImmune() {
        if (this.lastHit === 0) return false;
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < this.immunityTime;
    }
    
    /**
     * Prüft, ob das Objekt (oder Endboss) tot ist.
     * @returns {boolean} true, wenn Energie <= 0
     */
    isDead() {
        if (this instanceof Endboss) {
            return this.endbossEnergy <= 0;
        }
        return this.energy <= 0;
    }
    
    /**
     * Spielt eine Animation mit einem Array von Bildpfaden ab.
     * @param {string[]} images - Bildpfade für die Animation
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
    
    /**
     * Bewegt das Objekt nach rechts.
     */
    moveRight() {
        this.x += this.speed;
    }
    
    /**
     * Bewegt das Objekt nach links.
     */
    moveLeft() {
        this.x -= this.speed;
    }
    
    /**
     * Lässt das Objekt springen, setzt vertikale Geschwindigkeit.
     */
    jump() {
        this.speedY = 30;
    }
}