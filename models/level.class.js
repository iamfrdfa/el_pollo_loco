/**
 * Represents a game level containing all game objects and their positions.
 * Manages enemies, clouds, collectibles and background elements.
 *
 * @class
 */
class Level {
    /**
     * Array of enemy objects in the level.
     * @type {Array<MovableObject>}
     */
    enemies;
    
    /**
     * Array of cloud objects for background animation.
     * @type {Array<Cloud>}
     */
    clouds;
    
    /**
     * Array of background objects that make up the level scenery.
     * @type {Array<BackgroundObject>}
     */
    backgroundObjects;
    
    /**
     * Array of collectible bottle objects in the level.
     * @type {Array<Bottle>}
     */
    bottles;
    
    /**
     * Array of collectible coin objects in the level.
     * @type {Array<Coin>}
     */
    coins;
    
    /**
     * X-coordinate where the level ends.
     * @type {number}
     */
    level_end_x = 2200;
    
    /**
     * Creates a new level with the specified game objects.
     *
     * @constructor
     * @param {Array<MovableObject>} enemies - Array of enemy objects
     * @param {Array<Cloud>} clouds - Array of cloud objects
     * @param {Array<Bottle>} bottles - Array of collectible bottles
     * @param {Array<Coin>} coins - Array of collectible coins
     * @param {Array<BackgroundObject>} backgroundObjects - Array of background objects
     */
    constructor(enemies, clouds, bottles, coins, backgroundObjects) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.bottles = bottles;
        this.coins = coins;
        this.backgroundObjects = backgroundObjects;
    }
}