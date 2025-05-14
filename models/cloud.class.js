/**
 * Stellt eine Wolke im Spiel dar.
 * Diese Klasse erweitert MovableObject und sorgt für animierte Bewegungen der Wolken.
 */
class Cloud extends MovableObject {
    /**
     * Die Y-Position der Wolke.
     * @type {number}
     */
    y = 20;
    
    /**
     * Die Höhe der Wolke.
     * @type {number}
     */
    height = 250;
    
    /**
     * Die Breite der Wolke.
     * @type {number}
     */
    width = 500;
    
    /**
     * Erstellt eine neue Wolke und startet die Animation.
     */
    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        /**
         * Die X-Position wird zufällig gewählt.
         * @type {number}
         */
        this.x = Math.random() * 500;
        this.animate();
    }
    
    /**
     * Startet die Bewegung der Wolke nach links.
     */
    animate() {
        this.moveLeft();
    }
}