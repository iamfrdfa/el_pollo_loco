class Endboss extends MovableObject {
    height = 400;
    width = 300;
    y = 55;
    offset = {
        top: 70,
        bottom: 10,
        right: 10,
        left: 35
    }
    
    IMAGES_WALKING = [
        'img/4_enemy_boss_chicken/1_walk/G1.png',
        'img/4_enemy_boss_chicken/1_walk/G2.png',
        'img/4_enemy_boss_chicken/1_walk/G3.png',
        'img/4_enemy_boss_chicken/1_walk/G4.png'
    ];
    
    IMAGES_HURT = [
        'img/4_enemy_boss_chicken/4_hurt/G21.png',
        'img/4_enemy_boss_chicken/4_hurt/G22.png',
        'img/4_enemy_boss_chicken/4_hurt/G23.png'
    ];
    
    ENDBOSS_DEATH = [
        'img/4_enemy_boss_chicken/5_dead/G24.png',
        'img/4_enemy_boss_chicken/5_dead/G25.png',
        'img/4_enemy_boss_chicken/5_dead/G26.png'
    ];
    
    currentImage = 0;
    animationInterval;
    isHurtAnimation = false;
    isDying = false;
    
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.ENDBOSS_DEATH);
        this.x = 2200;
        this.startAnimation();
    }
    
    startAnimation() {
        this.animationInterval = setInterval(() => {
            if (this.endbossEnergy <= 0) {
                if (!this.isDying) {
                    this.playDeathAnimation();
                }
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 150);
    }
    
    /**
     * Spielt die Todesanimation einmalig ab
     */
    playDeathAnimation() {
        this.isDying = true;
        clearInterval(this.animationInterval);
        
        let deathImage = 0;
        const deathInterval = setInterval(() => {
            if (deathImage < this.ENDBOSS_DEATH.length) {
                this.img = this.imageCache[this.ENDBOSS_DEATH[deathImage]];
                deathImage++;
            } else {
                clearInterval(deathInterval);
                // Behalte das letzte Bild der Todesanimation
                this.img = this.imageCache[this.ENDBOSS_DEATH[this.ENDBOSS_DEATH.length - 1]];
            }
        }, 200);
    }
    
    /**
     * Wird aufgerufen wenn der Endboss getroffen wird
     */
    hit() {
        this.endbossEnergy -= 20; // Reduziere endbossEnergy statt energy
        if (this.endbossEnergy < 0) {
            this.endbossEnergy = 0;
        }
        this.lastHit = new Date().getTime();
    }
    
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }
    
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}