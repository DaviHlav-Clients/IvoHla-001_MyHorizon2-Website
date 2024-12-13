document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const logoContainer = document.querySelector('.logo-container');
        logoContainer.classList.add('animation-complete');
    }, 3000); // Wait for animations to complete (2.5s) plus a small delay
});
