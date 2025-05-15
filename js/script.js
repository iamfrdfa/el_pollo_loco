/**
 * Toggles the visibility of the game information overlay.
 * Uses the 'hidden' CSS class to show/hide the overlay element with ID 'infoOverlay'.
 * 
 * @function
 * @name gameInfo
 * @returns {void}
 * @example
 * // To show/hide the info overlay:
 * gameInfo();
 */
function gameInfo() {
    document.getElementById('infoOverlay').classList.toggle('hidden');
}