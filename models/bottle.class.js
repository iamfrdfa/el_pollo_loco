class Bottle extends MovableObject {
    y = 370;
    height = 400 / 8;
    width = 400 / 8;
    
    BOTTLE_ON_GROUND = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    ]
    
    BOTTLE_THROW = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ]
    
    constructor() {
        super().loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.loadImages(this.BOTTLE_ON_GROUND);
        
        this.x = 150 + Math.random() * 600;
    }
    
    
    animate() {
        
        setInterval(() => {
            this.playAnimation(this.BOTTLE_ON_GROUND);
        }, 160);
        
    }
}