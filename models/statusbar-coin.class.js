/**
 * Status bar for coins.
 * This class displays how many coins have been collected and
 * updates the status image according to the percentage value.
 * Inherits from {@link DrawableObject}.
 *
 * @class
 * @extends DrawableObject
 */
class statusBarCoin extends DrawableObject {
    /**
     * Array with image paths for the different states of the coin status bar.
     * @type {string[]}
     */
    COIN_STATUSBAR = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
    ];
    
    /**
     * Percentage value of the collected coins (0–100).
     * @type {number}
     */
    percentage = 0;
    
    /**
     * Creates a new instance of the coin status bar.
     * Initializes display, position, and loads all status images.
     */
    constructor() {
        super();
        this.loadImages(this.COIN_STATUSBAR);
        /** @type {number} X-position in the canvas */
        this.x = 20;
        /** @type {number} Y-position in the canvas */
        this.y = 85;
        /** @type {number} Width of the status bar */
        this.width = 200;
        /** @type {number} Height of the status bar */
        this.height = 40;
        this.setPercentageCoin(0);
    }
    
    /**
     * Sets the percentage value and updates the displayed status image.
     * @param {number} percentage - New value in the range 0–100
     */
    setPercentageCoin(percentage) {
        this.percentage = percentage;
        let path = this.COIN_STATUSBAR[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }
    
    /**
     * Returns the index of the status image for the current percentage value.
     * @returns {number} Index in the COIN_STATUSBAR array
     */
    resolveImageIndex() {
        if (this.percentage >= 100) {
            return 5;
        } else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 40) {
            return 2;
        } else if (this.percentage >= 20) {
            return 1;
        } else {
            return 0;
        }
    }
}