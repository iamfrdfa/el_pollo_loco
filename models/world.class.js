/**
 * Die zentrale Klasse für die Spiellogik und Verwaltung der Spielwelt.
 * Sie ist für das Rendering, die Spielfiguren, Gegner und Events zuständig und steuert
 * das gesamte Geschehen im Hauptspielablauf.
 */
class World {
    /**
     * Die Spielfigur.
     * @type {Character}
     */
    character = new Character();
    
    /**
     * Das aktuelle Level.
     * @type {Object}
     */
    level = level1;
    
    /**
     * Das Canvas-Element zur Darstellung des Spiels.
     * @type {HTMLCanvasElement}
     */
    canvas;
    
    /**
     * Canvas-Kontext (2D) für Zeichnungen.
     * @type {CanvasRenderingContext2D}
     */
    ctx;
    
    /**
     * Referenz auf das Tastatur-Objekt für Input-Handling.
     * @type {Keyboard}
     */
    keyboard;
    
    /**
     * Horizontale Kamera-Position.
     * @type {number}
     */
    camera_x = 0;
    
    /**
     * Statusleiste für Lebensenergie.
     * @type {StatusBarHealth}
     */
    statusBar = new StatusBarHealth();
    
    /**
     * Statusleiste für Flaschen.
     * @type {statusBarBottle}
     */
    statusBarBottle = new statusBarBottle();
    
    /**
     * Statusleiste für Münzen.
     * @type {statusBarCoin}
     */
    statusBarCoin = new statusBarCoin();
    
    /**
     * Statusleiste für den Endboss.
     * @type {statusBarEndboss}
     */
    statusBarEndboss = new statusBarEndboss();
    
    /**
     * Enthält geworfene Flaschen-Objekte.
     * @type {ThrowableObject[]}
     */
    throwableObjects = [];
    
    /**
     * Startanzahl Flaschen-Treffer.
     * @type {number}
     */
    bottleHit = 20;
    
    /**
     * Flag, ob ein Gegner getroffen wurde.
     * @type {boolean}
     */
    enemyIsHitted = false;
    
    /**
     * Flag, ob gerade eine Flasche geworfen wurde.
     * @type {boolean}
     */
    bottleThrow = false;
    
    /**
     * Mindestabstand zwischen Hühner-Spawns zu Beginn.
     * @type {number}
     */
    initialSpawnDistance = 300;
    
    /**
     * Mindestabstand zwischen Hühnern regulär.
     * @type {number}
     */
    normalSpawnDistance = 150;
    
    /**
     * Schnelles Spawning-Intervall in ms.
     * @type {number}
     */
    fastSpawnInterval = 500;
    
    /**
     * Normales Spawning-Intervall in ms.
     * @type {number}
     */
    normalSpawnInterval = 2000;
    
    /**
     * Interval-ID des Spawn-Timers.
     * @type {?number}
     */
    spawnIntervalId = null;
    
    /**
     * Flag, ob das Spiel gerade erst gestartet wurde.
     * @type {boolean}
     */
    isGameStart = true;
    
    /**
     * Konstruktor für die World.
     * Initialisiert Canvas, Tastatur und startet das Spiel.
     *
     * @param {HTMLCanvasElement} canvas - Das Spielfeld.
     * @param {Keyboard} keyboard - Die Inputsteuerung.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
        
        // Nach 5 Sekunden auf normales Spawnen umschalten
        setTimeout(() => {
            this.isGameStart = false;
        }, 5000);
    }
    
    /**
     * Verknüpft die Welt mit Charakter und Gegnern.
     */
    setWorld() {
        this.character.world = this;
        // Setze die World-Referenz für alle Gegner
        this.level.enemies.forEach(enemy => {
            enemy.world = this;
        });
    }
    
    /**
     * Startet die Überprüfungsspiele (Kollisionen, Spielende, Flaschenwurf).
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
     * Prüft das Spielende: Entweder Character tot oder Endboss besiegt.
     */
    checkGameEnd() {
        if (this.character.isDead() || (this.level.enemies.find(e => e instanceof Endboss)?.isDead())) {
            this.clearGameObjects();
            setTimeout(() => {
                stopGame();
            }, 1000); // 1 Sekunde Verzögerung
            return;
        }
    }
    
    /**
     * Entfernt alle aktiven Objekte (Figur, Gegner, Flaschen, Münzen).
     */
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
    
    /**
     * Stoppt alle Character-bezogenen Audioquellen.
     */
    stopCharacterSounds() {
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
    
    /**
     * Stoppt Sounds des Endbosses.
     * @param {Object} endboss - Das Endboss-Objekt.
     */
    stopEndbossSounds(endboss) {
        if (endboss.hurt_sound) endboss.hurt_sound.pause();
        if (endboss.endboss_hit) endboss.endboss_hit.pause();
    }
    
    /**
     * Prüft das Werfen eines Objekts durch die Spielfigur.
     * Reduziert Flaschenanzahl oder spielt gescheiterten Wurf ab.
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
     * Startet das Spawning-System für Hühner (Gegner).
     */
    startChickenSpawning() {
        this.spawnEnabled = true;
        this.isGameStart = true;
        
        // Schnelles Spawnen
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
     * Fügt ein Chicken oder TinyChicken dem Level hinzu, falls möglich.
     */
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
        
        // Entfernt Hühner, die zu weit links sind
        this.level.enemies = this.level.enemies.filter(enemy => {
            return !(enemy instanceof Chicken || enemy instanceof TinyChicken) || enemy.x > -100;
        });
    }
    
    /**
     * Initialisiert das (langsamere) wiederholte Spawnen von Hühnern.
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
            
            // Entfernt Hühner, die zu weit links sind
            this.level.enemies = this.level.enemies.filter(enemy => {
                return !(enemy instanceof Chicken || enemy instanceof TinyChicken) || enemy.x > -100;
            });
        }, 2000);
    }
    
    /**
     * Prüft, ob eine gegebene Spawn-Position ausreichend Abstand zum Character hat.
     * @param {number} position - Die zu prüfende X-Position.
     * @returns {boolean} Ob die Position geeignet ist.
     */
    isValidSpawnPosition(position) {
        const minDistance = this.isGameStart ? this.initialSpawnDistance : this.normalSpawnDistance;
        const distanceToCharacter = Math.abs(position - this.character.x);
        return distanceToCharacter >= minDistance;
    }
    
    /**
     * Prüft, ob der Character von oben auf den Gegner springt.
     * @param {MovableObject} enemy - Der Gegner.
     * @returns {boolean} True, wenn von oben auf Gegner gesprungen wird.
     */
    isJumpingOnEnemy(enemy) {
        return this.character.isAboveGround() &&
            this.character.speedY < 0 &&
            this.character.y + this.character.height > enemy.y &&
            this.character.x + this.character.width > enemy.x &&
            this.character.x < enemy.x + enemy.width;
    }
    
    /**
     * Prüft und verarbeitet Kollisionen zwischen Spielfigur, Gegnern und Flaschen.
     * Auch genaue Logik für Sprung auf Gegner und deren Tod.
     */
    checkCollisions() {
        // ... Implementierung siehe Datei ...
    }
}