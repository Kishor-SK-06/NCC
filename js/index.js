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

// Disclaimer Popup functionality
class DisclaimerPopup {
    constructor() {
        this.popup = document.getElementById('welcomePopup');
        this.closeBtn = document.getElementById('closePopup');
        this.understandBtn = document.getElementById('understandButton');
        this.photoContainer = document.getElementById('photoContainer');
        this.popupPhoto = document.getElementById('popupPhoto');
        this.hasAgreed = sessionStorage.getItem('disclaimerAgreed');
        
        this.init();
    }
    
    init() {
        // Handle image loading errors
        this.handleImageError();
        
        // Show popup on page load (only once per session)
        if (!this.hasAgreed) {
            setTimeout(() => {
                this.showPopup();
            }, 1000); // Show after 1 seconds
        }
        
        // Event listeners - ONLY close button and agree button can close the popup
        this.closeBtn.addEventListener('click', () => this.hidePopup());
        this.understandBtn.addEventListener('click', () => this.agreeAndClose());
        
        // REMOVED: Close on overlay click - User must click the agree button
        // this.popup.addEventListener('click', (e) => {
        //     if (e.target === this.popup) {
        //         this.hidePopup();
        //     }
        // });
        
        // Close on Escape key - Optional: You can remove this too if you want to force button click
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.popup.style.display === 'flex') {
                // Optional: You can comment this out if you don't want Escape to close it
                // this.hidePopup();
            }
        });
    }
    
    handleImageError() {
        // Check if image loaded successfully
        this.popupPhoto.onerror = () => {
            this.popupPhoto.style.display = 'none';
            this.photoContainer.innerHTML = '<i class="fas fa-user-graduate fa-3x" style="color: var(--primary); margin-top: 50px;"></i>';
        };
        
        // If image is already broken, replace it
        if (this.popupPhoto.complete && this.popupPhoto.naturalHeight === 0) {
            this.popupPhoto.style.display = 'none';
            this.photoContainer.innerHTML = '<i class="fas fa-user-graduate fa-3x" style="color: var(--primary); margin-top: 50px;"></i>';
        }
    }
    
    showPopup() {
        this.popup.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Add entrance animation
        const modal = this.popup.querySelector('.popup-modal');
        modal.style.animation = 'popupSlideIn 0.5s ease-out';
    }
    
    hidePopup() {
        this.popup.style.display = 'none';
        document.body.style.overflow = '';
        
        // Add exit animation
        const modal = this.popup.querySelector('.popup-modal');
        modal.style.animation = 'popupSlideOut 0.3s ease-in';
        
        setTimeout(() => {
            modal.style.animation = '';
        }, 300);
    }
    
    agreeAndClose() {
        // Mark as agreed in session storage
        sessionStorage.setItem('disclaimerAgreed', 'true');
        
        // Visual feedback
        this.understandBtn.innerHTML = '<i class="fas fa-thumbs-up me-2"></i> Thank You!';
        this.understandBtn.style.background = 'linear-gradient(135deg, #4caf50, #45a049)';
        this.understandBtn.disabled = true; // Prevent multiple clicks
        
        setTimeout(() => {
            this.hidePopup();
            // Reset button after popup closes (for future use)
            setTimeout(() => {
                this.understandBtn.innerHTML = '<i class="fas fa-check-circle me-2"></i> I Understand & Agree';
                this.understandBtn.style.background = '';
                this.understandBtn.disabled = false;
            }, 300);
        }, 1000);
    }
}

// Add exit animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes popupSlideOut {
        from {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        to {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
        }
    }
    
    /* Make the popup non-clickable on the overlay */
    .popup-overlay {
        pointer-events: auto;
    }
    
    .popup-modal {
        pointer-events: auto;
    }
`;
document.head.appendChild(style);

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new DisclaimerPopup();
    
    // Optional: Add popup trigger for testing
    window.showDisclaimerPopup = function() {
        new DisclaimerPopup().showPopup();
    };
});