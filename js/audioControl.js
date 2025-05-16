/**
 * Global variable that stores the mute status of the game.
 * @type {boolean}
 */
let gameIsMuted = false;

/**
 * Mutes the entire game.
 * Sets the flag, calls the mute function for all sounds,
 * saves the status in local storage, and updates the user interface.
 * @function
 */
function muteGame() {
    gameIsMuted = true;
    muteSounds();
    
    localStorage.setItem('gameIsMuted', JSON.stringify(gameIsMuted));
    updateMuteUI();
}

/**
 * Unmutes the game.
 * Resets the flag, calls the unmute function for all sounds,
 * saves the status in local storage, and updates the user interface.
 * @function
 */
function unmuteGame() {
    gameIsMuted = false;
    unmuteSounds();
    localStorage.setItem('gameIsMuted', JSON.stringify(gameIsMuted));
    updateMuteUI();
}

/**
 * Initializes the audio management when the page loads.
 * Sets the UI accordingly based on the saved mute status.
 * @function
 */
function initAudioControl() {
    const savedMuteState = localStorage.getItem('gameIsMuted');
    if (savedMuteState !== null) {
        gameIsMuted = JSON.parse(savedMuteState);
        updateMuteUI();
    }
}

/**
 * Updates the mute/unmute user interface based on the current mute status.
 * @function
 */
function updateMuteUI() {
    const muteButton = document.getElementById('mute');
    const unmuteButton = document.getElementById('unmute');
    
    if (gameIsMuted) {
        muteButton.style.display = 'none';
        unmuteButton.style.display = 'block';
    } else {
        muteButton.style.display = 'block';
        unmuteButton.style.display = 'none';
    }
}

/**
 * Event listener that initializes the audio management after the page loads.
 * @event DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', initAudioControl);

/**
 * Mutes all relevant sounds of the character.
 * This function is called internally by {@link muteGame}.
 * @function
 */
function muteSounds() {
    if (typeof world !== 'undefined' && world && world.character) {
        const sounds = [
            world.character.walking_sound, world.character.hurt_sound,
            world.character.game_over, world.character.bottle_sound,
            world.character.coin_sound, world.character.chickenDeath_sound,
            world.character.weaponFail_sound, world.character.snoring_sound, world.game_sound
        ];
        
        sounds.forEach(sound => {
            if (sound) {
                sound.muted = true;
            }
        });
    }
}

/**
 * Unmutes all relevant sounds of the character.
 * This function is called internally by {@link unmuteGame}.
 * @function
 */
function unmuteSounds() {
    if (typeof world !== 'undefined' && world && world.character) {
        const sounds = [
            world.character.walking_sound, world.character.hurt_sound,
            world.character.game_over, world.character.bottle_sound,
            world.character.coin_sound, world.character.chickenDeath_sound,
            world.character.weaponFail_sound, world.character.snoring_sound, world.game_sound
        ];
        
        sounds.forEach(sound => {
            if (sound) {
                sound.muted = false;
            }
        });
    }
}

/**
 * Should be called when creating new audio objects
 * to check if the audio object is also muted when the game is globally muted.
 * @function
 * @param {HTMLAudioElement} audio - The audio object to check
 */
function checkAudioMute(audio) {
    if (gameIsMuted) {
        audio.muted = true;
        if (world && world.game_sound) {
            world.game_sound.muted = true;
        }
    }
}

/**
 * Overwrites the play method of the audio prototype so that no sound is played when muted.
 * @function
 */
const originalPlay = Audio.prototype.play;
/**
 * Only plays an audio element if the game is not muted.
 * Otherwise, returns a Promise without playing (decoupled for the Play-Promise-API).
 * @name Audio#play
 * @function
 */
Audio.prototype.play = function() {
    if (!gameIsMuted) {
        return originalPlay.apply(this);
    }
    return new Promise((resolve) => {
        resolve();
    });
};