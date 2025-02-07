class TinyChicken extends MovableObject {
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
        
        this.x = 200 + Math.random() * 500; //Irgendeine Zahl zwischen 200 - 700 zum Positionieren der Chicken
        this.speed = 0.15 + Math.random() * 0.25; //Zufällige Zahl für unterschiedliche Geschwindigkeit für die Hühnchen
        this.animate();
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