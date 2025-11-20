// Tutorials Combined JavaScript - Enhanced Version

class TutorialsManager {
    constructor() {
        this.currentSubcategory = null;
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.initializeAOS();
        this.updateVideoCounts();
        console.log('TutorialsManager initialized successfully');
    }

    initializeAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                once: true,
                offset: 100
            });
        }
    }

    initializeEventListeners() {
        // Subcategory card clicks
        const subcategoryCards = document.querySelectorAll('.subcategory-card');
        subcategoryCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSubcategoryVideos(card.dataset.subcategory);
            });
        });

        // Back to categories button
        const backButton = document.getElementById('backToCategories');
        if (backButton) {
            backButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.showCategories();
            });
        }

        // Tab change events to reset view
        const tabButtons = document.querySelectorAll('[data-bs-toggle="pill"]');
        tabButtons.forEach(button => {
            button.addEventListener('show.bs.tab', () => {
                this.showCategories();
            });
        });

        console.log('Event listeners initialized');
    }

    showSubcategoryVideos(subcategory) {
        console.log('Showing videos for:', subcategory);
        this.currentSubcategory = subcategory;
        
        // Hide all subcategory grids
        const subcategoryGrids = document.querySelectorAll('.subcategory-grid');
        subcategoryGrids.forEach(grid => {
            grid.classList.add('hidden');
        });
        
        // Hide all video sections
        const videoSections = document.querySelectorAll('[id$="Videos"]');
        videoSections.forEach(section => {
            section.classList.add('hidden');
        });
        
        // Show the selected subcategory's videos section
        const videosSection = document.getElementById(`${subcategory}Videos`);
        if (videosSection) {
            videosSection.classList.remove('hidden');
            console.log('Found and showing video section:', `${subcategory}Videos`);
        } else {
            console.error('Video section not found:', `${subcategory}Videos`);
        }
        
        // Show back button
        const backButtonContainer = document.getElementById('backButtonContainer');
        if (backButtonContainer) {
            backButtonContainer.classList.remove('hidden');
        }
        
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Refresh AOS for new content
        this.refreshAOS();
    }

    showCategories() {
        console.log('Showing categories');
        
        // Hide all video sections
        const videoSections = document.querySelectorAll('[id$="Videos"]');
        videoSections.forEach(section => {
            section.classList.add('hidden');
        });
        
        // Show all subcategory grids
        const subcategoryGrids = document.querySelectorAll('.subcategory-grid');
        subcategoryGrids.forEach(grid => {
            grid.classList.remove('hidden');
        });
        
        // Hide back button
        const backButtonContainer = document.getElementById('backButtonContainer');
        if (backButtonContainer) {
            backButtonContainer.classList.add('hidden');
        }
        
        this.currentSubcategory = null;
        
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Refresh AOS
        this.refreshAOS();
    }

    refreshAOS() {
        if (typeof AOS !== 'undefined') {
            setTimeout(() => {
                AOS.refresh();
            }, 300);
        }
    }

    updateVideoCounts() {
        console.log('Updating video counts...');
        
        // Count videos in each section with better error handling
        const counts = {};
        const subcategories = ['drill', 'weapon', 'semaphore', 'seamanship', 'navigation', 'shipmodelling', 'swimming'];
        
        subcategories.forEach(subcategory => {
            const videoGrid = document.getElementById(`${subcategory}VideoGrid`);
            if (videoGrid) {
                const videoCount = videoGrid.querySelectorAll('.video-card').length;
                // Check if it's the placeholder "coming soon" content
                const hasPlaceholder = videoGrid.querySelector('.text-center.py-5');
                counts[subcategory] = hasPlaceholder ? 0 : videoCount;
                console.log(`Subcategory ${subcategory}: ${counts[subcategory]} videos`);
            } else {
                console.warn(`Video grid not found for: ${subcategory}`);
                counts[subcategory] = 0;
            }
        });

        // Update counts in subcategory cards
        const subcategoryCards = document.querySelectorAll('.subcategory-card');
        let updatedCount = 0;
        
        subcategoryCards.forEach(card => {
            const subcategory = card.dataset.subcategory;
            const count = counts[subcategory] || 0;
            const countElement = card.querySelector('.videos-count');
            if (countElement) {
                countElement.textContent = `${count} video${count !== 1 ? 's' : ''} available`;
                console.log(`Updated ${subcategory}: ${count} videos`);
                updatedCount++;
            } else {
                console.warn(`Video count element not found for: ${subcategory}`);
            }
        });
        
        console.log(`Updated ${updatedCount} subcategory video counts successfully`);
    }

    // Enhanced method to add a new video programmatically
    addVideo(subcategory, videoData) {
        const videoGrid = document.getElementById(`${subcategory}VideoGrid`);
        if (!videoGrid) {
            console.error('Video grid not found for:', subcategory);
            return false;
        }

        // Remove placeholder content if it exists
        const placeholder = videoGrid.querySelector('.text-center.py-5');
        if (placeholder) {
            placeholder.remove();
        }

        const videoCard = this.createVideoCard(videoData);
        videoGrid.appendChild(videoCard);
        
        // Update counts
        this.updateVideoCounts();
        
        // Refresh AOS for new content
        this.refreshAOS();
        
        console.log(`Video added to ${subcategory}: ${videoData.title}`);
        return true;
    }

    createVideoCard(videoData) {
        const card = document.createElement('div');
        card.className = `video-card ${videoData.isNew ? 'new-video' : ''}`;
        card.setAttribute('data-aos', 'fade-up');
        
        card.innerHTML = `
            ${videoData.isNew ? '<div class="new-badge">NEW</div>' : ''}
            <div class="video-thumbnail">
                <img src="${videoData.thumbnail}" alt="${videoData.title}" class="thumbnail-img">
                <div class="video-duration">${videoData.duration}</div>
                <div class="play-overlay">
                    <i class="fas fa-play"></i>
                </div>
            </div>
            <div class="video-info">
                <h5 class="video-title">${videoData.title}</h5>
                <p class="video-description">${videoData.description}</p>
                <div class="video-meta">
                    <span class="video-views"><i class="fas fa-eye me-1"></i>${videoData.views}</span>
                    <span class="video-date"><i class="fas fa-calendar me-1"></i>${videoData.date}</span>
                </div>
            </div>
            <a href="${videoData.url}" class="video-link" target="_blank"></a>
        `;

        return card;
    }

    // Method to bulk add videos
    addMultipleVideos(subcategory, videosArray) {
        videosArray.forEach(videoData => {
            this.addVideo(subcategory, videoData);
        });
    }

    // Method to get current state
    getState() {
        return {
            currentSubcategory: this.currentSubcategory,
            videoCounts: this.getVideoCounts()
        };
    }

    getVideoCounts() {
        const counts = {};
        const subcategories = ['drill', 'weapon', 'semaphore', 'seamanship', 'navigation', 'shipmodelling', 'swimming'];
        
        subcategories.forEach(subcategory => {
            const grid = document.getElementById(`${subcategory}VideoGrid`);
            if (grid) {
                const hasPlaceholder = grid.querySelector('.text-center.py-5');
                counts[subcategory] = hasPlaceholder ? 0 : grid.querySelectorAll('.video-card').length;
            } else {
                counts[subcategory] = 0;
            }
        });
        
        return counts;
    }

    // Search functionality for videos
    searchVideos(query) {
        const allVideos = document.querySelectorAll('.video-card');
        let results = [];
        
        allVideos.forEach(video => {
            const title = video.querySelector('.video-title').textContent.toLowerCase();
            const description = video.querySelector('.video-description').textContent.toLowerCase();
            const searchQuery = query.toLowerCase();
            
            if (title.includes(searchQuery) || description.includes(searchQuery)) {
                results.push(video);
            }
        });
        
        return results;
    }
}

// Utility functions for tutorials
const TutorialsUtils = {
    // Format duration for display
    formatDuration: (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    },

    // Format view count
    formatViews: (views) => {
        if (views >= 1000000) {
            return (views / 1000000).toFixed(1) + 'M';
        } else if (views >= 1000) {
            return (views / 1000).toFixed(1) + 'K';
        }
        return views.toString();
    },

    // Get page type
    getPageType: () => {
        if (document.querySelector('.tutorials-hero')) return 'tutorials';
        return 'unknown';
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the tutorials page
    if (document.querySelector('.tutorials-hero')) {
        window.tutorialsManager = new TutorialsManager();
        console.log('Tutorials page initialized - Type:', TutorialsUtils.getPageType());
        
        // Force update video counts after DOM is fully loaded
        setTimeout(() => {
            window.tutorialsManager.updateVideoCounts();
        }, 500);
    }
});

// Make utils globally available
window.TutorialsUtils = TutorialsUtils;

// Export for use in console if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TutorialsManager, TutorialsUtils };
}