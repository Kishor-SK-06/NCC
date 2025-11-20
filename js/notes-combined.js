// Notes Combined JavaScript - For all notes pages

class NotesManager {
    constructor() {
        this.currentSubcategory = null;
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.initializeAOS();
        this.updateNotesCounts();
        console.log('NotesManager initialized successfully');
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
        // Check if we're on main notes page or subject page
        if (document.querySelector('.category-cards-grid')) {
            // Main notes page - no subcategory navigation needed
            console.log('Initializing main notes page');
        } else if (document.querySelector('.subcategory-grid')) {
            // Subject page - initialize subcategory navigation
            this.initializeSubcategoryNavigation();
        }

        console.log('Event listeners initialized');
    }

    initializeSubcategoryNavigation() {
        // Subcategory card clicks for subject pages
        const subcategoryCards = document.querySelectorAll('.subcategory-card');
        subcategoryCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSubcategoryNotes(card.dataset.subcategory);
            });
        });

        // Back to categories button for subject pages
        const backButton = document.getElementById('backToCategories');
        if (backButton) {
            backButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.showCategories();
            });
        }
    }

    showSubcategoryNotes(subcategory) {
        console.log('Showing notes for:', subcategory);
        this.currentSubcategory = subcategory;
        
        // Hide the "Back to Main" button when entering subcategory
        const backToMainButton = document.querySelector('.back-to-main');
        if (backToMainButton) {
            backToMainButton.classList.add('hidden');
        }
        
        // Hide all subcategory grids
        const subcategoryGrids = document.querySelectorAll('.subcategory-grid');
        subcategoryGrids.forEach(grid => {
            grid.classList.add('hidden');
        });
        
        // Hide all note sections
        const noteSections = document.querySelectorAll('[id$="-section"]');
        noteSections.forEach(section => {
            section.classList.add('hidden');
        });
        
        // Show the selected subcategory's notes section
        const notesSection = document.getElementById(`${subcategory}-section`);
        if (notesSection) {
            notesSection.classList.remove('hidden');
            console.log('Found and showing notes section:', `${subcategory}-section`);
        } else {
            console.error('Notes section not found:', `${subcategory}-section`);
        }
        
        // Show back to categories button
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
        
        // Show the "Back to Main" button when returning to categories
        const backToMainButton = document.querySelector('.back-to-main');
        if (backToMainButton) {
            backToMainButton.classList.remove('hidden');
        }
        
        // Hide all note sections
        const noteSections = document.querySelectorAll('[id$="-section"]');
        noteSections.forEach(section => {
            section.classList.add('hidden');
        });
        
        // Show all subcategory grids
        const subcategoryGrids = document.querySelectorAll('.subcategory-grid');
        subcategoryGrids.forEach(grid => {
            grid.classList.remove('hidden');
        });
        
        // Hide back to categories button
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

    updateNotesCounts() {
        console.log('Updating notes counts...');
        
        // Only update counts if we're on a subject page with subcategories
        if (!document.querySelector('.subcategory-grid')) {
            console.log('Not a subject page, skipping notes count update');
            return;
        }

        const counts = this.getNotesCounts();
        console.log('Calculated counts:', counts);

        // Update counts in subcategory cards
        const subcategoryCards = document.querySelectorAll('.subcategory-card');
        let updatedCount = 0;
        
        subcategoryCards.forEach(card => {
            const subcategory = card.dataset.subcategory;
            const count = counts[subcategory] || 0;
            const countElement = card.querySelector('.notes-count');
            
            if (countElement) {
                countElement.textContent = `${count} note${count !== 1 ? 's' : ''} available`;
                console.log(`Updated ${subcategory}: ${count} notes`);
                updatedCount++;
            } else {
                console.warn(`Notes count element not found for: ${subcategory}`);
            }
        });
        
        console.log(`Updated ${updatedCount} subcategory counts successfully`);
    }

    getNotesCounts() {
        const counts = {};
        
        // Get all possible subcategories for the current page
        const subcategories = Array.from(document.querySelectorAll('.subcategory-card'))
            .map(card => card.dataset.subcategory);
        
        console.log('Found subcategories:', subcategories);
        
        subcategories.forEach(subcategory => {
            // Try different possible ID formats
            const possibleIds = [
                `${subcategory}NotesGrid`,
                `${subcategory.replace(/-([a-z])/g, (g) => g[1].toUpperCase())}NotesGrid`
            ];
            
            let noteCount = 0;
            let foundGrid = null;
            
            for (const id of possibleIds) {
                const grid = document.getElementById(id);
                if (grid) {
                    foundGrid = grid;
                    noteCount = grid.querySelectorAll('.note-card').length;
                    console.log(`Found grid ${id} for ${subcategory}: ${noteCount} notes`);
                    break;
                }
            }
            
            if (!foundGrid) {
                console.warn(`No notes grid found for subcategory: ${subcategory}. Tried IDs: ${possibleIds.join(', ')}`);
            }
            
            counts[subcategory] = noteCount;
        });
        
        return counts;
    }

    // Enhanced method to add new notes dynamically
    addNoteToCategory(subcategory, noteData) {
        const grid = document.getElementById(`${subcategory}NotesGrid`);
        if (!grid) {
            console.error(`Notes grid not found for: ${subcategory}`);
            return false;
        }

        const noteCard = this.createNoteCard(noteData);
        grid.appendChild(noteCard);
        
        // Refresh counts and animations
        this.updateNotesCounts();
        this.refreshAOS();
        
        console.log(`Note added to ${subcategory}: ${noteData.title}`);
        return true;
    }

    // Helper method to create note card HTML
    createNoteCard(noteData) {
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';
        noteCard.setAttribute('data-aos', 'fade-up');
        
        noteCard.innerHTML = `
            <div class="note-header">
                <h5 class="note-title">${noteData.title}</h5>
                <p class="note-description">${noteData.description}</p>
            </div>
            <div class="note-body">
                <div class="note-meta">
                    <span class="note-type">${noteData.type}</span>
                    <div class="note-actions">
                        <a href="${noteData.previewLink}" class="note-action-btn" target="_blank">
                            <i class="fas fa-eye"></i> Preview
                        </a>
                        <a href="${noteData.downloadLink}" class="note-action-btn" target="_blank">
                            <i class="fas fa-download"></i> Download
                        </a>
                    </div>
                </div>
            </div>
            <div class="note-footer">
                <span class="note-date">${noteData.date}</span>
            </div>
        `;
        
        return noteCard;
    }

    // Method to bulk add notes
    addMultipleNotes(subcategory, notesArray) {
        notesArray.forEach(noteData => {
            this.addNoteToCategory(subcategory, noteData);
        });
    }
}

// Utility functions
const NotesUtils = {
    // Format date for note cards
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    },

    // Get page type
    getPageType: () => {
        if (document.querySelector('.category-cards-grid')) return 'main';
        if (document.querySelector('.subcategory-grid')) return 'subject';
        return 'unknown';
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on any notes-related page
    if (document.querySelector('.notes-hero')) {
        window.notesManager = new NotesManager();
        console.log('Notes page initialized - Type:', NotesUtils.getPageType());
        
        // Force update notes counts after a short delay to ensure DOM is fully loaded
        setTimeout(() => {
            window.notesManager.updateNotesCounts();
        }, 500);
    }
});

// Make utils globally available
window.NotesUtils = NotesUtils;