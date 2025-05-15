/**
 * Status bar for the end boss.
 * This class displays how much energy the end boss currently has
 * and updates the status display based on the current percentage.
 * Inherits from {@link DrawableObject}.
 *
 * @class
 * @extends DrawableObject
 */
class statusBarEndboss extends DrawableObject {
    /**
     * Array with image paths for the different states of the end boss status bar.
     * @type {string[]}
     */
    ENDBOSS_STATUSBAR = [
        'img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue100.png'
    ];
    
    /**
     * Percentage value of the end boss's health (0–100).
     * @type {number}
     */
    percentage = 0;
    
    /**
     * Creates a new instance of the end boss status bar.
     * Sets position, size, and initial image, and loads all status images.
     */
    constructor() {
        super();
        this.loadImages(this.ENDBOSS_STATUSBAR);
        /** @type {number} X-position in the canvas */
        this.x = 500;
        /** @type {number} Y-position in the canvas */
        this.y = 13;
        /** @type {number} Width of the status bar */
        this.width = 200;
        /** @type {number} Height of the status bar */
        this.height = 40;
        this.setPercentageEndboss(100);
    }
    
    /**
     * Sets the current percentage value and updates the status image.
     * @param {number} percentage - New percentage value (0–100)
     */
    setPercentageEndboss(percentage) {
        this.percentage = percentage;
        let path = this.ENDBOSS_STATUSBAR[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }
    
    /**
     * Determines the appropriate image index for the current percentage value.
     * @returns {number} Index in the ENDBOSS_STATUSBAR array
     */
    resolveImageIndex() {
        if (this.percentage === 100) {
            return 5;
        }
        else if (this.percentage >= 80) {
            return 4;
        }
        else if (this.percentage >= 60) {
            return 3;
        }
        else if (this.percentage >= 40) {
            return 2;
        }
        else if (this.percentage >= 20) {
            return 1;
        }
        else {
            return 0;
        }
    }
}