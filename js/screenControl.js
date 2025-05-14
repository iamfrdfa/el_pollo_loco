/**
 * Ursprüngliche Breite des Canvas (in Pixel).
 * @type {number}
 */
const originalWidth = 720;

/**
 * Ursprüngliche Höhe des Canvas (in Pixel).
 * @type {number}
 */
const originalHeight = 480;

/**
 * Status, ob sich das Spiel aktuell im Fullscreen (Vollbildmodus) befindet.
 * @type {boolean}
 */
let isFullscreen = false;

/**
 * Schaltet zwischen Vollbild- und Standarddarstellung des Canvas und der UI um.
 * Passt Größen und Styles für das Canvas und Seitencontainer an.
 * Blendet relevante UI-Elemente ein/aus und deaktiviert bzw. aktiviert das Scrolling.
 * @function
 */
function toggleFullscreen() {
    const canvas = document.getElementById('canvas');
    const canvasContainer = document.querySelector('.canvas-container');
    const pageWrapper = document.getElementById('pageWrapper');
    
    if (!isFullscreen) {
        // Bildschirmmaße und neues Seitenverhältnis berechnen
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const aspectRatio = originalWidth / originalHeight;
        let newWidth, newHeight;
        
        if (screenWidth / screenHeight > aspectRatio) {
            newHeight = screenHeight * 0.9;
            newWidth = newHeight * aspectRatio;
        } else {
            newWidth = screenWidth * 0.9;
            newHeight = newWidth / aspectRatio;
        }
        
        // Styles für Vollbild setzen
        canvas.style.width = `${newWidth}px`;
        canvas.style.height = `${newHeight}px`;
        canvasContainer.style.width = `${newWidth}px`;
        canvasContainer.style.height = `${newHeight}px`;
        
        pageWrapper.style.position = 'fixed';
        pageWrapper.style.top = '0';
        pageWrapper.style.left = '0';
        pageWrapper.style.width = '100%';
        pageWrapper.style.height = '100%';
        pageWrapper.style.backgroundColor = 'black';
        pageWrapper.style.display = 'flex';
        pageWrapper.style.justifyContent = 'center';
        pageWrapper.style.alignItems = 'center';
        pageWrapper.style.zIndex = '1000';
        
        // UI-Elemente für Vollbild anpassen
        document.getElementById('fullscreen').style.display = 'none';
        document.getElementById('minimize').style.display = 'block';
        document.getElementById('headline').style.display = 'none';
        
        // Scrolling deaktivieren
        document.body.style.overflow = 'hidden';
        
        isFullscreen = true;
    } else {
        // Zurück zur Originalgröße & Styles
        canvas.style.width = originalWidth + 'px';
        canvas.style.height = originalHeight + 'px';
        canvasContainer.style.width = originalWidth + 'px';
        canvasContainer.style.height = originalHeight + 'px';
        
        pageWrapper.style.position = '';
        pageWrapper.style.top = '';
        pageWrapper.style.left = '';
        pageWrapper.style.width = '';
        pageWrapper.style.height = '';
        pageWrapper.style.backgroundColor = '';
        pageWrapper.style.display = '';
        pageWrapper.style.justifyContent = '';
        pageWrapper.style.alignItems = '';
        pageWrapper.style.zIndex = '';
        
        document.getElementById('fullscreen').style.display = 'block';
        document.getElementById('minimize').style.display = 'none';
        document.getElementById('headline').style.display = 'block';
        document.getElementById('explanationBar').style.display = 'none';
        
        document.body.style.overflow = '';
        
        isFullscreen = false;
    }
}

/**
 * Überprüft und steuert die Anzeige von Orientierungshinweisen für mobile Geräte.
 * Zeigt bei Hochformat und auf Mobilgeräten die Info-Leiste an.
 * Wird beim Laden, bei Änderung der Ausrichtung und beim Ändern der Fenstergröße verwendet.
 * @function
 */
function checkOrientation() {
    const orientationInfo = document.getElementById('orientationInfo');
    if (!orientationInfo) return;
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!isMobile) {
        orientationInfo.style.display = 'none';
        return;
    }
    
    const isLandscape = window.matchMedia("(orientation: landscape)").matches;
    if (isLandscape) {
        orientationInfo.style.display = 'none';
    } else {
        orientationInfo.style.display = 'flex';
    }
}

/**
 * Initiale Prüfung der Geräteorientierung beim Laden der Seite.
 * @event DOMContentLoaded
 */
checkOrientation();

/**
 * Event-Listener für Geräteorientierung, löst Prüf-Funktion bei Orientierungswechsel aus.
 * @event orientationchange
 */
window.addEventListener('orientationchange', checkOrientation);

/**
 * Event-Listener bei Fenstergrößenänderung, prüft entsprechend die Orientierung.
 * @event resize
 */
window.addEventListener('resize', checkOrientation);

/**
 * MediaQuery Listener für Landscape-Modus, um auf Richtungsänderungen zu reagieren.
 * @type {MediaQueryList}
 */
const mediaQuery = window.matchMedia("(orientation: landscape)");
mediaQuery.addListener(checkOrientation);

/**
 * Doppelte Umschaltung des Fullscreen-Modus, falls im aktuellen Fullscreen und Fenstergröße geändert wird.
 * @event resize
 */
window.addEventListener('resize', () => {
    if (isFullscreen) {
        toggleFullscreen();
        toggleFullscreen();
    }
});

/**
 * Event-Listener für die ESC-Taste zum Verlassen des Fullscreen-Modus.
 * @event keydown
 * @param {KeyboardEvent} e
 */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isFullscreen) {
        toggleFullscreen();
    }
});

/**
 * Setzt den Fullscreen-Modus bei einem Fullscreen-Event zurück, falls dieser verlassen wird.
 * @event fullscreenchange
 */
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && isFullscreen) {
        toggleFullscreen();
    }
});