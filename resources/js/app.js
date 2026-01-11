import './bootstrap';
import Alpine from 'alpinejs';

window.Alpine = Alpine;

// Wait for DOM to be ready before starting Alpine
// This ensures all inline scripts that define Alpine data are loaded first
document.addEventListener('DOMContentLoaded', () => {
    Alpine.start();
});
