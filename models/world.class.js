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
    
    // Flags
    enemyIsHitted = false;
    bottleThrow = false;
    initialSpawnDistance = 300;
    normalSpawnDistance = 150;
    fastSpawnInterval = 500;
    normalSpawnInterval = 2000;
    spawnIntervalId = null;
    isGameStart = true;
    
    /** @type {HTMLAudioElement} */
    game_sound = new Audio('audio/background_music.mp3');
    
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
        this.game_sound.play();
        this.game_sound.volume = 0.1;
        
        this.startChickenSpawning();
        this.spawnEnabled = true; // Aktiviere das Spawning
        this.initChickenSpawning(); // Starte das Chicken-Spawning
        
        
        setTimeout(() => {
            this.isGameStart = false;
        }, 5000);
    }
    
    setWorld() {
        this.character.world = this;
        // Set the world reference for all enemies
        this.level.enemies.forEach(enemy => {
            enemy.world = this;
        });
    }
    
    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkGameEnd();
            if (this.keyboard.D && !this.bottleThrow) {
                this.bottleThrow = true;
                this.checkThrowObjects();
                setTimeout(() => {
                    this.bottleThrow = false;
                }, 500);
            }
        }, 1000 / 60);
    }
    
    checkGameEnd() {
        if (this.character.isDead() || (this.level.enemies.find(e => e instanceof Endboss)?.isDead())) {
            if (this.character.isDead()) {
                this.character.game_over.play();
            }
            this.clearGameObjects();
            
            setTimeout(() => {
                stopGame();
            }, 1000);
            
            return;
        }
    }
    
    clearGameObjects() {
        // Hide character and stop sounds
        this.character.width = 0;
        this.character.height = 0;
        this.stopCharacterSounds();
        
        // Hide all enemies and stop their sounds
        this.level.enemies.forEach(enemy => {
            enemy.width = 0;
            enemy.height = 0;
            if (enemy instanceof Endboss) {
                this.stopEndbossSounds(enemy);
            }
        });
        
        // Hide all bottles
        this.level.bottles.forEach(bottle => {
            bottle.width = 0;
            bottle.height = 0;
        });
        
        // Hide all coins
        this.level.coins.forEach(coin => {
            coin.width = 0;
            coin.height = 0;
        });
        
        // Hide all thrown bottles
        this.throwableObjects.forEach(obj => {
            obj.width = 0;
            obj.height = 0;
        });
        
        // Clear arrays
        setTimeout(() => {
            this.level.enemies = [];
            this.level.bottles = [];
            this.level.coins = [];
            this.throwableObjects = [];
        }, 50);
    }
    
    stopCharacterSounds() {
        if (this.character.walking_sound) this.character.walking_sound.pause();
        if (this.character.hurt_sound) this.character.hurt_sound.pause();
        if (this.character.snoring_sound) this.character.snoring_sound.pause();
        if (this.character.bottle_sound) this.character.bottle_sound.pause();
        if (this.character.coin_sound) this.character.coin_sound.pause();
        if (this.character.weaponFail_sound) this.character.weaponFail_sound.pause();
        if (this.character.throwBottle_sound) this.character.throwBottle_sound.pause();
        if (this.character.chickenDeath_sound) this.character.chickenDeath_sound.pause();
        if (this.game_sound) this.game_sound.pause();
    }
    
    stopEndbossSounds(endboss) {
        // Stop all endboss sounds, if present
        if (endboss.hurt_sound) endboss.hurt_sound.pause();
        if (endboss.endboss_hit) endboss.endboss_hit.pause();
    }
    
    checkThrowObjects() {
        if (this.character.bottleAmount > 0) {
            let bottle = new ThrowableObject(
                this.character.x + 50,
                this.character.y + 100,
                this.character.otherDirection
            );
            this.throwableObjects.push(bottle);
            this.character.bottleAmount--;
            this.statusBarBottle.setPercentageBottle(this.character.bottleAmount * 20);
            this.character.throwBottle_sound.play();
            
            // Add a short delay before the next bottle can be thrown
            this.bottleThrow = true;
            setTimeout(() => {
                this.bottleThrow = false;
            }, 500);
        } else if (this.keyboard.D && this.character.bottleAmount === 0) {
            this.character.weaponFail_sound.play();
        }
    }
    
    /**
     * Starts the chicken spawning system
     */
    startChickenSpawning() {
        this.spawnEnabled = true;
        this.isGameStart = true;
        
        // Fast spawning for the first 5 seconds
        this.spawnIntervalId = setInterval(() => {
            this.spawnChicken();
        }, this.fastSpawnInterval);
        
        // Switch to normal spawning after 5 seconds
        setTimeout(() => {
            this.isGameStart = false;
            clearInterval(this.spawnIntervalId);
            this.spawnIntervalId = setInterval(() => {
                this.spawnChicken();
            }, this.normalSpawnInterval);
        }, 5000);
    }
    
    spawnChicken() {
        if (!this.spawnEnabled) return;
        
        if (this.level.enemies.length < 15) {
            let newChicken;
            if (Math.random() < 0.5) {
                newChicken = new Chicken();
            } else {
                newChicken = new TinyChicken();
            }
            newChicken.world = this;
            
            if (this.isValidSpawnPosition(newChicken.x)) {
                this.level.enemies.push(newChicken);
            }
        }
        
        // Remove chickens that are too far left
        this.level.enemies = this.level.enemies.filter(enemy => {
            return !(enemy instanceof Chicken || enemy instanceof TinyChicken) || enemy.x > -100;
        });
    }
    
    /**
     * Initializes random chicken spawning
     */
    initChickenSpawning() {
        if (!this.spawnEnabled) return;
        
        setInterval(() => {
            if (!this.spawnEnabled) return;
            
            if (this.level.enemies.length < 10) {
                let newChicken;
                if (Math.random() < 0.5) {
                    newChicken = new Chicken();
                } else {
                    newChicken = new TinyChicken();
                }
                newChicken.world = this;
                
                if (this.isValidSpawnPosition(newChicken.x)) {
                    this.level.enemies.push(newChicken);
                }
            }
            
            // Remove chickens that are too far left
            this.level.enemies = this.level.enemies.filter(enemy => {
                return !(enemy instanceof Chicken || enemy instanceof TinyChicken) || enemy.x > -100;
            });
        }, 2000);
    }
    
    isValidSpawnPosition(position) {
        const minDistance = this.isGameStart ? this.initialSpawnDistance : this.normalSpawnDistance;
        const distanceToCharacter = Math.abs(position - this.character.x);
        return distanceToCharacter >= minDistance;
    }
    
    /**
     * Checks if the character jumps on an enemy from above
     * @param {MovableObject} enemy - The enemy
     * @returns {boolean} true if the character jumps on the enemy from above
     */
    isJumpingOnEnemy(enemy) {
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
     * Function which is checking collision between character and enemies or bottle with enemies
     */
    checkCollisions() {
        // Check collision with enemies
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
        
        // Check collision between enemies and bottle
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
        
        // Check collision with coins
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
        
        // Check collision with bottles
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
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.ctx.translate(-this.camera_x, 0);
        
        // ------ Space for absolute fixed objects (e.g. health bar) ------//
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarBottle);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarEndboss);
        this.ctx.translate(this.camera_x, 0);
        
        // ------ Space for fixed objects in canvas ------//
        this.addObjectsToMap(this.level.bottles); // Draw bottles first
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.level.coins);
        
        this.ctx.translate(-this.camera_x, 0);
        
        let self = this;
        this.animationFrame = requestAnimationFrame(function () {
            self.draw();
        });
    }
    
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }
    
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
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
