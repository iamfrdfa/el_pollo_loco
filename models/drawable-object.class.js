class DrawableObject {
    x = 120;
    y = 280;
    height = 150;
    width = 100;
    img;
    imageCache = {};
    currentImage = 0;
    offset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }
    innerOffset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }
    
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }
    
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
    
    drawRedFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Bottle || this instanceof Coins || this instanceof Endboss) {
            ctx.beginPath();
            ctx.lineWidth = '3';
            ctx.strokeStyle = 'red';
            ctx.rect(
                this.x + this.innerOffset.left,
                this.y + this.innerOffset.top,
                this.width - this.innerOffset.right,
                this.height - this.innerOffset.bottom
            );
            ctx.stroke();
        }
    }
    
    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Bottle || this instanceof Coins || this instanceof Endboss) {
            ctx.beginPath();
            ctx.lineWidth = '4';
            ctx.strokeStyle = 'blue';
            ctx.rect(
                this.x + this.offset.left,
                this.y + this.offset.top,
                this.width - this.offset.right,
                this.height - this.offset.bottom
            );
            ctx.stroke();
        }
    }
    
    /**
     * @param {Array} arr - ['img/image1.png', img/image2.png', ...]
     */
    loadImages(arr) {
        arr.forEach((path) =>{
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}