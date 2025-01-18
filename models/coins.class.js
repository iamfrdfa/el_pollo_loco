class Coins extends MovableObject {
    y = 300;
    height = 120;
    width = 120;
    coinAmount = 20;
    innerOffset = {
        top: 35,
        bottom: 70,
        left: 35,
        right: 70,
    }
    
    COLLECTIBLE_COINS = [
        'img/8_coin/coin_1.png'
    ];
    
    constructor() {
        super().loadImage('img/8_coin/coin_1.png');
        this.loadImages(this.COLLECTIBLE_COINS);
        
        this.x = 250 + Math.random() * 1500;
        let tmp_Y = 320
        for (let i = 0; i <= this.coinAmount; i++) {
            for (let i = 0; i < tmp_Y; i++) {
                this.y = 100 + Math.random() * 230;
            }
        }
    }
}