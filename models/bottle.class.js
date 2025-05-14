/**
 * Stellt eine Flasche im Spiel dar, die gesammelt oder geworfen werden kann.
 * Diese Klasse erweitert MovableObject.
 */
class Bottle extends MovableObject {
    /**
     * Die Y-Position der Flasche.
     * @type {number}
     */
    y = 380;
    
    /**
     * Die Höhe der Flasche.
     * @type {number}
     */
    height = 400 / 8;
    
    /**
     * Die Breite der Flasche.
     * @type {number}
     */
    width = 400 / 8;
    
    /**
     * Offset zur Kollisionsabfrage.
     * @type {{top: number, bottom: number, left: number, right: number}}
     */
    offset = {
        top: 10,
        bottom: 5,
        left: 20,
        right: 10,
    }
    
    /**
     * Array mit Bildpfaden für die Flasche auf dem Boden.
     * @type {string[]}
     */
    BOTTLE_ON_GROUND = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    ];
    
    /**
     * Erstellt eine neue Flasche.
     */
    constructor() {
        super().loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.loadImages(this.BOTTLE_ON_GROUND);
        /**
         * Die X-Position wird zufällig innerhalb des Bereichs gesetzt.
         * @type {number}
         */
        this.x = 100 + Math.random() * 2000;
    }
}