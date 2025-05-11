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
    
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        super.loadImages(this.IMAGES_WALKING);
        
        this.x = this.getRandomPosition();
        this.speed = 0.15 + Math.random() * 0.5; // Erhöhte Geschwindigkeitsvarianz
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