/**
 * Statusbalken für den Endboss.
 * Diese Klasse zeigt an, wie viel Energie der Endboss aktuell noch hat
 * und aktualisiert die Statusanzeige anhand des aktuellen Prozentwerts.
 * Erbt von {@link DrawableObject}.
 *
 * @class
 * @extends DrawableObject
 */
class statusBarEndboss extends DrawableObject {
    /**
     * Array mit Bildpfaden für die verschiedenen Zustände des Endboss-Statusbalkens.
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
     * Prozentwert des Endboss-Lebens (0–100).
     * @type {number}
     */
    percentage = 0;
    
    /**
     * Erstellt eine neue Instanz des Endboss-Statusbalkens.
     * Legt Position, Größe und Initialbild fest und lädt alle Statusbilder.
     */
    constructor() {
        super();
        this.loadImages(this.ENDBOSS_STATUSBAR);
        /** @type {number} X-Position im Canvas */
        this.x = 500;
        /** @type {number} Y-Position im Canvas */
        this.y = 13;
        /** @type {number} Breite des Statusbalkens */
        this.width = 200;
        /** @type {number} Höhe des Statusbalkens */
        this.height = 40;
        this.setPercentageEndboss(100);
    }
    
    /**
     * Setzt den aktuellen Prozentwert und aktualisiert das Statusbild.
     * @param {number} percentage - Neuer Prozentwert (0–100)
     */
    setPercentageEndboss(percentage) {
        this.percentage = percentage;
        let path = this.ENDBOSS_STATUSBAR[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }
    
    /**
     * Ermittelt für den aktuellen Prozentwert den passenden Bildindex.
     * @returns {number} Index im ENDBOSS_STATUSBAR-Array
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