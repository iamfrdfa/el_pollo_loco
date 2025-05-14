/**
 * Repräsentiert ein Huhn als Gegnerobjekt im Spiel.
 * Erbt von MovableObject.
 *
 * @class
 * @extends MovableObject
 */
class Chicken extends MovableObject {
    /**
     * Referenz auf die aktuelle Spielwelt.
     * @type {?World}
     */
    world;
    
    /**
     * Vertikale Position des Huhns.
     * @type {number}
     */
    y = 360;
    
    /**
     * Höhe und Breite des Huhns (in Pixel).
     * @type {number}
     */
    height = 70;
    width = 50;
    
    /**
     * Offset für Kollisionserkennung.
     * @type {{top: number, bottom: number, left: number, right: number}}
     */
    offset = {
        top: 5,
        bottom: 5,
        right: 0,
        left: 0,
    }
    
    /**
     * Bildpfade für die Laufanimation.
     * @type {string[]}
     */
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];
    
    /**
     * Bildpfad für das tote Huhn.
     * @type {string[]}
     */
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ]
    
    /**
     * Gibt an, ob das Huhn gerade stirbt.
     * @type {boolean}
     */
    isDying = false;
    
    /**
     * Erstellt eine neue Instanz Chicken und initialisiert sie.
     * Lädt Bilder und startet die Animation.
     *
     * @constructor
     */
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        super.loadImages(this.IMAGES_WALKING);
        super.loadImages(this.IMAGES_DEAD);  // Todesbild laden
        
        this.x = this.getRandomPosition();
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();
    }
    
    /**
     * Generiert eine zufällige Position für das Huhn.
     * Platziert das Huhn im Spielfeld unter Berücksichtigung des Endbosses und Mindestabstands.
     * Fällt zurück auf eine sichere Position, wenn keine valide Position gefunden wird.
     *
     * @returns {number} X-Position für das Huhn
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
     * Spielt die Todesanimation ab, zeigt das Todesbild und entfernt das Chicken nach 1 Sekunde aus dem Spiel.
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
     * Startet die Bewegungs- und Animationszyklen für das Huhn.
     * Bewegt das Huhn nach links und spielt die Laufanimation ab, sofern es nicht stirbt.
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
