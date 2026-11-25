document.addEventListener('DOMContentLoaded', () => {
    // Support du mode sombre
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
    }
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (event.matches) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    });
    
    // Transition entre les formulaires
    const slider = document.querySelector('.form-slider');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    
    showSignup.addEventListener('click', () => {
        slider.style.transform = 'translateX(-50%)';
    });
    
    showLogin.addEventListener('click', () => {
        slider.style.transform = 'translateX(0)';
    });
    
    
});