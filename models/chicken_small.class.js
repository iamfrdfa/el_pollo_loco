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
    
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        super.loadImages(this.IMAGES_WALKING);
        
        this.x = this.getRandomPosition();
        this.speed = 0.2 + Math.random() * 0.6; // Noch höhere Geschwindigkeitsvarianz für kleine Hühner
        this.animate();
    }
    
    /**
     * Generiert eine zufällige Position unter Berücksichtigung des Mindestabstands zum Character und Endboss
     */
    getRandomPosition() {
        const endBossPosition = 2200;        // Position des Endbosses
        const safetyDistanceBoss = 350;      // Mindestabstand zum Endboss
        const safetyDistanceCharacter = 100;  // Mindestabstand zum Character
        
        // Hole die aktuelle Character-Position aus der World
        let characterX = this.world?.character?.x || 0;
        
        // Generiere so lange neue Positionen bis eine gültige gefunden wird
        let position;
        do {
            position = Math.random() * (endBossPosition - safetyDistanceBoss);
        } while (
            Math.abs(position - characterX) < safetyDistanceCharacter
            );
        
        return position;
    }
    
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
        
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }
}