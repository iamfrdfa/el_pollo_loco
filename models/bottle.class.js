class Bottle extends MovableObject {
    y = 370;
    height = 400 / 8;
    width = 400 / 8;
    innerOffset = {
        top: 10,
        bottom: 15,
        left: 13,
        right: 20,
    }
    
    BOTTLE_ON_GROUND = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    ];
    
    constructor() {
        super().loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.loadImages(this.BOTTLE_ON_GROUND);
        
        this.x = 300 + Math.random() * 1850;
    }
    
    animate() {
        setInterval(() => {
            this.playAnimation(this.BOTTLE_ON_GROUND);
        }, 160);
    }
}