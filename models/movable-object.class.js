class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 1;
    energy = 100;
    lastHit = 0;
    
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }
    
    isAboveGround(){
        return this.y < 230;
    }
    
    isColliding(mo) {
        return this.x + this.width > mo.x &&
            this.y + this.height > mo.y &&
            this.x < mo.x &&
            this.y < mo.y + mo.height;
    }
    
    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }
    
    isHurt() {
        let timepassed =  new Date().getTime() - this.lastHit; //Difference in ms
        timepassed = timepassed / 1000; //Difference in sec
        return timepassed < 0.5;
    }
    
    isDead() {
        return this.energy == 0;
    }
    
    //character.isColliding(chicken);
    /*isColliding (mo) {
        return (this.x + this.width) >= mo.x && this.x <= (mo.x + mo.width) &&
            (this.y + this.offsetY + this.height) >= mo.y &&
            (this.y + this.offsetY) <= (mo.y + mo.height) &&
            mo.onCollisionCourse; // Optional: hiermit könnten wir schauen, ob ein Objekt sich in die richtige Richtung bewegt. Nur dann kollidieren wir. Nützlich bei Gegenständen, auf denen man stehen kann.
    }*/
    
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
    
    moveRight() {
        this.x += this.speed;
    }
    
    moveLeft() {
        this.x -= this.speed;
    }
    
    jump() {
        this.speedY = 30;
    }
}