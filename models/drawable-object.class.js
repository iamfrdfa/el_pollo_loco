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
    
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }
    
    draw(ctx) {
        try {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        } catch (e) {
            console.warn('Error loading image:', e);
            console.log('Could not load image:', this.img.src);
        }
    }
    
    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof TinyChicken || this instanceof Bottle || this instanceof Coins || this instanceof Endboss) {
            ctx.beginPath();
            ctx.lineWidth = '4';
            ctx.strokeStyle = 'red';
            ctx.rect(
                this.x,
                this.y,
                this.width,
                this.height
            );
            ctx.stroke();
        }
    }
    
    drawBlueFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof TinyChicken || this instanceof Bottle || this instanceof Coins || this instanceof Endboss) {
            ctx.beginPath();
            ctx.lineWidth = '4';
            ctx.strokeStyle = 'blue';
            ctx.rect(
                this.x + this.offset.left,
                this.y + this.offset.top,
                this.width  - (this.offset.left + this.offset.right),
                this.height - (this.offset.top  + this.offset.bottom)
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