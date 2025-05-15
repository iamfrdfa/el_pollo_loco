/**
 * Original width of the canvas (in pixels).
 * @type {number}
 */
const originalWidth = 720;

/**
 * Original height of the canvas (in pixels).
 * @type {number}
 */
const originalHeight = 480;

/**
 * Status indicating whether the game is currently in fullscreen mode.
 * @type {boolean}
 */
let isFullscreen = false;

/**
 * Toggles between fullscreen and standard display of the canvas and UI.
 * Adjusts sizes and styles for the canvas and page container.
 * Shows/hides relevant UI elements and disables/enables scrolling.
 * @function
 */
function toggleFullscreen() {
    const canvas = document.getElementById('canvas');
    const canvasContainer = document.querySelector('.canvas-container');
    const pageWrapper = document.getElementById('pageWrapper');
    
    if (!isFullscreen) {
        // Calculate screen dimensions and new aspect ratio
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
        
        // Set styles for fullscreen
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
        
        // Adjust UI elements for fullscreen
        document.getElementById('fullscreen').style.display = 'none';
        document.getElementById('minimize').style.display = 'block';
        document.getElementById('headline').style.display = 'none';
        
        // Disable scrolling
        document.body.style.overflow = 'hidden';
        
        isFullscreen = true;
    } else {
        // Back to original size & styles
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
 * Checks and controls the display of orientation hints for mobile devices.
 * Displays the info bar in portrait mode and on mobile devices.
 * Used on load, orientation change, and window resize.
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
 * Initial check of device orientation on page load.
 * @event DOMContentLoaded
 */
checkOrientation();

/**
 * Event listener for device orientation, triggers check function on orientation change.
 * @event orientationchange
 */
window.addEventListener('orientationchange', checkOrientation);

/**
 * Event listener on window resize, checks orientation accordingly.
 * @event resize
 */
window.addEventListener('resize', checkOrientation);

/**
 * MediaQuery listener for landscape mode to react to direction changes.
 * @type {MediaQueryList}
 */
const mediaQuery = window.matchMedia("(orientation: landscape)");
mediaQuery.addListener(checkOrientation);

/**
 * Double toggle of fullscreen mode if currently in fullscreen and window size is changed.
 * @event resize
 */
window.addEventListener('resize', () => {
    if (isFullscreen) {
        toggleFullscreen();
        toggleFullscreen();
    }
});

/**
 * Event listener for the ESC key to exit fullscreen mode.
 * @event keydown
 * @param {KeyboardEvent} e
 */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isFullscreen) {
        toggleFullscreen();
    }
});

/**
 * Resets the fullscreen mode on a fullscreen event if it is exited.
 * @event fullscreenchange
 */
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && isFullscreen) {
        toggleFullscreen();
    }
});
