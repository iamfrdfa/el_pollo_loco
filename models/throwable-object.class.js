class ThrowableObject extends MovableObject {
    BOTTLE_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ];
    
    BOTTLE_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ];
    
    hasHitObstacle = false;
    isSplashing = false;
    splashAnimation;
    offset = {
        top: 10,
        bottom: 10,
        left: 20,
        right: 20
    };
    
    constructor(x, y, direction) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        super.loadImages(this.BOTTLE_ROTATION);
        super.loadImages(this.BOTTLE_SPLASH);
        
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.animate();
        this.throw();
    }
    
    
    animate() {
        setInterval(() => {
            if (!this.isSplashing) {
                this.playAnimation(this.BOTTLE_ROTATION);
            }
        }, 100);
    }
    
    playSplashAnimation() {
        this.isSplashing = true;
        let splashIndex = 0;
        
        this.splashAnimation = setInterval(() => {
            if (splashIndex < this.BOTTLE_SPLASH.length) {
                this.img = this.imageCache[this.BOTTLE_SPLASH[splashIndex]];
                splashIndex++;
            } else {
                clearInterval(this.splashAnimation);
                // Flasche aus dem Array entfernen
                this.width = 0;
                this.height = 0;
            }
        }, 100);
    }
    
    // Gravitation-configuration for thrown bottle
    throw() {
        if (bottleDirection) {
            this.speedY = 10;
            this.applyGravity();
            setInterval(() => {
                if (!this.isSplashing) {
                    this.x += 15;
                }
            }, 50);
        } else {
            this.speedY = 10;
            this.applyGravity();
            setInterval(() => {
                if (!this.isSplashing) {
                    this.x -= 15;
                }
            }, 50);
        }
    }
}