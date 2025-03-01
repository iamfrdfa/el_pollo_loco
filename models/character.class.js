class Character extends MovableObject {
    height = 200;
    y =  130;
    speed = 20;
    world;
    walking_sound = new Audio('audio/walking.mp3');
    hurt_sound = new Audio('audio/hurt_sound.mp3');
    game_over = new Audio('audio/game_over.mp3');
    coin_sound = new Audio('audio/coin_collect.mp3');
    bottle_sound = new Audio('audio/glass-bottles.mp3');
    throwBottle_sound = new Audio('audio/throw_sound.mp3');
    chickenDeath_sound = new Audio('audio/chicken_death.mp3');
    offset = {
        top: 80,
        bottom: 10,
        left: 25,
        right: 25
    }
    coinAmount = 0;
    bottleAmount = 5;
    
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];
    
    IMAGES_JUMPING = [
      'img/2_character_pepe/3_jump/J-31.png',
      'img/2_character_pepe/3_jump/J-32.png',
      'img/2_character_pepe/3_jump/J-33.png',
      'img/2_character_pepe/3_jump/J-34.png',
      'img/2_character_pepe/3_jump/J-35.png',
      'img/2_character_pepe/3_jump/J-36.png',
      'img/2_character_pepe/3_jump/J-37.png',
      'img/2_character_pepe/3_jump/J-38.png',
      'img/2_character_pepe/3_jump/J-39.png'
    ];
    
    IMAGES_HURT = [
        
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];
    
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];
    
    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        super.loadImages(this.IMAGES_WALKING);
        super.loadImages(this.IMAGES_JUMPING);
        super.loadImages(this.IMAGES_HURT);
        super.loadImages(this.IMAGES_DEAD);
        this.applyGravity();
        this.animate();
    }
    
    animate() {
        setInterval(() => {
            this.walking_sound.pause();
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.walking_sound.play();
                this.otherDirection = false;
            }
            
            if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.walking_sound.play();
                this.otherDirection = true;
            }
            
            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.jump();
            }
            
            this.world.camera_x = -this.x + 100;
        }, 1000 / 30);
        
        
        let myInterval = setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
                this.game_over.play();
                clearInterval(myInterval);
            }
            else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
                this.hurt_sound.play();
            }
            else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
            }
            else {
                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    //Walk animation
                    this.playAnimation(this.IMAGES_WALKING);
                }
            }
        }, 60);
    }
    jump() {
        this.speedY = 20;
    }
}