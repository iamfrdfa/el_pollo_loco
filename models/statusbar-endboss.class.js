class statusBarEndboss extends DrawableObject {
    ENDBOSS_STATUSBAR = [
        'img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue100.png'
    ];
    
    percentage = 0;
    
    constructor() {
        super();
        this.loadImages(this.ENDBOSS_STATUSBAR);
        this.x = 500;
        this.y = 13;
        this.width = 200;
        this.height = 40;
        this.setPercentageEndboss(100);
    }
    
    setPercentageEndboss(percentage) {
        this.percentage = percentage;
        let path = this.ENDBOSS_STATUSBAR[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }
    
    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        }
        else if (this.percentage > 80) {
            return 4;
        }
        else if (this.percentage > 60) {
            return 3;
        }
        else if (this.percentage > 40) {
            return 2;
        }
        else if (this.percentage > 20) {
            return 1;
        }
        else {
            return 0;
        }
    }
}