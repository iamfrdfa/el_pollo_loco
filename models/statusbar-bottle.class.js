/**
 * Statusbalken für Flaschen.
 * Diese Klasse zeigt den aktuellen Füllstand der gesammelten Flaschen an und
 * aktualisiert grafisch die Anzeige je nach Prozentwert.
 * Erbt von {@link DrawableObject}.
 *
 * @class
 * @extends DrawableObject
 */
class statusBarBottle extends DrawableObject {
    /**
     * Array mit den Bildpfaden für die unterschiedlichen Statusanzeigen der Flaschen.
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
     * Prozentwert der gesammelten Flaschen.
     * @type {number}
     */
    percentage = 0;
    
    /**
     * Erstellt eine neue Instanz des Flaschen-Statusbalkens und initialisiert das Bild sowie Position und Größe.
     */
    constructor() {
        super();
        // Standardbild initial laden
        this.loadImage(this.BOTTLE_STATUSBAR[0]);
        // Alle Bilder für die verschiedenen Statusstände laden
        this.loadImages(this.BOTTLE_STATUSBAR);
        /**
         * X-Position im Canvas.
         * @type {number}
         */
        this.x = 20;
        /**
         * Y-Position im Canvas.
         * @type {number}
         */
        this.y = 45;
        /**
         * Breite des Statusbalkens.
         * @type {number}
         */
        this.width = 200;
        /**
         * Höhe des Statusbalkens.
         * @type {number}
         */
        this.height = 40;
        this.setPercentageBottle(0);
    }
    
    /**
     * Setzt den Prozentwert der Statusbar und aktualisiert das aktuelle Bild.
     * @param {number} percentage - Der neue Prozentwert (0-100)
     */
    setPercentageBottle(percentage) {
        this.percentage = percentage;
        let path = this.BOTTLE_STATUSBAR[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }
    
    /**
     * Berechnet anhand des Prozentwertes das Bildindex für den Statusbalken.
     * @returns {number} Index im BOTTLE_STATUSBAR-Array für das anzuzeigende Bild
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