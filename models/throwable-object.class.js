class ThrowableObject extends MovableObject {
    
    BOTTLE_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ];
    
    constructor(x, y, direction) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        super.loadImages(this.BOTTLE_ROTATION);
        
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.animate();
        this.throw();
    }
    
    animate() {
        setInterval(() => {
            this.playAnimation(this.BOTTLE_ROTATION);
        }, 100);
    }
    
    // Gravitation-configuration for thrown bottle
    throw() {
        console.log(bottleDirection);
        if (bottleDirection) {
            this.speedY = 10;
            this.applyGravity();
            setInterval(() => {
                this.x += 15 ;
            }, 50);
        } else  {
            this.speedY = 10;
            this.applyGravity();
            setInterval(() => {
                this.x -= 15 ;
            }, 50);
        }
    }
}