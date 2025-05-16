/**
 * Starts the chicken spawning system
 */
function startChickenSpawning() {
    this.spawnEnabled = true;
    this.isGameStart = true;
    
    this.spawnIntervalId = setInterval(() => {
        this.spawnChicken();
    }, this.fastSpawnInterval);
    
    setTimeout(() => {
        this.isGameStart = false;
        clearInterval(this.spawnIntervalId);
        this.spawnIntervalId = setInterval(() => {
            this.spawnChicken();
        }, this.normalSpawnInterval);
    }, 5000);
}

/**
 * Spawns a new Chicken or TinyChicken enemy if spawning is enabled and the enemy limit has not been reached.
 * The newly created chicken is assigned to the current world and only added if its spawn position is valid.
 * Also removes any Chicken or TinyChicken objects from the enemy list if they have moved out of the visible area (x <= -100).
 *
 * @method
 * @private
 */
function spawnChicken() {
    if (!this.spawnEnabled || this.level.enemies.length >= 15) return;
    
    let newChicken = Math.random() < 0.5 ? new Chicken() : new TinyChicken();
    newChicken.world = this;
    
    if (this.isValidSpawnPosition(newChicken.x)) {
        this.level.enemies.push(newChicken);
    }
    
    this.level.enemies = this.level.enemies.filter(enemy =>
        !(enemy instanceof Chicken || enemy instanceof TinyChicken) || enemy.x > -100
    );
}

/**
 * Initializes random chicken spawning
 */
function initChickenSpawning() {
    if (!this.spawnEnabled) return;
    
    setInterval(() => {
        if (!this.spawnEnabled || this.level.enemies.length >= 15) return;
        
        let newChicken = Math.random() < 0.5 ? new Chicken() : new TinyChicken();
        newChicken.world = this;
        
        if (this.isValidSpawnPosition(newChicken.x)) {
            this.level.enemies.push(newChicken);
        }
        
        this.level.enemies = this.level.enemies.filter(enemy =>
            !(enemy instanceof Chicken || enemy instanceof TinyChicken) || enemy.x > -100
        );
    }, 2000);
}

/**
 * Validates the spawn position of a chicken
 * @param position
 * @returns {boolean}
 */
function isValidSpawnPosition(position) {
    const minDistance = this.isGameStart ? this.initialSpawnDistance : this.normalSpawnDistance;
    const distanceToCharacter = Math.abs(position - this.character.x);
    return distanceToCharacter >= minDistance;
}

World.prototype.spawnChicken = spawnChicken;
World.prototype.isValidSpawnPosition = isValidSpawnPosition;
World.prototype.startChickenSpawning = startChickenSpawning;
World.prototype.initChickenSpawning = initChickenSpawning;
