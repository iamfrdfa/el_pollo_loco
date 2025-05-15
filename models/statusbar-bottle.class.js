/**
 * Status bar for bottles.
 * This class displays the current level of collected bottles and
 * updates the display graphically according to the percentage value.
 * Inherits from {@link DrawableObject}.
 *
 * @class
 * @extends DrawableObject
 */
class statusBarBottle extends DrawableObject {
    /**
     * Array with the image paths for the different status displays of the bottles.
     * @type {string[]}
     */
    BOTTLE_STATUSBAR = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
    ];
    
    /**
     * Percentage value of the collected bottles.
     * @type {number}
     */
    percentage = 0;
    
    /**
     * Creates a new instance of the bottle status bar and initializes the image, position, and size.
     */
    constructor() {
        super();
        // Load default image initially
        this.loadImage(this.BOTTLE_STATUSBAR[0]);
        // Load all images for the different status levels
        this.loadImages(this.BOTTLE_STATUSBAR);
        /**
         * X-position in the canvas.
         * @type {number}
         */
        this.x = 20;
        /**
         * Y-position in the canvas.
         * @type {number}
         */
        this.y = 45;
        /**
         * Width of the status bar.
         * @type {number}
         */
        this.width = 200;
        /**
         * Height of the status bar.
         * @type {number}
         */
        this.height = 40;
        this.setPercentageBottle(0);
    }
    
    /**
     * Sets the percentage value of the status bar and updates the current image.
     * @param {number} percentage - The new percentage value (0-100)
     */
    setPercentageBottle(percentage) {
        this.percentage = percentage;
        let path = this.BOTTLE_STATUSBAR[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }
    
    /**
     * Calculates the image index for the status bar based on the percentage value.
     * @returns {number} Index in the BOTTLE_STATUSBAR array for the image to be displayed
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
