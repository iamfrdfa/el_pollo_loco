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
    initialSpawnDistance = 300; // Initialer Mindestabstand
    normalSpawnDistance = 150;   // Normaler Mindestabstand
    fastSpawnInterval = 500;    // 0,5 Sekunden für schnelles Spawnen
    normalSpawnInterval = 2000; // 2 Sekunden für normales Spawnen
    spawnIntervalId = null;     // Speichert die Interval ID
    isGameStart = true;        // Flag für Spielstart
    
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
        
        // Nach 10 Sekunden auf normalen Spawn-Abstand umschalten
        setTimeout(() => {
            this.isGameStart = false;
        }, 5000);
    }
    
    setWorld() {
        this.character.world = this;
        // Setze die World-Referenz für alle Gegner
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
                }, 100)
            }
        }, 1000 / 60);
    }
    
    checkGameEnd() {
        // Prüfen ob der Character tot ist oder der Endboss besiegt wurde
        if (this.character.isDead() || (this.level.enemies.find(e => e instanceof Endboss)?.isDead())) {
            // Alle beweglichen Objekte entfernen
            this.clearGameObjects();
            
            // Kurze Verzögerung vor dem Spielende
            setTimeout(() => {
                stopGame();
            }, 1000); // 1 Sekunde Verzögerung
            
            return;
        }
    }
    
    clearGameObjects() {
        // Character ausblenden und Sounds stoppen
        this.character.width = 0;
        this.character.height = 0;
        this.stopCharacterSounds();
        
        // Alle Gegner ausblenden und Sounds stoppen
        this.level.enemies.forEach(enemy => {
            enemy.width = 0;
            enemy.height = 0;
            if (enemy instanceof Endboss) {
                this.stopEndbossSounds(enemy);
            }
        });
        
        // Alle Flaschen ausblenden
        this.level.bottles.forEach(bottle => {
            bottle.width = 0;
            bottle.height = 0;
        });
        
        // Alle Münzen ausblenden
        this.level.coins.forEach(coin => {
            coin.width = 0;
            coin.height = 0;
        });
        
        // Geworfene Flaschen ausblenden
        this.throwableObjects.forEach(obj => {
            obj.width = 0;
            obj.height = 0;
        });
        
        // Arrays leeren
        setTimeout(() => {
            this.level.enemies = [];
            this.level.bottles = [];
            this.level.coins = [];
            this.throwableObjects = [];
        }, 50);
    }
    
    stopCharacterSounds() {
        // Alle Character-Sounds stoppen
        if (this.character.walking_sound) this.character.walking_sound.pause();
        if (this.character.jumping_sound) this.character.jumping_sound.pause();
        if (this.character.hurt_sound) this.character.hurt_sound.pause();
        if (this.character.dead_sound) this.character.dead_sound.pause();
        if (this.character.snoring_sound) this.character.snoring_sound.pause();
        if (this.character.bottle_sound) this.character.bottle_sound.pause();
        if (this.character.coin_sound) this.character.coin_sound.pause();
        if (this.character.weaponFail_sound) this.character.weaponFail_sound.pause();
        if (this.character.throwBottle_sound) this.character.throwBottle_sound.pause();
        if (this.character.chickenDeath_sound) this.character.chickenDeath_sound.pause();
    }
    
    stopEndbossSounds(endboss) {
        // Alle Endboss-Sounds stoppen, falls vorhanden
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
            this.statusBarBottle.setPercentageBottle(this.character.bottleAmount * 20); // Prozentuale Anpassung
            this.character.throwBottle_sound.play();
        } else if (this.keyboard.D && this.character.bottleAmount === 0) {
            this.character.weaponFail_sound.play();
        }
    }
    
    /**
     * Startet das Chicken-Spawning System
     */
    startChickenSpawning() {
        this.spawnEnabled = true;
        this.isGameStart = true;
        
        // Schnelles Spawnen für die ersten 5 Sekunden
        this.spawnIntervalId = setInterval(() => {
            this.spawnChicken();
        }, this.fastSpawnInterval);
        
        // Nach 5 Sekunden auf normales Spawning umschalten
        setTimeout(() => {
            this.isGameStart = false;
            // Altes Spawn-Intervall stoppen
            clearInterval(this.spawnIntervalId);
            // Neues, langsameres Intervall starten
            this.spawnIntervalId = setInterval(() => {
                this.spawnChicken();
            }, this.normalSpawnInterval);
        }, 5000);
    }
    
    spawnChicken() {
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
        
        // Entferne Hühner, die zu weit links sind
        this.level.enemies = this.level.enemies.filter(enemy => {
            return !(enemy instanceof Chicken || enemy instanceof TinyChicken) || enemy.x > -100;
        });
    }
    
    /**
     * Initialisiert das zufällige Spawnen von Hühnern
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
            
            // Entferne Hühner, die zu weit links sind
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
     * Prüft ob der Character von oben auf einen Gegner springt
     * @param {MovableObject} enemy - Der Gegner
     * @returns {boolean} true wenn der Character von oben auf den Gegner springt
     */
    isJumpingOnEnemy(enemy) {
        return this.character.isAboveGround() &&
            this.character.speedY < 0 &&
            this.character.y + this.character.height > enemy.y &&
            this.character.x + this.character.width > enemy.x &&
            this.character.x < enemy.x + enemy.width;
    }
    
    /**
     * Function which is checking collision between character and enemies or bottle with enemies
     */
    checkCollisions() {
        // Kollision mit Gegnern prüfen
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                if (enemy instanceof Chicken || enemy instanceof TinyChicken) {
                    if (this.isJumpingOnEnemy(enemy)) {
                        // Character springt auf das Chicken
                        enemy.playDeathAnimation();
                        this.character.speedY = 15; // Kleiner Aufsprung
                        this.character.chickenDeath_sound.play();
                    } else if (!enemy.isDying) {
                        // Normale Kollision nur wenn das Chicken noch nicht stirbt
                        this.character.hit();
                    }
                } else {
                    // Kollision mit anderen Gegnern (z.B. Endboss)
                    this.character.hit();
                }
            }
        });
        
        // Kollision zwischen Gegner und Flasche überprüfen
        this.throwableObjects.forEach((thrownBottle) => {
            this.level.enemies.forEach(enemy => {
                if (thrownBottle.isColliding(enemy) && !thrownBottle.hasHitObstacle) {
                    thrownBottle.hasHitObstacle = true;
                    
                    if (enemy instanceof Chicken || enemy instanceof TinyChicken) {
                        // Normale und kleine Hühner sterben sofort
                        enemy.playDeathAnimation();
                        this.character.chickenDeath_sound.play();
                    } else if (enemy instanceof Endboss) {
                        // Endboss nimmt Schaden
                        enemy.hit(); // Der Sound wird jetzt in der hit() Methode des Endbosses abgespielt
                        this.statusBarEndboss.setPercentageEndboss(enemy.endbossEnergy);
                    }
                    
                    thrownBottle.playSplashAnimation();
                }
            });
            
            if (thrownBottle.y > 450) {
                this.throwableObjects.splice(thrownBottle);
            }
        });
        
        // Kollision mit Münzen überprüfen
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                if (this.character.coinAmount < this.character.maxCoinAmount) {
                    this.character.coin_sound.play();
                    this.character.coinAmount++;
                    // Berechne den Prozentwert basierend auf 5 maximalen Münzen
                    let percentage = (this.character.coinAmount / this.character.maxCoinAmount) * 100;
                    this.statusBarCoin.setPercentageCoin(percentage);
                    this.level.coins.splice(index, 1);
                    
                    // Prüfen ob Heilung möglich ist
                    this.character.healWithCoins();
                }
            }
        });
        
        // Kollision mit Flaschen überprüfen
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                if (this.character.bottleAmount < this.character.maxBottleAmount) {
                    this.character.bottle_sound.play();
                    this.character.bottleAmount++;
                    // Berechne den Prozentwert basierend auf 5 maximalen Flaschen
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
        // ------ Space for absolute fixed objects (e.g. health-bar) ------//
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarBottle);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarEndboss);
        this.ctx.translate(this.camera_x, 0);
        
        // ------ Space for fixed objects in Canvas ------//
        this.addObjectsToMap(this.level.bottles); // Flaschen zuerst zeichnen
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.level.coins);
        
        this.ctx.translate(-this.camera_x, 0);
        
        // Draw wird immer wieder aufgerufen
        let self = this;
        this.animationFrame = requestAnimationFrame(function () {
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