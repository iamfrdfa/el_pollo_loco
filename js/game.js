/**
 * Das HTML-Canvas-Element für das Spiel.
 * @type {HTMLCanvasElement}
 */
let canvas;

/**
 * Instanz der jeweiligen Spielwelt.
 * @type {World}
 */
let world;

/**
 * Instanz zur Speicherung des aktuellen Tastatur-Status.
 * @type {Keyboard}
 */
let keyboard = new Keyboard();

/**
 * Richtung des Flaschenwurfs (true = rechts, false = links).
 * @type {boolean}
 */
let bottleDirection = true;

/**
 * Gibt an, ob das Spiel gestartet wurde.
 * @type {boolean}
 */
let gameStarted = false;

/**
 * Initialisiert das Spiel, Canvas und UI- & Event-Listener.
 * Ruft auch Audio-Initialisierung auf.
 * @function
 */
function init() {
    canvas = document.getElementById("canvas");
    checkOrientation();
    window.addEventListener('orientationchange', checkOrientation);
    window.addEventListener('resize', checkOrientation);
    const mediaQuery = window.matchMedia("(orientation: landscape)");
    mediaQuery.addListener(checkOrientation);
    
    // Audio-Zustand initialisieren
    initAudioControl();
}

/**
 * Startet das Spiel, blendet den Startbildschirm aus und zeigt das Spiel-Cavas an.
 * Initialisiert einen Level und die Welt, sowie mobile Steuerungen.
 * Stellt Audioeinstellungen entsprechend des globalen Status wieder her.
 * @function
 */
function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('canvas').style.display = 'block';
    
    // Canvas-Steuerung auf mobilen Geräten ausblenden
    if (window.matchMedia("(max-width: 1000px)").matches) {
        document.querySelector('.canvas-controls').style.display = 'none';
    }
    
    // Neues Level und Welt erstellen
    level1 = initLevel1();
    world = new World(canvas, keyboard);
    
    gameStarted = true;
    
    // Mobile Touch-Buttons initialisieren
    mobileTouchButtons();
    
    // Audioeinstellungen anwenden
    if (gameIsMuted) {
        muteSounds();
    }
}

/**
 * Stoppt das Spiel, zeigt Auswertungsbildschirme (verloren/gewonnen),
 * setzt Interface-Elemente zurück und hält sämtliche Intervalle und Animationen an.
 * @function
 */
function stopGame() {
    gameStarted = false;
    for (let i = 1; i < 9999; i++) {
        window.clearInterval(i);
    }
    if (world && world.animationFrame) {
        cancelAnimationFrame(world.animationFrame);
    }
    
    document.getElementById('mobileControls').style.display = 'none';
    document.querySelector('.canvas-controls').style.display = 'flex';
    document.getElementById('startScreen').style.display = 'flex';
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('startImage').style.display = 'none';
    
    if (world.character.isDead()) {
        document.getElementById('lost').style.display = 'block';
        document.getElementById('win').style.display = 'none';
    } else {
        document.getElementById('win').style.display = 'block';
        document.getElementById('lost').style.display = 'none';
    }
}

/**
 * Setzt das Spiel komplett zurück, inklusive Canvas, Benutzeroberfläche, Instanzen und Zuständen.
 * @function
 */
function restartGame() {
    document.getElementById('canvas').style.display = 'none';
    document.getElementById('lost').style.display = 'none';
    document.getElementById('win').style.display = 'none';
    document.getElementById('restartButton').style.display = 'none';
    
    document.getElementById('startScreen').style.display = 'block';
    document.getElementById('startImage').style.display = 'block';
    document.getElementById('startButton').style.display = 'block';
    
    cleanupGameInstance();
    
    gameStarted = false;
    keyboard = new Keyboard();
    bottleDirection = true;
    
    mobileTouchButtons();
    
    // Audioeinstellungen anwenden
    if (gameIsMuted) {
        muteSounds();
    }
}

/**
 * Räumt die aktuelle Spielinstanz auf, stoppt Animation, Intervalle und Sounds.
 * Leert das Canvas.
 * @function
 */
function cleanupGameInstance() {
    if (world) {
        if (world.animationFrame) {
            cancelAnimationFrame(world.animationFrame);
        }
        for (let i = 1; i < 9999; i++) {
            window.clearInterval(i);
        }
        if (world.character) {
            world.stopCharacterSounds();
        }
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        world = null;
    }
}

/**
 * Aktiviert Keyboard-Events nur, wenn das Spiel gestartet ist.
 * Setzt entsprechende Statusflags im Keyboard-Objekt.
 * @event keydown
 * @param {KeyboardEvent} e
 */
window.addEventListener("keydown", (e) => {
    if (!gameStarted) return;
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
    if (e.keyCode === 68 && !keyboard.D_pressed) {
        keyboard.D = true;
        keyboard.D_pressed = true;
    }
});

/**
 * Deaktiviert Keyboard-Status bei Loslassen der Taste, nur wenn Spiel läuft.
 * @event keyup
 * @param {KeyboardEvent} e
 */
window.addEventListener("keyup", (e) => {
    if (!gameStarted) return;
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
    if (e.keyCode === 68) {
        keyboard.D = false;
        keyboard.D_pressed = false;
    }
});

/**
 * Initialisiert Event-Listener für mobile Touch-Buttons und setzt ihr Verhalten.
 * Blendet mobile Controls sichtbar ein.
 * @function
 */
function mobileTouchButtons() {
    const mobileControls = document.getElementById('mobileControls');
    if (mobileControls) {
        mobileControls.style.display = 'flex';
    }
    
    document.getElementById('walkLeft').addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.LEFT = true;
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

/**
 * Tastatur Shortcuts zum Fullscreen und Spielstart, unabhängig vom restlichen Spielstatus.
 * @event keydown
 * @param {KeyboardEvent} evt
 */
document.addEventListener('keydown', evt => {
    if (evt.key === 'Escape') {
        toggleFullscreen();
    } else if (evt.key === 's') {
        startGame();
    }
});