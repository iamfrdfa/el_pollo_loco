class Chicken extends MovableObject {
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
        
        this.x = 400 + Math.random() * 500; //Irgendeine Zahl zwischen 200 - 700 zum Positionieren der Chicken
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