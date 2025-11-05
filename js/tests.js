// js/tests.js - Tests Page Functionality

class TestsManager {
    constructor() {
        this.currentCategory = 'common';
        this.currentSubcategory = '';
        this.testMode = '';
        
        this.initializeEventListeners();
        this.updateTestCounts();
        this.initializeAOS();
    }

    initializeEventListeners() {
        // Test action buttons (Practice/Exam)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('practice-test') || 
                e.target.classList.contains('exam-test')) {
                this.handleTestStart(e.target);
            }
            
            // Subcategory card click (for future expansion)
            if (e.target.closest('.subcategory-card')) {
                const card = e.target.closest('.subcategory-card');
                // You can add card click functionality here if needed
            }
        });

        // Back to categories button
        const backButton = document.getElementById('backToCategories');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.showCategories();
            });
        }

        // Tab change events
        const tabButtons = document.querySelectorAll('[data-bs-toggle="pill"]');
        tabButtons.forEach(button => {
            button.addEventListener('show.bs.tab', (e) => {
                this.handleTabChange(e.target.id);
            });
        });
    }

    handleTestStart(button) {
        const category = button.getAttribute('data-category');
        const subcategory = button.getAttribute('data-subcategory');
        const mode = button.getAttribute('data-mode');
        
        this.currentCategory = category;
        this.currentSubcategory = subcategory;
        this.testMode = mode;
        
        console.log(`Starting ${mode} test for ${category} - ${subcategory}`);
        
        // Redirect to ongoing-test.html with parameters
        this.redirectToTest();
    }

    redirectToTest() {
        const params = new URLSearchParams({
            category: this.currentCategory,
            subcategory: this.currentSubcategory,
            mode: this.testMode
        });
        
        window.location.href = `ongoing-test.html?${params.toString()}`;
    }

    handleTabChange(tabId) {
        // Update current category based on active tab
        if (tabId === 'common-tests-tab') {
            this.currentCategory = 'common';
        } else if (tabId === 'special-tests-tab') {
            this.currentCategory = 'special';
        }
        // Add more categories as needed
        
        console.log(`Switched to category: ${this.currentCategory}`);
    }

    showCategories() {
        // Hide test sections and show categories
        const backButton = document.getElementById('backButtonContainer');
        const categoryGrids = document.querySelectorAll('.subcategory-grid');
        const testSections = document.querySelectorAll('[id$="-section"]');
        
        if (backButton) backButton.style.display = 'none';
        categoryGrids.forEach(grid => grid.style.display = 'grid');
        testSections.forEach(section => section.classList.add('hidden'));
    }

    updateTestCounts() {
        // This function will update test counts based on available JSON files
        // For now, we'll set default values
        const testCountElements = document.querySelectorAll('.tests-count');
        testCountElements.forEach(element => {
            // You can implement actual test counting logic here later
            // For now, show placeholder
            element.textContent = '2 tests available';
        });
    }

    initializeAOS() {
        // Initialize Animate On Scroll if available
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true
            });
        }
    }

    // Utility function to get category name
    getCategoryName(category) {
        const categories = {
            'common': 'Common Training',
            'special': 'Special Training',
            'advance': 'Advance Training'
        };
        return categories[category] || category;
    }

    // Utility function to get subcategory name
    getSubcategoryName(subcategory) {
        const subcategories = {
            // Common subcategories
            'introduction': 'NCC Introduction',
            'national-integration': 'National Integration',
            'drill': 'Drill',
            'weapon-training': 'Weapon Training',
            'disaster-management': 'Disaster Management',
            'social-awareness': 'Social Awareness & Community Development',
            'health-hygiene': 'Health & Hygiene',
            'environment': 'Environment Awareness & Conservation',
            'adventure': 'Adventure',
            'obstacle-training': 'Obstacle Training',
            'personality-development': 'Personality Development & Leadership',
            
            // Special subcategories
            'orientation': 'Orientation',
            'navigation': 'Navigation',
            'communication': 'Communication',
            'seamanship': 'Seamanship',
            'fire-fighting': 'Fire Fighting & Damage Control',
            'swimming': 'Swimming',
            'ship-modelling': 'Ship Modelling'
        };
        return subcategories[subcategory] || subcategory;
    }

    // Method to dynamically add new categories (for future use)
    addCategory(categoryId, categoryName, subcategories) {
        // This method can be used to dynamically add new categories
        console.log(`Adding new category: ${categoryName}`);
        // Implementation for dynamic category addition
    }

    // Method to dynamically add new subcategories (for future use)
    addSubcategory(category, subcategoryId, subcategoryName, description, icon) {
        // This method can be used to dynamically add new subcategories
        console.log(`Adding new subcategory to ${category}: ${subcategoryName}`);
        // Implementation for dynamic subcategory addition
    }
}

// Test data structure for reference (can be moved to separate file)
const TEST_CONFIG = {
    common: {
        introduction: {
            practice: { questions: 10, time: 900 },
            exam: { questions: 20, time: 1800 }
        },
        'national-integration': {
            practice: { questions: 10, time: 900 },
            exam: { questions: 20, time: 1800 }
        },
        drill: {
            practice: { questions: 15, time: 1200 },
            exam: { questions: 25, time: 2100 }
        },
        // Add more subcategories as needed
    },
    special: {
        navigation: {
            practice: { questions: 12, time: 1000 },
            exam: { questions: 22, time: 1900 }
        },
        'fire-fighting': {
            practice: { questions: 15, time: 1200 },
            exam: { questions: 25, time: 2100 }
        },
        // Add more subcategories as needed
    }
};

// Initialize the Tests Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.testsManager = new TestsManager();
    
    // Add any additional initialization here
    console.log('Tests page initialized successfully');
});

// Utility functions for test management
const TestUtils = {
    // Get test configuration
    getTestConfig(category, subcategory, mode) {
        return TEST_CONFIG[category]?.[subcategory]?.[mode] || { questions: 15, time: 1200 };
    },

    // Format time for display
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    },

    // Validate test parameters
    validateTestParams(category, subcategory, mode) {
        const validCategories = ['common', 'special', 'advance'];
        const validModes = ['practice', 'exam'];
        
        if (!validCategories.includes(category)) {
            console.error('Invalid category:', category);
            return false;
        }
        
        if (!validModes.includes(mode)) {
            console.error('Invalid mode:', mode);
            return false;
        }
        
        return true;
    },

    // Get test file path
    getTestFilePath(category, subcategory) {
        return `test/${category}/${subcategory}.json`;
    }
};

// Export for use in other files (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TestsManager, TestUtils };
}