// Initialize AOS animations
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Date and Time Functionality
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Kolkata'
    };
    document.getElementById('date-time').textContent = now.toLocaleDateString('en-IN', options);
}

// Greeting based on time
function updateGreeting() {
    const hour = new Date().getHours();
    const greetText = document.getElementById('greet-text');
    let greeting = 'Good ';
    
    if (hour < 12) greeting += 'Morning';
    else if (hour < 17) greeting += 'Afternoon';
    else greeting += 'Evening';
    
    greetText.textContent = greeting + ', Cadet';
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add loading animation to cards
function initCardAnimations() {
    const cards = document.querySelectorAll('.modern-card, .leader-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize date and time
    updateDateTime();
    updateGreeting();
    setInterval(updateDateTime, 1000);
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize card animations
    initCardAnimations();
});

// Common utility functions
const CommonUtils = {
    // Debounce function for performance
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Format date for display
    formatDate: function(date) {
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Check if element is in viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};