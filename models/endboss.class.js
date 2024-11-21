class Endboss extends MovableObject {
    height = 500;
    width = 300;
    y = 55;
    
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
    
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 2500;
        this.animate();
    }
    
    animate() {
        setInterval(() => {
           this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }
}