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
        'img/4_enemy_boss_chicken/1_walk/G4.png',
    ];
    
    IMAGES_ATTACK = [
        'img/4_enemy_boss_chicken/3_attack/G13.png',
        'img/4_enemy_boss_chicken/3_attack/G14.png',
        'img/4_enemy_boss_chicken/3_attack/G15.png',
        'img/4_enemy_boss_chicken/3_attack/G16.png',
        'img/4_enemy_boss_chicken/3_attack/G17.png',
        'img/4_enemy_boss_chicken/3_attack/G18.png',
        'img/4_enemy_boss_chicken/3_attack/G19.png',
        'img/4_enemy_boss_chicken/3_attack/G20.png',
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
    ]
    
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.ENDBOSS_DEATH);
        this.x = 2200;
        this.animate();
    }
    
    animate() {
        setInterval(() => {
           if (this.endbossEnergy > 0) {
               this.playAnimation(this.IMAGES_WALKING);
           } else if (this.endbossEnergy === 0) {
                this.playAnimation(this.ENDBOSS_DEATH)
            }
        }, 200);
    }
}