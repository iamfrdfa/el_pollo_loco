class ThrowableObject extends MovableObject {

    constructor(x, y) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        super.loadImages(this.BOTTLE_THROWN);
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.throw();
    }
    
    BOTTLE_THROWN = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ];
    
    throw() {
        this.speedY = 22;
        this.applyGravity();
        setInterval(() => {
           this.x += 13;
        }, 50);
    }
}