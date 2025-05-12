class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 1;
    energy = 100;
    lastHit = 0;
    maxCoinAmount = 5;
    maxBottleAmount = 5;
    endbossEnergy = 100;
    immunityTime = 1; // Variable für die Immunitätsdauer in Sekunden
    
    
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }
    
    isAboveGround(){
        if (this instanceof ThrowableObject) { //ThrowableObject should always fall
            return true;
        } else {
            return this.y < 230;
        }
    }
    
    isColliding(mo) {
        //Offset is defined in drawableObject.js
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom >= mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }
    
    /**
     * Wird aufgerufen, wenn der Character getroffen wird
     * Reduziert die Energie nur wenn keine Immunität aktiv ist
     */
    hit() {
        if (!this.isImmune()) { // Prüft, ob der Character gerade immun ist
            this.energy -= 20;   // Reduziert die Energie um 20 für bessere Übereinstimmung mit der Statusbar
            if (this.energy < 0) {
                this.energy = 0; // Verhindert negative Energie
            }
            this.lastHit = new Date().getTime(); // Speichert den Zeitpunkt des Treffers
            if (this instanceof Character) {
                this.world.statusBar.setPercentage(this.energy);
            }
        }
    }
    
    /**
     * Prüft ob der Character gerade verletzt ist (für Animation)
     * @returns {boolean} true wenn der letzte Treffer weniger als 0.5 Sekunden her ist
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; // Berechnet die Zeit seit dem letzten Treffer in ms
        timepassed = timepassed / 1000; // Differenz in Sekunden
        return timepassed < 0.5; // Gibt true zurück wenn weniger als 0.5 Sekunden vergangen sind
    }
    
    /**
     * Prüft ob der Character aktuell immun gegen Schaden ist
     * @returns {boolean} true wenn der Character immun ist
     */
    isImmune() {
        if (this.lastHit === 0) return false; // Character wurde noch nie getroffen
        
        let timepassed = new Date().getTime() - this.lastHit; // Berechnet die Zeit seit dem letzten Treffer in ms
        timepassed = timepassed / 1000; // Konvertiert zu Sekunden
        return timepassed < this.immunityTime; // Gibt true zurück wenn die Immunitätszeit noch nicht abgelaufen ist
    }
    
    isDead() {
        if (this instanceof Endboss) {
            return this.endbossEnergy <= 0;
        }
        return this.energy <= 0;
    }
    
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
    
    moveRight() {
        this.x += this.speed;
    }
    
    moveLeft() {
        this.x -= this.speed;
    }
    
    jump() {
        this.speedY = 30;
    }
}