// Add simple animation to timeline items when they come into view
document.addEventListener('DOMContentLoaded', function() {
    const timelineItems = document.querySelectorAll('.timeline-content');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(item);
    });
    
    // Add animation to event cards
    const eventCards = document.querySelectorAll('.event-card');
    
    const eventObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    eventCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        eventObserver.observe(card);
    });
    
    // WhatsApp button functionality
    const whatsappButton = document.querySelector('.whatsapp-button');
    if (whatsappButton) {
        // Add click tracking (optional)
        whatsappButton.addEventListener('click', function() {
            console.log('WhatsApp button clicked - redirecting to Sumit Kushwaha');
            // You can add analytics tracking here
        });
        
        // Check if image failed to load and show icon instead
        const whatsappImg = whatsappButton.querySelector('img');
        if (whatsappImg) {
            whatsappImg.addEventListener('error', function() {
                this.style.display = 'none';
                const icon = this.nextElementSibling;
                if (icon && icon.classList.contains('fa-whatsapp')) {
                    icon.style.display = 'flex';
                }
            });
        }
    }
});