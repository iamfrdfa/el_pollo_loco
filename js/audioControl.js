let gameIsMuted = false;

function muteGame() {
    gameIsMuted = true;
    muteSounds();
    
    localStorage.setItem('gameIsMuted', JSON.stringify(gameIsMuted));
    updateMuteUI();
}

function unmuteGame() {
    gameIsMuted = false;
    unmuteSounds();
    localStorage.setItem('gameIsMuted', JSON.stringify(gameIsMuted));
    updateMuteUI();
}

// Beim Laden der Seite den gespeicherten Zustand abrufen
function initAudioControl() {
    const savedMuteState = localStorage.getItem('gameIsMuted');
    if (savedMuteState !== null) {
        gameIsMuted = JSON.parse(savedMuteState);
        updateMuteUI();
    }
}

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

// Initialisierung beim Laden der Seite
document.addEventListener('DOMContentLoaded', initAudioControl);


function muteSounds() {
    if (typeof world !== 'undefined' && world && world.character) {
        const sounds = [
            world.character.walking_sound,
            world.character.hurt_sound,
            world.character.game_over,
            world.character.bottle_sound,
            world.character.coin_sound,
            world.character.chickenDeath_sound,
            world.character.weaponFail_sound,
            world.character.snoring_sound
        ];
        
        sounds.forEach(sound => {
            if (sound) {
                sound.muted = true;
            }
        });
    }
}

function unmuteSounds() {
    if (typeof world !== 'undefined' && world && world.character) {
        const sounds = [
            world.character.walking_sound,
            world.character.snoring_sound,
            world.character.hurt_sound,
            world.character.game_over,
            world.character.bottle_sound,
            world.character.coin_sound,
            world.character.chickenDeath_sound,
            world.character.weaponFail_sound
        ];
        
        sounds.forEach(sound => {
            if (sound) {
                sound.muted = false;
            }
        });
    }
}

// Diese Funktion sollte bei der Erstellung neuer Audio-Objekte aufgerufen werden
function checkAudioMute(audio) {
    if (gameIsMuted) {
        audio.muted = true;
    }
}

const originalPlay = Audio.prototype.play;
Audio.prototype.play = function() {
    if (!gameIsMuted) {
        return originalPlay.apply(this);
    }
    return new Promise((resolve) => {
        resolve();
    });
};