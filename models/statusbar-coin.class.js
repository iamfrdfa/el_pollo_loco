/**
 * Statusbalken für Münzen.
 * Diese Klasse zeigt grafisch an, wie viele Münzen eingesammelt wurden,
 * und aktualisiert das Statusbild je nach Prozentwert.
 * Erbt von {@link DrawableObject}.
 *
 * @class
 * @extends DrawableObject
 */
class statusBarCoin extends DrawableObject {
    /**
     * Array mit Bildpfaden für die unterschiedlichen Zustände des Münz-Statusbalkens.
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
     * Prozentwert der eingesammelten Münzen (0–100).
     * @type {number}
     */
    percentage = 0;
    
    /**
     * Legt eine neue Instanz der Münz-Statusbar an.
     * Initialisiert Anzeige, Position und lädt alle Statusbilder.
     */
    constructor() {
        super();
        this.loadImages(this.COIN_STATUSBAR);
        /** @type {number} X-Position im Canvas */
        this.x = 20;
        /** @type {number} Y-Position im Canvas */
        this.y = 85;
        /** @type {number} Breite des Statusbalkens */
        this.width = 200;
        /** @type {number} Höhe des Statusbalkens */
        this.height = 40;
        this.setPercentageCoin(0);
    }
    
    /**
     * Setzt den Prozentwert und aktualisiert das angezeigte Statusbild.
     * @param {number} percentage - Neuer Wert im Bereich 0–100
     */
    setPercentageCoin(percentage) {
        this.percentage = percentage;
        let path = this.COIN_STATUSBAR[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }
    
    /**
     * Gibt den Index des Statusbildes für den aktuellen Prozentwert zurück.
     * @returns {number} Index im COIN_STATUSBAR-Array
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