class ThrowableObject extends MovableObject {

    constructor(x, y) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        super.loadImages(this.BOTTLE_ROTATION);
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.animate();
        this.throw();
    }
    
    BOTTLE_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ];
    
    animate() {
        setInterval(() => {
            this.playAnimation(this.BOTTLE_ROTATION);
        }, 100);
    }
    
    throw() {
        this.speedY = 10;
        this.applyGravity();
        setInterval(() => {
           this.x += 25 ;
        }, 50);
    }
}