/**
 * Status bar for the health display.
 * This class displays the player's current health status as a bar
 * and updates the display graphically according to the percentage value.
 * Inherits from {@link DrawableObject}.
 *
 * @class
 * @extends DrawableObject
 */
class StatusBarHealth extends DrawableObject {
    /**
     * Array with image paths for the different health displays (0% to 100%).
     * @type {string[]}
     */
    IMAGES_HEALTH = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',   // 0%
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',  // 20%
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',  // 40%
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',  // 60%
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',  // 80%
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'  // 100%
    ];
    
    /**
     * Health percentage display (0–100).
     * @type {number}
     */
    percentage = 100;
    
    /**
     * Creates a new health display status bar and loads all status images.
     * Sets position, size, and initial value.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_HEALTH);
        /** @type {number} X-position in the canvas */
        this.x = 20;
        /** @type {number} Y-position in the canvas */
        this.y = 10;
        /** @type {number} Width of the status bar */
        this.width = 200;
        /** @type {number} Height of the status bar */
        this.height = 40;
        this.setPercentage(100);
    }
    
    /**
     * Sets the health percentage value and updates the status image.
     * @param {number} percentage - New percentage value of the health display (0–100)
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES_HEALTH[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }
    
    /**
     * Returns the corresponding image index for the health display, depending on the percentage value.
     * @returns {number} Index in the IMAGES_HEALTH array
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
