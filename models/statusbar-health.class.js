/**
 * Statusbalken für die Lebensanzeige.
 * Diese Klasse zeigt den aktuellen Lebensstatus des Spielers als Balken an
 * und aktualisiert die Anzeige je nach Prozentwert grafisch.
 * Erbt von {@link DrawableObject}.
 *
 * @class
 * @extends DrawableObject
 */
class StatusBarHealth extends DrawableObject {
    /**
     * Array mit Bildpfaden für die verschiedenen Lebens-Anzeigen (0% bis 100%).
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
     * Prozentuale Lebensanzeige (0–100).
     * @type {number}
     */
    percentage = 100;
    
    /**
     * Erstellt eine neue Lebensanzeige-Statusbar und lädt alle Statusbilder.
     * Setzt Position, Größe und initialen Wert.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_HEALTH);
        /** @type {number} X-Position im Canvas */
        this.x = 20;
        /** @type {number} Y-Position im Canvas */
        this.y = 10;
        /** @type {number} Breite des Statusbalkens */
        this.width = 200;
        /** @type {number} Höhe des Statusbalkens */
        this.height = 40;
        this.setPercentage(100);
    }
    
    /**
     * Setzt den Lebens-Prozentwert und aktualisiert das Statusbild.
     * @param {number} percentage - Neuer Prozentwert der Lebensanzeige (0–100)
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES_HEALTH[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }
    
    /**
     * Liefert je nach Prozentwert das entsprechende Bildindex für die Lebensanzeige.
     * @returns {number} Index im IMAGES_HEALTH-Array
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