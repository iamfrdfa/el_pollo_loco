let gameIsMuted = false;

function muteGame() {
    gameIsMuted = true;
    muteSounds();
    
    // Icons wechseln
    document.getElementById('mute').style.display = 'none';
    document.getElementById('unmute').style.display = 'block';
}

function unmuteGame() {
    gameIsMuted = false;
    unmuteSounds();
    
    // Icons wechseln
    document.getElementById('mute').style.display = 'block';
    document.getElementById('unmute').style.display = 'none';
}

function muteSounds() {
    if (typeof world !== 'undefined' && world && world.character) {
        const sounds = [
            world.character.walking_sound,
            world.character.jumping_sound,
            world.character.hurt_sound,
            world.character.dead_sound,
            world.character.bottle_sound,
            world.character.coin_sound,
            world.character.chickenDeath_sound,
            world.character.weaponFail_sound
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
            world.character.jumping_sound,
            world.character.hurt_sound,
            world.character.dead_sound,
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

// Alternative Methode: Überschreibe die Audio.prototype.play Methode
const originalPlay = Audio.prototype.play;
Audio.prototype.play = function() {
    if (!gameIsMuted) {
        return originalPlay.apply(this);
    }
    return new Promise((resolve) => {
        resolve();
    });
};