/**
 * Basisklasse für alle zeichnbaren Objekte im Spiel.
 * Stellt Position, Größe, Bildverarbeitung und Zeichenfunktionen bereit.
 *
 * @class
 */
class DrawableObject {
    /**
     * X-Position des Objektes auf dem Canvas.
     * @type {number}
     */
    x = 120;
    
    /**
     * Y-Position des Objektes auf dem Canvas.
     * @type {number}
     */
    y = 280;
    
    /**
     * Höhe des Objektes in Pixel.
     * @type {number}
     */
    height = 150;
    
    /**
     * Breite des Objektes in Pixel.
     * @type {number}
     */
    width = 100;
    
    /**
     * Aktuell geladenes Bildobjekt.
     * @type {HTMLImageElement|undefined}
     */
    img;
    
    /**
     * Zwischenspeicher für alle geladene Bilder zum Objekt.
     * @type {Object.<string,HTMLImageElement>}
     */
    imageCache = {};
    
    /**
     * Index für das aktuell angezeigte Bild, z.B. für Animationen.
     * @type {number}
     */
    currentImage = 0;
    
    /**
     * Offset für den Kollisionsrahmen.
     * @type {{top: number, bottom: number, left: number, right: number}}
     */
    offset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }
    
    /**
     * Lädt ein einzelnes Bild für das Objekt.
     *
     * @param {string} path - Der Pfad zur Bilddatei.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }
    
    /**
     * Zeichnet das Objekt auf dem Canvas-Kontext.
     * Zeigt eine Warnung, falls ein Bild nicht geladen werden kann.
     *
     * @param {CanvasRenderingContext2D} ctx - Zeichenkontext des Canvas.
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
     * Zeichnet einen roten Rahmen um das Objekt (Hitbox).
     * Nur für bestimmte Typen (z.B. Spielfiguren oder Gegner).
     *
     * @param {CanvasRenderingContext2D} ctx - Zeichenkontext des Canvas.
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
     * Zeichnet einen blauen Rahmen basierend auf dem Offset (Kollisionsrahmen).
     * Nur für bestimmte Typen.
     *
     * @param {CanvasRenderingContext2D} ctx - Zeichenkontext des Canvas.
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
     * Lädt mehrere Bilder, die für dieses Objekt benutzt werden (z.B. für Animationen).
     *
     * @param {string[]} arr - Array mit Pfaden zu den Bilddateien.
     */
    loadImages(arr) {
        arr.forEach((path) =>{
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}