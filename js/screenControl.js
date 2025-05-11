let originalWidth = 720;  // Ursprüngliche Breite
let originalHeight = 480; // Ursprüngliche Höhe
let isFullscreen = false;

function toggleFullscreen() {
    const canvas = document.getElementById('canvas');
    const canvasContainer = document.querySelector('.canvas-container');
    
    if (!isFullscreen) {
        // Auf doppelte Größe setzen
        canvas.style.width = (originalWidth * 2) + 'px';
        canvas.style.height = (originalHeight * 2) + 'px';
        canvasContainer.style.width = (originalWidth * 2) + 'px';
        canvasContainer.style.height = (originalHeight * 2) + 'px';
        
        // Icons wechseln
        document.getElementById('fullscreen').style.display = 'none';
        document.getElementById('minimize').style.display = 'block';
        document.getElementById('headline').style.display = 'none';
        
        isFullscreen = true;
    } else {
        // Zurück zur Original-Größe
        canvas.style.width = originalWidth + 'px';
        canvas.style.height = originalHeight + 'px';
        canvasContainer.style.width = originalWidth + 'px';
        canvasContainer.style.height = originalHeight + 'px';
        
        // Icons wechseln
        document.getElementById('fullscreen').style.display = 'block';
        document.getElementById('minimize').style.display = 'none';
        document.getElementById('headline').style.display = 'block';
        
        isFullscreen = false;
    }
}