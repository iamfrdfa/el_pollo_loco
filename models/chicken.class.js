class Chicken extends MovableObject {
    world; // Neue Property
    y = 360;
    height = 70;
    width = 50;
    offset = {
        top: 5,
        bottom: 5,
        right: 0,
        left: 0,
    }
    
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];
    
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ]
    
    isDying = false;
    
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        super.loadImages(this.IMAGES_WALKING);
        super.loadImages(this.IMAGES_DEAD);  // Todesbild laden
        
        this.x = this.getRandomPosition();
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();
    }
    
    /**
     * Generiert eine zufällige Position für Gegner
     * @returns {number} X-Position für den Gegner
     */
    getRandomPosition() {
        const endBossPosition = 2200;        // Position des Endbosses
        const safetyDistanceBoss = 350;      // Mindestabstand zum Endboss
        const normalSafetyDistance = 100;    // Normaler Mindestabstand zum Character
        
        // Hole die aktuelle Character-Position aus der World
        let characterX = this.world?.character?.x || 0;
        
        // Wähle den passenden Mindestabstand basierend auf Spielstart
        let safetyDistanceCharacter = this.world?.isGameStart ?
            this.world.initialSpawnDistance :
            normalSafetyDistance;
        
        // Generiere so lange neue Positionen, bis eine gültige gefunden wird
        let position;
        do {
            position = Math.random() * (endBossPosition - safetyDistanceBoss);
        } while (
            Math.abs(position - characterX) < safetyDistanceCharacter
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
        }, 2000);
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
