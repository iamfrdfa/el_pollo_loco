class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBarHealth();
    statusBarBottle = new statusBarBottle();
    statusBarCoin = new statusBarCoin();
    statusBarEndboss = new statusBarEndboss();
    throwableObjects = [];
    bottleHit = 20;
    
    //Flags
    enemyIsHitted = false;
    bottleThrow = false;
    
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
    }
    
    setWorld() {
        this.character.world = this;
    }
    
    run() {
        setInterval(() => {
            this.checkCollisions();
            if (this.keyboard.D && !this.bottleThrow) {
                this.bottleThrow = true;
                this.checkThrowObjects();
                setTimeout(() => {
                    this.bottleThrow = false;
                }, 100)
            }
        }, 1000 / 60);
    }
    
    checkThrowObjects() {
        if (this.character.bottleAmount > 0) {
            let bottle = new ThrowableObject(this.character.x + 50, this.character.y + 100, this.character.otherDirection);
            this.throwableObjects.push(bottle);
            this.character.bottleAmount--;
            this.statusBarBottle.setPercentageBottle(this.character.bottleAmount);
            this.character.throwBottle_sound.play();
        } else if (this.keyboard.D && this.character.bottleAmount === 0) {
            this.character.weaponFail_sound.play();
        }
    }
    
    /**
     * Function which is checking collision between character and enemies or bottle with enemies
     */
    checkCollisions() {
        // Is Checking collision/hit between Character and enemy
        this.level.enemies.forEach(enemy => {
            if (this.character.isColliding(enemy)) {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
            }
        });
        
        // Is Checking hit between bottle and enemy
        this.throwableObjects.forEach((thrownBottle) => {
            this.level.enemies.forEach(enemy => {
                if (thrownBottle.isColliding(enemy) && this.enemyIsHitted === false) {
                    this.enemyIsHitted = true;
                    this.character.chickenDeath_sound.play();
                    this.character.endbossEnergy -= this.bottleHit;
                    this.statusBarEndboss.setPercentageEndboss(this.character.endbossEnergy);
                    console.log(this.character.endbossEnergy);
                    this.enemyIsHitted = false;
                }
                if (thrownBottle.y > 450) {
                    this.throwableObjects.splice(thrownBottle);
                }
            });
        });
        
        // Is Checking collision between character and coins to collect them
        this.level.coins.forEach(coin => {
           if (this.character.isColliding(coin)) {
               if (this.character.coinAmount <= this.character.maxCoinAmount) {
                   this.character.coin_sound.play();
                   this.character.coinAmount++;
                   this.statusBarCoin.setPercentageCoin(this.character.coinAmount);
                   this.level.coins.splice(this.level.coins.indexOf(coin), 1);
               }
           }
        });
        
        // Is Checking collision between character and bottles to collect them
        this.level.bottles.forEach(bottle => {
           if (this.character.isColliding(bottle)) {
               if (this.character.bottleAmount <= this.character.maxBottleAmount) {
                   this.character.bottle_sound.play();
                   this.character.bottleAmount++;
                   this.statusBarBottle.setPercentageBottle(this.character.bottleAmount);
                   this.level.bottles.splice(this.level.bottles.indexOf(bottle), 1);
               }
           }
        });
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        
        this.ctx.translate(-this.camera_x, 0);
        // ------ Space for absolute fixed objects (e.g. health-bar) ------//
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarBottle);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarEndboss);
        this.ctx.translate(this.camera_x, 0);
        
        // ------ Space for fixed objects in Canvas ------//
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
        this.ctx.translate(-this.camera_x, 0);
        
        // Draw wird immer wieder aufgerufen
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }
    
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o)
        })
    }
    
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        // mo.drawFrame(this.ctx);
        mo.drawBlueFrame(this.ctx);
        
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }
    
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }
    
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}