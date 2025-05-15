/**
 * Base class for all drawable objects in the game.
 * Provides position, size, image handling, and drawing functions.
 * @class
 */
class DrawableObject {
    /**
     * X-coordinate of the object on the canvas.
     * @type {number}
     */
    x = 120;
    
    /**
     * Y-coordinate of the object on the canvas.
     * @type {number}
     */
    y = 280;
    
    /**
     * Height of the object in pixels.
     * @type {number}
     */
    height = 150;
    
    /**
     * Width of the object in pixels.
     * @type {number}
     */
    width = 100;
    
    /**
     * Currently loaded image object.
     * @type {HTMLImageElement|undefined}
     */
    img;
    
    /**
     * Cache for all loaded images for the object.
     * @type {Object.<string,HTMLImageElement>}
     */
    imageCache = {};
    
    /**
     * Index for the currently displayed image, e.g., for animations.
     * @type {number}
     */
    currentImage = 0;
    
    /**
     * Offset for the collision box.
     * @type {{top: number, bottom: number, left: number, right: number}}
     */
    offset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }
    
    /**
     * Loads a single image for the object.
     * @param {string} path - The path to the image file.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }
    
    /**
     * Draws the object on the canvas context.
     * Displays a warning if an image cannot be loaded.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     */
    draw(ctx) {
        try {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        } catch (e) {
            console.warn('Error loading image:', e);
            console.log('Could not load image:', this.img.src);
        }
    }
    
    /**
     * Draws a red frame around the object (hitbox).
     * Only for specific types (e.g., characters or enemies).
     *
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     */
    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof TinyChicken || this instanceof Bottle || this instanceof Coins || this instanceof Endboss) {
            ctx.beginPath();
            ctx.lineWidth = '4';
            ctx.strokeStyle = 'red';
            ctx.rect(
                this.x,
                this.y,
                this.width,
                this.height
            );
            ctx.stroke();
        }
    }
    
    /**
     * Draws a blue frame based on the offset (collision box).
     * Only for specific types.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     */
    drawBlueFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof TinyChicken || this instanceof Bottle || this instanceof Coins || this instanceof Endboss) {
            ctx.beginPath();
            ctx.lineWidth = '4';
            ctx.strokeStyle = 'blue';
            ctx.rect(
                this.x + this.offset.left,
                this.y + this.offset.top,
                this.width  - (this.offset.left + this.offset.right),
                this.height - (this.offset.top  + this.offset.bottom)
            );
            ctx.stroke();
        }
    }
    
    /**
     * Loads multiple images that are used for this object (e.g., for animations).
     * @param {string[]} arr - Array with paths to the image files.
     */
    loadImages(arr) {
        arr.forEach((path) =>{
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}