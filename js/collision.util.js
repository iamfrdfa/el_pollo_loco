/**
 * Handles collisions between character and enemies.
 * Manages hit for the character and the chickens
 * @method
 * @private
 */
function checkCollisionWithEnemies() {
    this.level.enemies.forEach((enemy) => {
        if (this.character.isColliding(enemy)) {
            if (enemy instanceof Chicken || enemy instanceof TinyChicken) {
                if (this.isJumpingOnEnemy(enemy)) {
                    enemy.playDeathAnimation();
                    this.character.speedY = 15;
                    this.character.chickenDeath_sound.play();
                } else if (!enemy.isDying) {
                    this.character.hit();
                }
            } else {
                this.character.hit();
            }
        }
    });
}

/**
 * Handles collisions between thrown bottles and enemies.
 * Manages death animations for chickens and damage to the endboss when hit by bottles.
 * Also handles bottle splash animations and cleanup.
 * @method
 * @private
 */
function checkCollisionBottleEnemy() {
    this.throwableObjects.forEach((thrownBottle) => {
        this.level.enemies.forEach(enemy => {
            if (thrownBottle.isColliding(enemy) && !thrownBottle.hasHitObstacle) {
                thrownBottle.hasHitObstacle = true;
                
                if (enemy instanceof Chicken || enemy instanceof TinyChicken) {
                    enemy.playDeathAnimation();
                    this.character.chickenDeath_sound.play();
                } else if (enemy instanceof Endboss) {
                    enemy.hit(); // Sound is now played inside hit() method of the endboss
                    this.statusBarEndboss.setPercentageEndboss(enemy.endbossEnergy);
                }
                
                thrownBottle.playSplashAnimation();
            }
        });
        
        if (thrownBottle.y > 450) {
            this.throwableObjects.splice(thrownBottle);
        }
    });
}

/**
 * Handles collision detection between the character and collectible bottles.
 * Updates bottle count, plays sound effects, and updates the UI when bottles are collected.
 * @method
 * @private
 */
function checkCollisionWithBottle() {
    this.level.bottles.forEach((bottle, index) => {
        if (this.character.isColliding(bottle)) {
            if (this.character.bottleAmount < this.character.maxBottleAmount) {
                this.character.bottle_sound.play();
                this.character.bottleAmount++;
                let percentage = (this.character.bottleAmount / this.character.maxBottleAmount) * 100;
                this.statusBarBottle.setPercentageBottle(percentage);
                this.level.bottles.splice(index, 1);
            }
        }
    });
}

/**
 * Handles collision detection between the character and collectible coins.
 * Updates coin count, plays sound effects, and triggers healing when coins are collected.
 * @method
 * @private
 */
function checkCollisionWithCoins() {
    this.level.coins.forEach((coin, index) => {
        if (this.character.isColliding(coin)) {
            if (this.character.coinAmount < this.character.maxCoinAmount) {
                this.character.coin_sound.play();
                this.character.coinAmount++;
                let percentage = (this.character.coinAmount / this.character.maxCoinAmount) * 100;
                this.statusBarCoin.setPercentageCoin(percentage);
                this.level.coins.splice(index, 1);
                this.character.healWithCoins();
            }
        }
    });
}

/**
 * Checks if the character jumps on an enemy from above
 * @param {MovableObject} enemy - The enemy
 * @returns {boolean} true if the character jumps on the enemy from above
 */
function isJumpingOnEnemy(enemy) {
    const isJumping = this.character.isAboveGround() &&
        this.character.speedY < 0 &&
        this.character.y + this.character.height > enemy.y &&
        this.character.x + this.character.width > enemy.x &&
        this.character.x < enemy.x + enemy.width;
    
    if (isJumping) {
        this.character.y = enemy.y - this.character.height + 20;
        this.character.speedY = 15;
    }
    
    return isJumping;
}

/**
 * Assigns collision detection utility functions to the World prototype.
 *
 * This enables all World instances to access these methods for handling
 * collisions between the character, enemies, throwable objects, bottles,
 * and coins within the game world.
 *
 * @function
 * @memberof World
 * @see checkCollisionWithEnemies
 * @see checkCollisionBottleEnemy
 * @see checkCollisionWithBottle
 * @see checkCollisionWithCoins
 */
World.prototype.checkCollisionWithEnemies = checkCollisionWithEnemies;
World.prototype.checkCollisionBottleEnemy = checkCollisionBottleEnemy;
World.prototype.checkCollisionWithBottle = checkCollisionWithBottle;
World.prototype.checkCollisionWithCoins = checkCollisionWithCoins;
World.prototype.isJumpingOnEnemy = isJumpingOnEnemy;
