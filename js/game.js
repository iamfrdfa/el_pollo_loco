let canvas;
let world;
let keyboard = new Keyboard();
let bottleDirection = true;
let gameStarted = false;

function init() {
    canvas = document.getElementById("canvas");
    
    // Start-Button Event Listener hinzufügen
    document.getElementById('startButton').addEventListener('click', startGame);
    
    // Diese Zeile entfernen oder ändern zu:
    // document.getElementById('reload').addEventListener('click', restartGame);
    
    // Audio-Zustand initialisieren
    initAudioControl();
}

function startGame() {
    // Startbildschirm ausblenden
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('canvas').style.display = 'block';
    
    // Neues Level und Welt erstellen
    level1 = initLevel1(); // Funktion aus level1.js
    world = new World(canvas, keyboard);
    
    gameStarted = true;
    
    // Audio-Einstellungen beibehalten
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
    // Canvas ausblenden und alle Game Over Elemente zurücksetzen
    document.getElementById('canvas').style.display = 'none';
    document.getElementById('lost').style.display = 'none';
    document.getElementById('win').style.display = 'none';
    document.getElementById('restartButton').style.display = 'none';
    
    // Wichtig: startScreen wieder sichtbar machen
    document.getElementById('startScreen').style.display = 'block';
    document.getElementById('startImage').style.display = 'block';
    document.getElementById('startButton').style.display = 'block';
    
    // Spiel-Instanz aufräumen
    cleanupGameInstance();
    
    // Spielzustand zurücksetzen
    gameStarted = false;
    
    // Tastatur-Events zurücksetzen
    keyboard = new Keyboard();
    bottleDirection = true;
    
    // Audio-Einstellungen beibehalten
    if (gameIsMuted) {
        muteSounds();
    }
}


function cleanupGameInstance() {
    if (world) {
        // Animation Frame stoppen
        if (world.animationFrame) {
            cancelAnimationFrame(world.animationFrame);
        }
        
        // Alle Intervalle stoppen
        for (let i = 1; i < 9999; i++) {
            window.clearInterval(i);
        }
        
        // Alle Sounds stoppen
        if (world.character) {
            world.stopCharacterSounds();
        }
        
        // Canvas leeren
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // World-Referenz löschen
        world = null;
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