// Homepage specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to hierarchy images (Homepage specific)
    const hierarchyImages = document.querySelectorAll('.hierarchy-img');
    hierarchyImages.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Add click effect to cards (Homepage specific)
    const cards = document.querySelectorAll('.modern-card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            setTimeout(() => {
                this.style.transform = 'translateY(-10px) scale(1)';
            }, 150);
        });
    });

    // Leader image loading handler (Homepage specific)
    const leaderImages = document.querySelectorAll('.leader-card img');
    leaderImages.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
        
        // Fallback in case image is already loaded
        if (img.complete) {
            img.classList.add('loaded');
        }
    });

    // Homepage specific animations
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.01)';
        });
        
        heroSection.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
        });
    }
});

// Homepage specific functions
const HomepageUtils = {
    // Function to handle hierarchy card interactions
    initHierarchyCards: function() {
        const hierarchyCards = document.querySelectorAll('#hierarchy .modern-card');
        hierarchyCards.forEach((card, index) => {
            card.addEventListener('mouseenter', function() {
                this.style.zIndex = '10';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.zIndex = '1';
            });
        });
    },

    // Function to handle leader card statistics
    animateLeaderStats: function() {
        const statItems = document.querySelectorAll('.stat-item h5');
        statItems.forEach(stat => {
            const originalText = stat.textContent;
            stat.addEventListener('mouseover', function() {
                this.style.transform = 'scale(1.2)';
                this.style.color = 'var(--accent)';
            });
            
            stat.addEventListener('mouseout', function() {
                this.style.transform = 'scale(1)';
                this.style.color = '';
            });
        });
    }
};

// Initialize homepage specific features
document.addEventListener('DOMContentLoaded', function() {
    HomepageUtils.initHierarchyCards();
    HomepageUtils.animateLeaderStats();
});