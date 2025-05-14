/**
 * Stellt einen Hintergrund-Objekt im Spiel dar.
 * Diese Klasse erweitert MovableObject und ist für die Darstellung von Hintergrundbildern zuständig.
 */
class BackgroundObject extends MovableObject {
    /**
     * Die Breite des Hintergrundobjekts.
     * @type {number}
     */
    width = 720;
    
    /**
     * Die Höhe des Hintergrundobjekts.
     * @type {number}
     */
    height = 480;
    
    /**
     * Erstellt ein neues BackgroundObject.
     * @param {string} imagePath - Der Pfad zum Bild des Hintergrundobjekts.
     * @param {number} x - Die X-Position des Hintergrundobjekts.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}