let canvas;
let world;
let keyboard = new Keyboard();
let bottleDirection = true;
let gameStarted = false;

function init() {
    canvas = document.getElementById("canvas");
    
    // Start-Button Event Listener hinzufügen
    document.getElementById('startButton').addEventListener('click', startGame);
    
    // Reload-Button Event Listener hinzufügen
    document.getElementById('reload').addEventListener('click', startGame);
    
    // Audio-Zustand initialisieren
    initAudioControl();
}

function startGame() {
    // Startscreen ausblenden
    document.getElementById('startScreen').style.display = 'none';
    
    // Spiel initialisieren
    world = new World(canvas, keyboard);
    gameStarted = true;
    
    // Chicken-Spawning starten
    world.startChickenSpawning();
    
    // Falls das Spiel bereits stumm geschaltet war
    if (gameIsMuted) {
        muteSounds();
    }
}


function stopGame() {
    // Spiel anhalten
    gameStarted = false;
    
    // Alle Intervalle stoppen
    for (let i = 1; i < 9999; i++) {
        window.clearInterval(i);
    }
    
    // Animation Frame stoppen
    if (world && world.animationFrame) {
        cancelAnimationFrame(world.animationFrame);
    }
    
    // Startscreen einblenden (enthält die anderen Elemente)
    document.getElementById('startScreen').style.display = 'flex';
    
    // Start-Button ausblenden
    document.getElementById('startButton').style.display = 'none';
    // Start-Bild ausblenden
    document.getElementById('startImage').style.display = 'none';
    
    // Game Over Screens verwalten
    if (world.character.isDead()) {
        // Verloren-Bildschirm anzeigen
        document.getElementById('lost').style.display = 'block';
        document.getElementById('win').style.display = 'none';
    } else {
        // Gewonnen-Bildschirm anzeigen
        document.getElementById('win').style.display = 'block';
        document.getElementById('lost').style.display = 'none';
    }
    
    // Restart Button einblenden
    /*document.getElementById('restartButton').style.display = 'block';*/
}

function restartGame() {
    // Game Over Screens ausblenden
    document.getElementById('lost').style.display = 'none';
    document.getElementById('win').style.display = 'none';
    document.getElementById('restartButton').style.display = 'none';
    
    // Start-Bild und Button wieder einblenden
    document.getElementById('startImage').style.display = 'block';
    document.getElementById('startButton').style.display = 'block';
    
    // Aufräumen der alten Intervalle und Event-Listener
    if (world) {
        // Alle laufenden Intervalle stoppen
        for (let i = 1; i < 9999; i++) {
            window.clearInterval(i);
        }
        
        // Animation Frame stoppen
        if (world.animationFrame) {
            cancelAnimationFrame(world.animationFrame);
        }
        
        // Alle Arrays leeren
        if (world.level) {
            world.level.enemies = [];
            world.level.clouds = [];
            world.level.bottles = [];
            world.level.coins = [];
            world.throwableObjects = [];
        }
    }
    
    // Level komplett neu initialisieren
    level1 = new Level(
        [
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new TinyChicken(),
            new TinyChicken(),
            new Endboss()
        ],
        [
            new Cloud()
        ],
        [
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle(),
        ],
        [
            new Coins(),
            new Coins(),
            new Coins(),
            new Coins(),
            new Coins(),
            new Coins(),
            new Coins(),
            new Coins(),
            new Coins(),
            new Coins(),
        ],
[
            // Hier deine ursprünglichen Background Objects einfügen
            new BackgroundObject('img/5_background/layers/air.png', -719),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719),
            
            new BackgroundObject('img/5_background/layers/air.png', 0),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),
            
            new BackgroundObject('img/5_background/layers/air.png', 719),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719),
            
            new BackgroundObject('img/5_background/layers/air.png', 719 * 2),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719 * 2),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719 * 2),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719 * 2),
            
            new BackgroundObject('img/5_background/layers/air.png', 719 * 3),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719 * 3),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719 * 3),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719 * 3)
        ]
    );
    
    // Keyboard-Zustand zurücksetzen
    keyboard = new Keyboard();
    bottleDirection = true;
    
    // Canvas leeren
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Neue Welt mit neuem Level erstellen
    world = new World(canvas, keyboard);
    
    // Alle Statusbars zurücksetzen
    world.statusBar.setPercentage(100);
    world.statusBarBottle.setPercentageBottle(0);
    world.statusBarCoin.setPercentageCoin(0);
    world.statusBarEndboss.setPercentageEndboss(100);
    
    // Character zurücksetzen
    world.character.x = 100;
    world.character.y = 230;
    world.character.energy = 100;
    world.character.coinAmount = 0;
    world.character.bottleAmount = 0;
    
    gameStarted = true;
    
    // Audio-Einstellungen beibehalten
    if (gameIsMuted) {
        muteSounds();
    }
}


// Die Keyboard-Events nur aktivieren, wenn das Spiel gestartet wurde
window.addEventListener("keydown", (e) => {
    if (!gameStarted) return; // Ignore keyboard input if game hasn't started
    
    if (e.keyCode === 32) {
        keyboard.SPACE = true;
    }
    if (e.keyCode === 37) {
        keyboard.LEFT = true;
        bottleDirection = false;
    }
    if (e.keyCode === 38) {
        keyboard.UP = true;
    }
    if (e.keyCode === 39) {
        keyboard.RIGHT = true;
        bottleDirection = true;
    }
    if (e.keyCode === 40) {
        keyboard.DOWN = true;
    }
    if (e.keyCode === 68 && !keyboard.D_pressed) { // D-Taste
        keyboard.D = true;
        keyboard.D_pressed = true; // Markiere die Taste als gedrückt
    }
});

window.addEventListener("keyup", (e) => {
    if (!gameStarted) return; // Ignore keyboard input if game hasn't started
    
    if (e.keyCode === 32) {
        keyboard.SPACE = false;
    }
    if (e.keyCode === 37) {
        keyboard.LEFT = false;
    }
    if (e.keyCode === 38) {
        keyboard.UP = false;
    }
    if (e.keyCode === 39) {
        keyboard.RIGHT = false;
    }
    if (e.keyCode === 40) {
        keyboard.DOWN = false;
    }
    if (e.keyCode === 68) { // D-Taste
        keyboard.D = false;
        keyboard.D_pressed = false; // Setze den Status zurück
    }
});

document.addEventListener('keydown', evt => {
    if (evt.key === 'Escape') {
        toggleFullscreen();
    }
    
    else if (evt.key === 's') {
        startGame();
    }
})