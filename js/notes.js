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
            // Common Subjects
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
            
            // Special Subjects
            'orientation': document.querySelectorAll('#orientationNotesGrid .note-card').length,
            'navigation': document.querySelectorAll('#navigationNotesGrid .note-card').length,
            'communication': document.querySelectorAll('#communicationNotesGrid .note-card').length,
            'seamanship': document.querySelectorAll('#seamanshipNotesGrid .note-card').length,
            'fire-fighting': document.querySelectorAll('#fireFightingNotesGrid .note-card').length,
            'swimming': document.querySelectorAll('#swimmingNotesGrid .note-card').length,
            'ship-modelling': document.querySelectorAll('#shipModellingNotesGrid .note-card').length,
            
            // Advanced Topics - NEW
            'awards-decorations': document.querySelectorAll('#awardsDecorationsNotesGrid .note-card').length,
            'military-operations': document.querySelectorAll('#militaryOperationsNotesGrid .note-card').length,
            'important-wars': document.querySelectorAll('#importantWarsNotesGrid .note-card').length,
            'global-issues': document.querySelectorAll('#globalIssuesNotesGrid .note-card').length,
            'important-personalities': document.querySelectorAll('#importantPersonalitiesNotesGrid .note-card').length
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
            // Common Subjects
            'introduction', 'national-integration', 'drill', 'weapon-training',
            'disaster-management', 'social-awareness', 'health-hygiene',
            'environment', 'adventure', 'obstacle-training', 'personality-development',
            
            // Special Subjects
            'orientation', 'navigation', 'communication', 'seamanship',
            'fire-fighting', 'swimming', 'ship-modelling',
            
            // Advanced Topics - NEW
            'awards-decorations', 'military-operations', 'important-wars', 
            'global-issues', 'important-personalities'
        ];
        
        subcategories.forEach(subcategory => {
            const grid = document.getElementById(`${subcategory}NotesGrid`);
            counts[subcategory] = grid ? grid.querySelectorAll('.note-card').length : 0;
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

    // Search functionality (enhancement)
    searchNotes(query) {
        const allNotes = document.querySelectorAll('.note-card');
        let results = [];
        
        allNotes.forEach(note => {
            const title = note.querySelector('.note-title').textContent.toLowerCase();
            const description = note.querySelector('.note-description').textContent.toLowerCase();
            const searchQuery = query.toLowerCase();
            
            if (title.includes(searchQuery) || description.includes(searchQuery)) {
                results.push(note);
            }
        });
        
        return results;
    }

    // Filter notes by type
    filterNotesByType(type) {
        const allNotes = document.querySelectorAll('.note-card');
        return Array.from(allNotes).filter(note => {
            const noteType = note.querySelector('.note-type').textContent.toLowerCase();
            return noteType.includes(type.toLowerCase());
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the notes page
    if (document.querySelector('.notes-hero')) {
        window.notesManager = new NotesManager();
        console.log('Notes page initialized with Advanced Topics support');
        
        // Example of how to use the new note addition functionality:
        /*
        const sampleNote = {
            title: "Military Awards Guide",
            description: "Complete reference for all defense honors and decorations",
            type: "PREMIUM PDF",
            previewLink: "https://example.com/preview",
            downloadLink: "https://example.com/download",
            date: "15 Dec 2024"
        };
        
        // Add note to awards-decorations category
        window.notesManager.addNoteToCategory('awards-decorations', sampleNote);
        */
    }
});

// Additional utility functions for enhanced functionality
const NotesUtils = {
    // Format date for note cards
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    },

    // Generate unique ID for notes
    generateNoteId: () => {
        return 'note_' + Math.random().toString(36).substr(2, 9);
    },

    // Validate note data
    validateNoteData: (noteData) => {
        const required = ['title', 'description', 'type', 'previewLink', 'downloadLink'];
        return required.every(field => noteData[field] && noteData[field].trim() !== '');
    },

    // Export notes data for backup
    exportNotesData: () => {
        const allNotes = {};
        const subcategories = [
            'introduction', 'national-integration', 'drill', 'weapon-training',
            'disaster-management', 'social-awareness', 'health-hygiene',
            'environment', 'adventure', 'obstacle-training', 'personality-development',
            'orientation', 'navigation', 'communication', 'seamanship',
            'fire-fighting', 'swimming', 'ship-modelling',
            'awards-decorations', 'military-operations', 'important-wars', 
            'global-issues', 'important-personalities'
        ];

        subcategories.forEach(subcategory => {
            const grid = document.getElementById(`${subcategory}NotesGrid`);
            if (grid) {
                const notes = Array.from(grid.querySelectorAll('.note-card')).map(note => ({
                    title: note.querySelector('.note-title').textContent,
                    description: note.querySelector('.note-description').textContent,
                    type: note.querySelector('.note-type').textContent,
                    previewLink: note.querySelector('.note-actions a[href*="preview"]').href,
                    downloadLink: note.querySelector('.note-actions a[href*="download"]').href,
                    date: note.querySelector('.note-date').textContent
                }));
                allNotes[subcategory] = notes;
            }
        });

        return allNotes;
    }
};

// Make utils globally available
window.NotesUtils = NotesUtils;