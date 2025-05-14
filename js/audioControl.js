/**
 * Globale Variable, die den Stummschaltungsstatus des Spiels speichert.
 * @type {boolean}
 */
let gameIsMuted = false;

/**
 * Schaltet das gesamte Spiel stumm.
 * Setzt das Flag, ruft das Stummschalten aller Sounds auf,
 * speichert den Status im LocalStorage und aktualisiert die Benutzeroberfläche.
 * @function
 */
function muteGame() {
    gameIsMuted = true;
    muteSounds();
    
    localStorage.setItem('gameIsMuted', JSON.stringify(gameIsMuted));
    updateMuteUI();
}

/**
 * Hebt die Stummschaltung des Spiels auf.
 * Setzt das Flag zurück, ruft das Einschalten aller Sounds auf,
 * speichert den Status im LocalStorage und aktualisiert die Benutzeroberfläche.
 * @function
 */
function unmuteGame() {
    gameIsMuted = false;
    unmuteSounds();
    localStorage.setItem('gameIsMuted', JSON.stringify(gameIsMuted));
    updateMuteUI();
}

/**
 * Initialisiert die Audio-Verwaltung beim Laden der Seite.
 * Stellt anhand des gespeicherten Stummschaltungsstatus die UI entsprechend ein.
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
 * Aktualisiert die Mute/Unmute-Benutzeroberfläche anhand des aktuellen Stummschaltungsstatus.
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
 * Event-Listener, der die Audio-Verwaltung nach dem Laden der Seite initialisiert.
 * @event DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', initAudioControl);

/**
 * Schaltet alle relevanten Sounds des Characters stumm.
 * Diese Funktion wird intern von {@link muteGame} aufgerufen.
 * @function
 */
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

/**
 * Schaltet alle relevanten Sounds des Characters wieder an.
 * Diese Funktion wird intern von {@link unmuteGame} aufgerufen.
 * @function
 */
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

/**
 * Sollte bei der Erstellung neuer Audio-Objekte aufgerufen werden,
 * um zu prüfen, ob das Audio-Objekt bei globaler Stummschaltung auch stumm ist.
 * @function
 * @param {HTMLAudioElement} audio - Das zu prüfende Audio-Objekt
 */
function checkAudioMute(audio) {
    if (gameIsMuted) {
        audio.muted = true;
    }
}

/**
 * Überschreibt die play-Methode des Audio-Prototyps, sodass bei Stummschaltung kein Ton abgespielt wird.
 * @function
 */
const originalPlay = Audio.prototype.play;
/**
 * Spielt ein Audioelement nur ab, wenn das Spiel nicht stumm geschaltet ist.
 * Gibt ansonsten ein Promise ohne Abspielen zurück (entkoppelt für die Play-Promise-API).
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