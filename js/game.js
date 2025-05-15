/**
 * The HTML canvas element for the game.
 * @type {HTMLCanvasElement}
 */
let canvas;

/**
 * Instance of the current game world.
 * @type {World}
 */
let world;

/**
 * Instance for storing the current keyboard status.
 * @type {Keyboard}
 */
let keyboard = new Keyboard();

/**
 * Direction of the bottle throw (true = right, false = left).
 * @type {boolean}
 */
let bottleDirection = true;

/**
 * Indicates whether the game has started.
 * @type {boolean}
 */
let gameStarted = false;

/**
 * Initializes the game, canvas, UI & event listeners.
 * Also calls audio initialization.
 * @function
 */
function init() {
    canvas = document.getElementById("canvas");
    checkOrientation();
    window.addEventListener('orientationchange', checkOrientation);
    window.addEventListener('resize', checkOrientation);
    const mediaQuery = window.matchMedia("(orientation: landscape)");
    mediaQuery.addListener(checkOrientation);
    
    // Initialize audio state
    initAudioControl();
}

/**
 * Starts the game, hides the start screen, and shows the game canvas.
 * Initializes a level and the world, as well as mobile controls.
 * Restores audio settings based on global status.
 * @function
 */
function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('canvas').style.display = 'block';
    
    if (world) {
        world.game_sound.play();
    }
    
    // Check screen orientation and height for canvas controls
    if (window.matchMedia("(orientation: landscape)").matches && window.innerHeight <= 650) {
        document.querySelector('.canvas-controls').style.display = 'none';
    }
    
    level1 = initLevel1();
    world = new World(canvas, keyboard);
    
    gameStarted = true;
    
    // Initialize mobile touch buttons
    mobileTouchButtons();
    
    // Show controls only after game start
    document.getElementById('mobileControls').classList.remove('hidden');
    showMobileControls();
    
    // Apply audio settings
    if (gameIsMuted) {
        muteSounds();
    }
    
    document.getElementById('mobileControls').classList.remove('hidden');
    
    showMobileControls();
}


/**
 * Stops the game, shows end screens (lost/won),
 * resets UI elements, and halts all intervals and animations.
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
    
    // Show Game Over or Win Screen
    if (world.character.isDead()) {
        document.getElementById('lost').style.display = 'block';
        document.getElementById('win').style.display = 'none';
    } else {
        document.getElementById('win').style.display = 'block';
        document.getElementById('lost').style.display = 'none';
    }
    
    // Show Restart button
    document.getElementById('restartButton').style.display = 'block';
    
    document.getElementById('mobileControls').classList.add('hidden');
}


function showMobileControls() {
    const mobileControls = document.getElementById('mobileControls');
    if (window.innerHeight <= 650 && window.matchMedia('(orientation: landscape)').matches && gameStarted) {
        mobileControls.classList.remove('hidden');
        mobileControls.style.display = 'flex';
    }
}

function hideMobileControls() {
    const mobileControls = document.getElementById('mobileControls');
    mobileControls.style.display = 'none';
}


/**
 * Fully resets the game, including canvas, UI, instances, and states.
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
    
    // Apply audio settings
    if (gameIsMuted) {
        muteSounds();
    }
}

/**
 * Cleans up the current game instance, stops animation, intervals, and sounds.
 * Clears the canvas.
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
 * Enables keyboard events only when the game is started.
 * Sets the corresponding status flags in the keyboard object.
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
 * Disables keyboard status when keys are released, only if game is running.
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
 * Initializes event listeners for mobile touch buttons and sets their behavior.
 * Shows mobile controls.
 * @function
 */
function mobileTouchButtons() {
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
 * Keyboard shortcuts for fullscreen and starting the game, regardless of game state.
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
