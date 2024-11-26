class Coins extends MovableObject {
    y = 300;
    height = 120;
    width = 120;
    coinAmount = 5;
    
    COLLECTIBLE_COINS = [
        'img/8_coin/coin_1.png'
    ];
    
    constructor() {
        super().loadImage('img/8_coin/coin_1.png');
        this.loadImages(this.COLLECTIBLE_COINS);
        
        this.x = 250 + Math.random() * 300;
    }
    
    animate() {
        setInterval(() => {
            this.playAnimation(this.COLLECTIBLE_COINS);
        }, 160);
    }
}