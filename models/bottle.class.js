class Bottle extends MovableObject {
    y = 380;
    height = 400 / 8;
    width = 400 / 8;
    offset = {
        top: 10,
        bottom: 5,
        left: 20,
        right: 10,
    }
    
    BOTTLE_ON_GROUND = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    ];
    
    constructor() {
        super().loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.loadImages(this.BOTTLE_ON_GROUND);
        this.x = 300 + Math.random() * 2000;
    }
}