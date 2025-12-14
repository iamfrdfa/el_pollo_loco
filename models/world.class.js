/**
 * Represents the main game world, managing the state, entities, rendering context, and game logic.
 * Holds references to the player's character, level, canvas, status bars, and input controls.
 * Manages enemy spawning, throwable objects, and various game state flags.
 */

class World {
    /**
     * @property {Character} character - The main player character in the world.
     * @property {Object} level - The current game level.
     * @property {HTMLCanvasElement} canvas - The canvas element for rendering.
     * @property {CanvasRenderingContext2D} ctx - The drawing context for the canvas.
     * @property {Object} keyboard - The keyboard input manager.
     * @property {number} camera_x - The current horizontal camera offset.
     * @property {StatusBarHealth} statusBar - The health status bar instance.
     * @property {statusBarBottle} statusBarBottle - The bottle status bar instance.
     * @property {statusBarCoin} statusBarCoin - The coin status bar instance.
     * @property {statusBarEndboss} statusBarEndboss - The end boss status bar instance.
     * @property {Array} throwableObjects - List of throwable objects currently active in the world.
     * @property {boolean} enemyIsHitted - Indicates if an enemy was hit recently.
     * @property {boolean} bottleThrow - Flag to indicate if a bottle is currently being thrown.
     * @property {number} initialSpawnDistance - Distance for the first enemy/chicken spawn.
     * @property {number} normalSpawnDistance - Standard distance between enemy/chicken spawns.
     * @property {number} fastSpawnInterval - Fast interval (in ms) for spawning.
     * @property {number} normalSpawnInterval - Normal interval (in ms) for spawning.
     * @property {number|null} spawnIntervalId - The interval ID for enemy/chicken spawning timer.
     * @property {boolean} isGameStart - Indicates if the game is in the start phase.
     */
    
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
    
    /**
     * Initializes a new game world instance.
     * Sets up the canvas context, keyboard controls, and starts the main game loop.
     * Begins background sound playback with adjusted volume, initializes and enables chicken spawning,
     * and sets a timer for the game start phase.
     *
     * @constructor
     * @param {HTMLCanvasElement} canvas - The canvas element to render the game onto.
     * @param {Object} keyboard - The keyboard controller or input handler for player controls.
     */
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
        this.spawnEnabled = true;
        this.initChickenSpawning();
        
        setTimeout(() => {
            this.isGameStart = false;
        }, 5000);
    }
    
    /**
     * Sets the world reference for all game objects.
     *
     * @method
     * @private
     */
    setWorld() {
        this.character.world = this;
        
        this.level.enemies.forEach(enemy => {
            enemy.world = this;
        });
    }
    
    /**
     * Main game loop.
     * Checks for collisions, game end, and bottle throw.
     *
     */
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
    
    /**
     * Checks if the game should end and clears all game objects if so.
     *
     * @method
     * @private
     */
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
    
    /**
     * Clears all game objects from the world.
     *
     * @method
     * @private
     */
    clearGameObjects() {
        this.character.width = 0;
        this.character.height = 0;
        this.stopCharacterSounds();
        
        this.clearEnemyObjects();
        this.clearBottleObjects();
        this.clearCoinObjects();
        this.clearThrowableObjects();
        
        setTimeout(() => {
            this.level.enemies = [];
            this.level.bottles = [];
            this.level.coins = [];
            this.throwableObjects = [];
        }, 50);
    }
    
    /**
     * Clears all Enemy objects from the world.
     *
     * @method
     */
    clearEnemyObjects() {
        this.level.enemies.forEach(enemy => {
            enemy.width = 0;
            enemy.height = 0;
            if (enemy instanceof Endboss) {
                this.stopEndbossSounds(enemy);
            }
        });
    }
    
    /**
     * Clears all Bottle objects from the world.
     *
     * @method
     */
    clearBottleObjects() {
        this.level.bottles.forEach(bottle => {
            bottle.width = 0;
            bottle.height = 0;
        });
    }
    
    /**
     * Clears all coin objects from the world.
     *
     * @method
     */
    clearCoinObjects() {
        this.level.coins.forEach(coin => {
            coin.width = 0;
            coin.height = 0;
        });
    }
    
    /**
     * Clears all throwable objects (bottles) from the world.
     *
     * @method
     */
    clearThrowableObjects() {
        this.throwableObjects.forEach(obj => {
            obj.width = 0;
            obj.height = 0;
        });
    }
    
    /**
     * Stops all sounds for the character
     *
     * @method
     * @private
     */
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
    
    /**
     * Stops all sounds for the endboss
     *
     * @param endboss
     */
    stopEndbossSounds(endboss) {
        if (endboss.hurt_sound) endboss.hurt_sound.pause();
        if (endboss.endboss_hit) endboss.endboss_hit.pause();
    }
    
    /**
     * Checks if the character can throw a bottle and, if so, creates a new throwable object at the appropriate position.
     * Updates the character's bottle amount, status bar, and plays the corresponding sound effects.
     * Temporarily sets the bottle throw state to true.
     * If the throw key is pressed but there are no bottles left, plays a failure sound.
     *
     * @method
     * @private
     */
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
            
            this.bottleThrow = true;
            setTimeout(() => {
                this.bottleThrow = false;
            }, 500);
        } else if (this.keyboard.D && this.character.bottleAmount === 0) {
            this.character.weaponFail_sound.play();
        }
    }
    
    /**
     * Main collision detection method that handles all types of collisions in the game.
     * This includes character-enemy collisions, bottle throws, and collectible pickups.
     * @method
     */
    checkCollisions() {
        this.checkCollisionWithEnemies();
        this.checkCollisionBottleEnemy()
        this.checkCollisionWithBottle();
        this.checkCollisionWithCoins();
        this.checkCollisionWithEndboss();
    }
    
    /**
     * Renders the game world and all its objects on the canvas.
     * Handles camera movement, fixed UI elements, and dynamic game objects.
     * Uses requestAnimationFrame for smooth animation.
     * @method
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.ctx.translate(-this.camera_x, 0);
        
        this.spaceForAbsoluteFixedObjectsToDraw();
        this.spaceForFixedObjectsInCanvasToDraw();
        
        this.ctx.translate(-this.camera_x, 0);
        
        let self = this;
        this.animationFrame = requestAnimationFrame(function () {
            self.draw();
        });
    }
    
    /**
     * Renders all fixed UI elements that should stay in absolute position on screen.
     * This includes all status bars (health, bottles, coins, endboss).
     * Applies camera translation after rendering to maintain proper world coordinates.
     * @method
     * @private
     */
    spaceForAbsoluteFixedObjectsToDraw() {
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarBottle);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarEndboss);
        this.ctx.translate(this.camera_x, 0);
    }
    
    /**
     * Renders all game objects that move with the game world.
     * Objects are drawn in specific order to maintain proper layering:
     * bottles (background), character, clouds, enemies, throwable objects, and coins.
     * @method
     * @private
     */
    spaceForFixedObjectsInCanvasToDraw() {
        this.addObjectsToMap(this.level.bottles);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.level.coins);
    }
    
    /**
     * Helper method to add multiple objects to the game map.
     * @method
     * @param {Array<Object>} objects - Array of game objects to be rendered
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }
    
    /**
     * Adds a single object to the game map, handling direction-based rendering.
     * @method
     * @param {Object} mo - The movable object to be added to the map
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }
    
    /**
     * Flips an image horizontally for objects facing the opposite direction.
     * Saves the canvas state and applies appropriate transformations.
     * @method
     * @param {Object} mo - The movable object whose image needs to be flipped
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }
    
    /**
     * Restores the original state of a flipped image.
     * Reverts the x-coordinate and restores the canvas state.
     * @method
     * @param {Object} mo - The movable object whose image needs to be restored
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}
