/**
 * Represents a coin in the game that can be collected.
 * This class extends MovableObject.
 */
class Coins extends MovableObject {
    /**
     * The Y-position of the coin.
     * @type {number}
     */
    y = 550;
    
    /**
     * The height of the coin.
     * @type {number}
     */
    height = 120;
    
    /**
     * The width of the coin.
     * @type {number}
     */
    width = 120;
    
    /**
     * Number of coins.
     * @type {number}
     */
    coinAmount = 0;
    
    /**
     * Offset for collision detection.
     * @type {{top: number, bottom: number, left: number, right: number}}
     */
    offset = {
        top: 42,
        bottom: 42,
        left: 42,
        right: 42,
    }
    
    /**
     * Array of collectible coin image paths.
     * @type {string[]}
     */
    COLLECTIBLE_COINS = [
        'img/8_coin/coin_1.png'
    ];
    
    /**
     * Creates new coin(s) and assigns random positions.
     */
    constructor() {
        super().loadImage('img/8_coin/coin_1.png');
        this.loadImages(this.COLLECTIBLE_COINS);
        
        /**
         * Random X-position within a range.
         * @type {number}
         */
        this.x = 250 + Math.random() * 1500;
        
        let tmp_Y = 320;
        for (let i = 0; i <= this.coinAmount; i++) {
            for (let i = 0; i < tmp_Y; i++) {
                this.y = 100 + Math.random() * 230;
            }
        }
    }
}
