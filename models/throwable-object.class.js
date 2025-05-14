/**
 * Klasse für Objekte, die geworfen werden können (z. B. Flaschen).
 * Dieses Objekt besitzt Animationen für den Flug und für das Zerspringen,
 * sowie eine eigene Kollisions- und Bewegungslogik.
 * Erbt von {@link MovableObject}.
 *
 * @class
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
    /**
     * Bildpfade für die Rotationsanimation der Flasche im Wurf.
     * @type {string[]}
     */
    BOTTLE_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ];
    
    /**
     * Bildpfade für die Splash-/Zerbrechanimation.
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
     * Flag, ob das Objekt (z. B. Flasche) bereits ein Hindernis getroffen hat.
     * @type {boolean}
     */
    hasHitObstacle = false;
    
    /**
     * Flag, ob sich das Objekt aktuell in der Splash-/Zerbrechanimation befindet.
     * @type {boolean}
     */
    isSplashing = false;
    
    /**
     * Enthält das Intervall-Handle der Splash-Animation.
     * @type {number|undefined}
     */
    splashAnimation;
    
    /**
     * Offset-Werte zur Kollisionsprüfung.
     * @type {{top: number, bottom: number, left: number, right: number}}
     */
    offset = {
        top: 10,
        bottom: 10,
        left: 20,
        right: 20
    };
    
    /**
     * Abspielbares Audioelement für den Splash-Sound.
     * @type {HTMLAudioElement}
     */
    splashing_bottle = new Audio('audio/breaking-bottle.mp3');
    
    /**
     * Erzeugt ein neues {@link ThrowableObject}-Objekt an gegebener Position mit Wurfrichtung.
     * @param {number} x - Startposition X
     * @param {number} y - Startposition Y
     * @param {boolean} direction - Richtung (true/false)
     * @param {boolean} otherDirection - Richtung entsprechend Character-Ausrichtung
     */
    constructor(x, y, direction, otherDirection) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        super.loadImages(this.BOTTLE_ROTATION);
        super.loadImages(this.BOTTLE_SPLASH);
        
        /**
         * X-Koordinate des Objekts.
         * @type {number}
         */
        this.x = x;
        /**
         * Y-Koordinate des Objekts.
         * @type {number}
         */
        this.y = y;
        /**
         * Höhe des Objekts.
         * @type {number}
         */
        this.height = 60;
        /**
         * Breite des Objekts.
         * @type {number}
         */
        this.width = 50;
        
        /**
         * Bestimmt die Bewegungsrichtung des Objekts.
         * @type {boolean}
         */
        this.otherDirection = otherDirection; // Die Richtung vom Character übernehmen
        
        this.animate();
        this.throw();
    }
    
    /**
     * Startet den Wurf des Objekts, sorgt für Bewegung und Splash, wenn der Boden erreicht wird.
     */
    throw() {
        this.speedY = 10; // Erhöhen für höheren Wurf
        this.applyGravity();
        
        setInterval(() => {
            if (!this.isSplashing) {
                if (this.otherDirection) {
                    this.x -= 15;
                } else {
                    this.x += 15;
                }
                
                // Prüfen, ob die Flasche den Boden berührt (y + height = Unterkante)
                if (this.y + this.height > 430 && !this.hasHitObstacle) {
                    this.playSplashAnimation();
                    this.hasHitObstacle = true;
                }
            }
        }, 50);
    }
    
    /**
     * Prüft, ob sich das Objekt noch oberhalb des Bodens befindet.
     * @returns {boolean} true, solange das Objekt noch nicht den Boden berührt hat
     */
    isAboveGround() {
        // Diese Methode lässt die Flasche immer fallen, bis sie den Boden berührt
        return this.y + this.height < 430;
    }
    
    /**
     * Startet die Animationsschleife für die Flug-Rotation, solange das Objekt nicht splasht.
     */
    animate() {
        setInterval(() => {
            if (!this.isSplashing) {
                this.playAnimation(this.BOTTLE_ROTATION);
            }
        }, 100);
    }
    
    /**
     * Spielt die Splash-Animation ab, wenn das Objekt zerbricht.
     * Spielt dabei einen Sound ab und blendet schließlich das Objekt aus.
     */
    playSplashAnimation() {
        this.isSplashing = true;
        let splashIndex = 0;
        
        // Sound beim Start der Splash-Animation abspielen
        this.splashing_bottle.play();
        
        this.splashAnimation = setInterval(() => {
            if (splashIndex < this.BOTTLE_SPLASH.length) {
                this.img = this.imageCache[this.BOTTLE_SPLASH[splashIndex]];
                splashIndex++;
            } else {
                clearInterval(this.splashAnimation);
                // Flasche aus dem Array entfernen
                this.width = 0;
                this.height = 0;
            }
        }, 100);
    }
    
}