let canvas;
let world;
let keyboard = new Keyboard();
let bottleDirection = true;
let gameStarted = false;

function init() {
    canvas = document.getElementById("canvas");
    
    // Orientierung initial prüfen
    checkOrientation();
    
    // Event-Listener für Orientierungsänderungen
    window.addEventListener('orientationchange', checkOrientation);
    window.addEventListener('resize', checkOrientation);
    
    // Media Query Listener
    const mediaQuery = window.matchMedia("(orientation: landscape)");
    mediaQuery.addListener(checkOrientation);
    
    
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
    
    // Canvas-Steuerung ausblenden auf mobilen Geräten
    if (window.matchMedia("(max-width: 1000px)").matches) {
        document.querySelector('.canvas-controls').style.display = 'none';
    }
    
    // Neues Level und Welt erstellen
    level1 = initLevel1();
    world = new World(canvas, keyboard);
    
    gameStarted = true;
    
    // Mobile Touch Buttons hier initialisieren
    mobileTouchButtons();
    
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
    
    // Mobile Steuerung ausblenden und Canvas-Steuerung einblenden
    document.getElementById('mobileControls').style.display = 'none';
    document.querySelector('.canvas-controls').style.display = 'flex';
    
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
    
    // Touch-Buttons neu initialisieren
    mobileTouchButtons();
    
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

function mobileTouchButtons() {
    // Zuerst mobile Controls anzeigen
    const mobileControls = document.getElementById('mobileControls');
    if (mobileControls) {
        mobileControls.style.display = 'flex'; // oder 'block', je nach gewünschtem Layout
    }

    // Event Listener mit korrekten IDs
    document.getElementById('walkLeft').addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.LEFT = true; // Anpassung an deine Keyboard-Klasse
    });

    document.getElementById('walkLeft').addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.LEFT = false;
    });

    document.getElementById('walkRight').addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.RIGHT = true;
    });

    document.getElementById('walkRight').addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.RIGHT = false;
    });

    document.getElementById('jumpIcon').addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.SPACE = true;
    });

    document.getElementById('jumpIcon').addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.SPACE = false;
    });

    document.getElementById('throwBottleIcon').addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.D = true;
    });

    document.getElementById('throwBottleIcon').addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.D = false;
    });
}

document.addEventListener('keydown', evt => {
    if (evt.key === 'Escape') {
        toggleFullscreen();
    }
    
    else if (evt.key === 's') {
        startGame();
    }
})