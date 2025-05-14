/**
 * Stellt eine Münze im Spiel dar, die gesammelt werden kann.
 * Diese Klasse erweitert MovableObject.
 */
class Coins extends MovableObject {
    /**
     * Die Y-Position der Münze.
     * @type {number}
     */
    y = 550;
    
    /**
     * Die Höhe der Münze.
     * @type {number}
     */
    height = 120;
    
    /**
     * Die Breite der Münze.
     * @type {number}
     */
    width = 120;
    
    /**
     * Anzahl der Münzen.
     * @type {number}
     */
    coinAmount = 0;
    
    /**
     * Offset für Kollisionsabfragen.
     * @type {{top: number, bottom: number, left: number, right: number}}
     */
    offset = {
        top: 42,
        bottom: 42,
        left: 42,
        right: 42,
    }
    
    /**
     * Array der sammelbaren Münzen-Bildpfade.
     * @type {string[]}
     */
    COLLECTIBLE_COINS = [
        'img/8_coin/coin_1.png'
    ];
    
    /**
     * Erstellt eine neue Münze(n) und bestimmt zufällige Positionen.
     */
    constructor() {
        super().loadImage('img/8_coin/coin_1.png');
        this.loadImages(this.COLLECTIBLE_COINS);
        
        /**
         * Zufällige X-Position innerhalb eines Bereichs.
         * @type {number}
         */
        this.x = 250 + Math.random() * 1500;
        
        // Interne Y-Position innerhalb eines Bereichs für alle Münzen
        let tmp_Y = 320
        for (let i = 0; i <= this.coinAmount; i++) {
            for (let i = 0; i < tmp_Y; i++) {
                this.y = 100 + Math.random() * 230;
            }
        }
    }
}