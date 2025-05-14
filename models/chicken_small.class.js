/**
 * Repräsentiert ein kleines Huhn als Gegnerobjekt im Spiel.
 * Erbt von MovableObject.
 *
 * @class
 * @extends MovableObject
 */
class TinyChicken extends MovableObject {
    /**
     * Referenz auf die aktuelle Spielwelt.
     * @type {?World}
     */
    world;
    
    /**
     * Vertikale Position des kleinen Huhns.
     * @type {number}
     */
    y = 385;
    
    /**
     * Höhe und Breite des kleinen Huhns (in Pixel).
     * @type {number}
     */
    height = 40;
    width = 50;
    
    /**
     * Offset für Kollisionserkennung.
     * @type {{top: number, bottom: number, left: number, right: number}}
     */
    offset = {
        top: 0,
        bottom: 0,
        right: 5,
        left: 5,
    }
    
    /**
     * Bildpfade für die Laufanimation des kleinen Huhns.
     * @type {string[]}
     */
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];
    
    /**
     * Bildpfad für das tote kleine Huhn.
     * @type {string[]}
     */
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ]
    
    /**
     * Gibt an, ob das kleine Huhn gerade stirbt.
     * @type {boolean}
     */
    isDying = false;
    
    /**
     * Erstellt eine neue Instanz TinyChicken und initialisiert sie.
     * Lädt Bilder und startet die Animation.
     *
     * @constructor
     */
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        super.loadImages(this.IMAGES_WALKING);
        super.loadImages(this.IMAGES_DEAD);  // Todesbild laden
        
        this.x = this.getRandomPosition();
        this.speed = 0.2 + Math.random() * 0.6;
        this.animate();
    }
    
    /**
     * Generiert eine zufällige Position für das kleine Huhn.
     * Platziert das Huhn im Spielfeld unter Berücksichtigung des Endbosses und Mindestabstands.
     * Fällt zurück auf eine sichere Position, wenn keine valide Position gefunden wird.
     *
     * @returns {number} X-Position für das kleine Huhn
     */
    getRandomPosition() {
        const endBossPosition = 2200;        // Position des Endbosses
        const safetyDistanceBoss = 350;      // Mindestabstand zum Endboss
        const maxAttempts = 10;              // Maximale Versuche eine Position zu finden
        let attempts = 0;
        let position;
        
        do {
            position = Math.random() * (endBossPosition - safetyDistanceBoss);
            attempts++;
            
            // Wenn nach maxAttempts keine valide Position gefunden wurde,
            // position weit rechts vom Character platzieren
            if (attempts >= maxAttempts) {
                position = this.world?.character?.x + 500 || 500;
                break;
            }
        } while (
            this.world &&
            this.world.character &&
            !this.world.isValidSpawnPosition(position)
            );
        
        return position;
    }
    
    /**
     * Spielt die Todesanimation ab, zeigt das Todesbild und entfernt das kleine Huhn nach 1 Sekunde aus dem Spiel.
     * Schützt vor Mehrfachausführung.
     */
    playDeathAnimation() {
        if (this.isDying) return; // Verhindert mehrfaches Auslösen
        
        this.isDying = true;
        this.speed = 0; // Bewegung stoppen
        this.img = this.imageCache[this.IMAGES_DEAD[0]]; // Todesbild anzeigen
        
        setTimeout(() => {
            // Direkte Entfernung aus dem enemies Array
            const index = this.world?.level?.enemies?.indexOf(this);
            if (this.world && index > -1) {
                this.world.level.enemies.splice(index, 1);
            }
        }, 1000);
    }
    
    /**
     * Startet die Bewegungs- und Animationszyklen für das kleine Huhn.
     * Bewegt das kleine Huhn nach links und spielt die Laufanimation ab, sofern es nicht stirbt.
     */
    animate() {
        setInterval(() => {
            if (!this.isDying) {
                this.moveLeft();
            }
        }, 1000 / 60);
        
        setInterval(() => {
            if (!this.isDying) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }
}