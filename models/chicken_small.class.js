class TinyChicken extends MovableObject {
    world; // Neue Property
    y = 385;
    height = 40;
    width = 50;
    offset = {
        top: 0,
        bottom: 0,
        right: 5,
        left: 5,
    }
    
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];
    
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ]
    
    isDying = false;
    
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        super.loadImages(this.IMAGES_WALKING);
        super.loadImages(this.IMAGES_DEAD);  // Todesbild laden
        
        this.x = this.getRandomPosition();
        this.speed = 0.2 + Math.random() * 0.6;
        this.animate();
    }
    
    /**
     * Generiert eine zufällige Position für Gegner
     * @returns {number} X-Position für den Gegner
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
     * Spielt die Todesanimation ab und entfernt das Chicken nach 2 Sekunden
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