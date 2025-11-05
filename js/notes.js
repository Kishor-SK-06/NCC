// Notes Navigation Manager
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
        // Subcategory card clicks
        const subcategoryCards = document.querySelectorAll('.subcategory-card');
        subcategoryCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSubcategoryNotes(card.dataset.subcategory);
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

    showSubcategoryNotes(subcategory) {
        console.log('Showing notes for:', subcategory);
        this.currentSubcategory = subcategory;
        
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

    updateNotesCounts() {
        console.log('Updating notes counts...');
        
        // Count notes in each section
        const counts = {
            'introduction': document.querySelectorAll('#introductionNotesGrid .note-card').length,
            'national-integration': document.querySelectorAll('#nationalIntegrationNotesGrid .note-card').length,
            'drill': document.querySelectorAll('#drillNotesGrid .note-card').length,
            'weapon-training': document.querySelectorAll('#weaponTrainingNotesGrid .note-card').length,
            'disaster-management': document.querySelectorAll('#disasterManagementNotesGrid .note-card').length,
            'social-awareness': document.querySelectorAll('#socialAwarenessNotesGrid .note-card').length,
            'health-hygiene': document.querySelectorAll('#healthHygieneNotesGrid .note-card').length,
            'environment': document.querySelectorAll('#environmentNotesGrid .note-card').length,
            'adventure': document.querySelectorAll('#adventureNotesGrid .note-card').length,
            'obstacle-training': document.querySelectorAll('#obstacleTrainingNotesGrid .note-card').length,
            'personality-development': document.querySelectorAll('#personalityDevelopmentNotesGrid .note-card').length,
            'orientation': document.querySelectorAll('#orientationNotesGrid .note-card').length,
            'navigation': document.querySelectorAll('#navigationNotesGrid .note-card').length,
            'communication': document.querySelectorAll('#communicationNotesGrid .note-card').length,
            'seamanship': document.querySelectorAll('#seamanshipNotesGrid .note-card').length,
            'fire-fighting': document.querySelectorAll('#fireFightingNotesGrid .note-card').length,
            'swimming': document.querySelectorAll('#swimmingNotesGrid .note-card').length,
            'ship-modelling': document.querySelectorAll('#shipModellingNotesGrid .note-card').length
        };

        // Update counts in subcategory cards
        const subcategoryCards = document.querySelectorAll('.subcategory-card');
        subcategoryCards.forEach(card => {
            const subcategory = card.dataset.subcategory;
            const count = counts[subcategory] || 0;
            const countElement = card.querySelector('.notes-count');
            if (countElement) {
                countElement.textContent = `${count} note${count !== 1 ? 's' : ''} available`;
                console.log(`Updated ${subcategory}: ${count} notes`);
            }
        });
        
        console.log('Notes counts updated successfully');
    }

    // Utility method to get current state
    getState() {
        return {
            currentSubcategory: this.currentSubcategory,
            notesCounts: this.getNotesCounts()
        };
    }

    getNotesCounts() {
        const counts = {};
        const subcategories = [
            'introduction', 'national-integration', 'drill', 'weapon-training',
            'disaster-management', 'social-awareness', 'health-hygiene',
            'environment', 'adventure', 'obstacle-training', 'personality-development',
            'orientation', 'navigation', 'communication', 'seamanship',
            'fire-fighting', 'swimming', 'ship-modelling'
        ];
        
        subcategories.forEach(subcategory => {
            const grid = document.getElementById(`${subcategory}NotesGrid`);
            counts[subcategory] = grid ? grid.querySelectorAll('.note-card').length : 0;
        });
        
        return counts;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the notes page
    if (document.querySelector('.notes-hero')) {
        window.notesManager = new NotesManager();
        console.log('Notes page initialized');
    }
});