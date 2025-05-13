const originalWidth = 720;  // Original Canvas-Breite
const originalHeight = 480; // Original Canvas-Höhe
let isFullscreen = false;


function toggleFullscreen() {
    const canvas = document.getElementById('canvas');
    const canvasContainer = document.querySelector('.canvas-container');
    const pageWrapper = document.getElementById('pageWrapper');
    
    if (!isFullscreen) {
        // Bildschirmmaße ermitteln
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        // Seitenverhältnis des Canvas beibehalten
        const aspectRatio = originalWidth / originalHeight;
        let newWidth, newHeight;
        
        if (screenWidth / screenHeight > aspectRatio) {
            newHeight = screenHeight * 0.9; // 90% der Bildschirmhöhe
            newWidth = newHeight * aspectRatio;
        } else {
            newWidth = screenWidth * 0.9; // 90% der Bildschirmbreite
            newHeight = newWidth / aspectRatio;
        }
        
        // Styles anwenden
        canvas.style.width = `${newWidth}px`;
        canvas.style.height = `${newHeight}px`;
        canvasContainer.style.width = `${newWidth}px`;
        canvasContainer.style.height = `${newHeight}px`;
        
        // Container zentrieren und Vollbild-Styles anwenden
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
        
        // UI-Elemente anpassen
        document.getElementById('fullscreen').style.display = 'none';
        document.getElementById('minimize').style.display = 'block';
        document.getElementById('headline').style.display = 'none';
        
        // Scrolling deaktivieren
        document.body.style.overflow = 'hidden';
        
        isFullscreen = true;
    } else {
        // Zurück zur Original-Größe
        canvas.style.width = originalWidth + 'px';
        canvas.style.height = originalHeight + 'px';
        canvasContainer.style.width = originalWidth + 'px';
        canvasContainer.style.height = originalHeight + 'px';
        
        // Container-Styles zurücksetzen
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
        
        // UI-Elemente zurücksetzen
        document.getElementById('fullscreen').style.display = 'block';
        document.getElementById('minimize').style.display = 'none';
        document.getElementById('headline').style.display = 'block';
        document.getElementById('explanationBar').style.display = 'none';
        
        // Scrolling wieder aktivieren
        document.body.style.overflow = '';
        
        isFullscreen = false;
    }
}

function checkOrientation() {
    const orientationInfo = document.getElementById('orientationInfo');
    
    // Prüfen ob das Element existiert
    if (!orientationInfo) return;
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!isMobile) {
        // Kein mobiles Gerät - Info immer ausblenden
        orientationInfo.style.display = 'none';
        return;
    }
    
    // Prüfen der Orientation mit matchMedia
    const isLandscape = window.matchMedia("(orientation: landscape)").matches;
    
    if (isLandscape) {
        // Querformat - Info ausblenden
        orientationInfo.style.display = 'none';
    } else {
        // Hochformat - Info anzeigen
        orientationInfo.style.display = 'flex';
    }
}


// Initial beim Laden prüfen
checkOrientation();

// Bei Orientierungsänderung prüfen
window.addEventListener('orientationchange', checkOrientation);

// Bei Größenänderung prüfen
window.addEventListener('resize', checkOrientation);

// Media Query Listener
const mediaQuery = window.matchMedia("(orientation: landscape)");
mediaQuery.addListener(checkOrientation);

// Event-Listener für Bildschirmänderungen
window.addEventListener('resize', () => {
    if (isFullscreen) {
        toggleFullscreen();
        toggleFullscreen();
    }
});

// Event-Listener für ESC-Taste
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isFullscreen) {
        toggleFullscreen();
    }
});

// Event-Listener für Escape-Taste
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && isFullscreen) {
        toggleFullscreen();
    }
});