class Coins extends MovableObject {
    y = 550;
    height = 120;
    width = 120;
    coinAmount = 0;
    offset = {
        top: 42,
        bottom: 42,
        left: 42,
        right: 42,
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