// Notes Manager - Complete Solution with Preview & Download
class NotesManager {
    constructor() {
        this.currentSubcategory = null;
        this.googleDriveConfig = {
            directDownload: 'https://drive.google.com/uc?export=download&id=',
            previewBase: 'https://drive.google.com/file/d/',
            docsExport: 'https://docs.google.com/document/d/',
            sheetsExport: 'https://docs.google.com/spreadsheets/d/',
            slidesExport: 'https://docs.google.com/presentation/d/'
        };
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.initializeAOS();
        this.updateNotesCounts();
        this.enhanceGoogleDriveLinks(); // Fix all links on load
        console.log('NotesManager initialized with enhanced Google Drive functionality');
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
        if (document.querySelector('.subcategory-grid')) {
            this.initializeSubcategoryNavigation();
        }
    }

    initializeSubcategoryNavigation() {
        const subcategoryCards = document.querySelectorAll('.subcategory-card');
        subcategoryCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSubcategoryNotes(card.dataset.subcategory);
            });
        });

        const backButton = document.getElementById('backToCategories');
        if (backButton) {
            backButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.showCategories();
            });
        }
    }

    showSubcategoryNotes(subcategory) {
        this.currentSubcategory = subcategory;
        
        const backToMainButton = document.querySelector('.back-to-main');
        if (backToMainButton) backToMainButton.classList.add('hidden');
        
        const subcategoryGrids = document.querySelectorAll('.subcategory-grid');
        subcategoryGrids.forEach(grid => grid.classList.add('hidden'));
        
        const noteSections = document.querySelectorAll('[id$="-section"]');
        noteSections.forEach(section => section.classList.add('hidden'));
        
        const notesSection = document.getElementById(`${subcategory}-section`);
        if (notesSection) {
            notesSection.classList.remove('hidden');
            this.enhanceGoogleDriveLinks(); // Fix links in new section
        }
        
        const backButtonContainer = document.getElementById('backButtonContainer');
        if (backButtonContainer) backButtonContainer.classList.remove('hidden');
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.refreshAOS();
    }

    showCategories() {
        const backToMainButton = document.querySelector('.back-to-main');
        if (backToMainButton) backToMainButton.classList.remove('hidden');
        
        const noteSections = document.querySelectorAll('[id$="-section"]');
        noteSections.forEach(section => section.classList.add('hidden'));
        
        const subcategoryGrids = document.querySelectorAll('.subcategory-grid');
        subcategoryGrids.forEach(grid => grid.classList.remove('hidden'));
        
        const backButtonContainer = document.getElementById('backButtonContainer');
        if (backButtonContainer) backButtonContainer.classList.add('hidden');
        
        this.currentSubcategory = null;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.refreshAOS();
    }

    refreshAOS() {
        if (typeof AOS !== 'undefined') {
            setTimeout(() => AOS.refresh(), 300);
        }
    }

    // MAIN FIX: Enhance Google Drive Links for Preview & Download
    enhanceGoogleDriveLinks() {
        console.log('Enhancing Google Drive links for Preview & Download...');
        
        const allLinks = document.querySelectorAll('a[href*="drive.google.com"], a[href*="docs.google.com"]');
        let enhancedCount = 0;
        
        allLinks.forEach(link => {
            const originalHref = link.href;
            const fileId = this.extractFileId(originalHref);
            
            if (!fileId) return;
            
            // Determine if this is a preview or download button
            const isPreviewBtn = link.classList.contains('preview-btn') || 
                               link.textContent.toLowerCase().includes('preview') ||
                               link.querySelector('i.fa-eye');
            
            const isDownloadBtn = link.classList.contains('download-btn') || 
                                link.textContent.toLowerCase().includes('download') ||
                                link.querySelector('i.fa-download');
            
            if (isPreviewBtn) {
                // ENHANCE PREVIEW LINK
                const previewLink = this.getOptimizedPreviewLink(originalHref, fileId);
                link.href = previewLink;
                link.target = '_blank'; // Open preview in new tab
                link.removeAttribute('download'); // Remove download attr for preview
                enhancedCount++;
                
            } else if (isDownloadBtn) {
                // ENHANCE DOWNLOAD LINK
                const fileType = this.detectFileType(originalHref);
                const downloadLink = this.getDirectDownloadLink(fileId, fileType);
                const fileName = this.getFileNameFromLink(link);
                
                link.href = downloadLink;
                link.setAttribute('download', fileName);
                // Optional: Remove target="_blank" for direct download
                // link.target = '_blank'; // Keep or remove based on preference
                enhancedCount++;
            }
        });
        
        console.log(`Enhanced ${enhancedCount} Google Drive links`);
    }

    // Extract File ID from various Google Drive URL formats
    extractFileId(url) {
        const urlPatterns = [
            /\/d\/([a-zA-Z0-9_-]+)/,
            /id=([a-zA-Z0-9_-]+)/,
            /\/file\/d\/([a-zA-Z0-9_-]+)/,
            /\/document\/d\/([a-zA-Z0-9_-]+)/,
            /\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/,
            /\/presentation\/d\/([a-zA-Z0-9_-]+)/,
            /\/open\?id=([a-zA-Z0-9_-]+)/
        ];
        
        for (const pattern of urlPatterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        
        console.warn('Could not extract file ID:', url);
        return null;
    }

    // Get optimized preview link (opens in Google Drive viewer)
    getOptimizedPreviewLink(originalUrl, fileId) {
        // Check if it's a Google Doc/Sheet/Slide
        if (originalUrl.includes('/document/')) {
            return `${this.googleDriveConfig.docsExport}${fileId}/preview`;
        } else if (originalUrl.includes('/spreadsheets/')) {
            return `${this.googleDriveConfig.sheetsExport}${fileId}/preview`;
        } else if (originalUrl.includes('/presentation/')) {
            return `${this.googleDriveConfig.slidesExport}${fileId}/preview`;
        } else {
            // For regular files (PDF, images, etc.)
            return `${this.googleDriveConfig.previewBase}${fileId}/preview`;
        }
    }

    // Get direct download link (forces download to user's storage)
    getDirectDownloadLink(fileId, fileType = 'pdf') {
        const type = fileType.toLowerCase();
        
        // Google Workspace files - use export endpoints
        switch(type) {
            case 'docs':
            case 'docx':
            case 'document':
                return `${this.googleDriveConfig.docsExport}${fileId}/export?format=docx`;
                
            case 'sheets':
            case 'xlsx':
            case 'spreadsheet':
                return `${this.googleDriveConfig.sheetsExport}${fileId}/export?format=xlsx`;
                
            case 'slides':
            case 'pptx':
            case 'presentation':
                return `${this.googleDriveConfig.slidesExport}${fileId}/export/pptx`;
                
            case 'pdf':
                // Check if it's a Google Doc converted to PDF
                if (this.isGoogleDoc(fileId)) {
                    return `${this.googleDriveConfig.docsExport}${fileId}/export?format=pdf`;
                }
                // Fall through to direct download
                
            default:
                // For all other files (PDF, images, videos, zip, etc.)
                // Using 'confirm=t' bypasses virus scan warning for large files
                return `${this.googleDriveConfig.directDownload}id=${fileId}&confirm=t`;
        }
    }

    // Detect file type from URL
    detectFileType(url) {
        const urlLower = url.toLowerCase();
        
        if (urlLower.includes('/document/') || urlLower.includes('format=docx')) return 'docx';
        if (urlLower.includes('/spreadsheets/') || urlLower.includes('format=xlsx')) return 'xlsx';
        if (urlLower.includes('/presentation/') || urlLower.includes('export/pptx')) return 'pptx';
        if (urlLower.includes('.pdf') || urlLower.includes('format=pdf')) return 'pdf';
        if (urlLower.includes('.jpg') || urlLower.includes('.jpeg')) return 'jpg';
        if (urlLower.includes('.png')) return 'png';
        if (urlLower.includes('.zip')) return 'zip';
        if (urlLower.includes('.mp4') || urlLower.includes('.avi')) return 'video';
        
        return 'pdf'; // default
    }

    // Get file name from link or card
    getFileNameFromLink(link) {
        // Try to get from data attribute first
        if (link.dataset.filename) return link.dataset.filename;
        
        // Try to get from parent note card title
        const noteCard = link.closest('.note-card');
        if (noteCard) {
            const titleElement = noteCard.querySelector('.note-title');
            if (titleElement) {
                const title = titleElement.textContent.trim();
                const fileType = this.detectFileType(link.href);
                const extension = this.getFileExtension(fileType);
                return `${title}.${extension}`;
            }
        }
        
        // Default name
        return `document_${Date.now()}.pdf`;
    }

    // Get file extension
    getFileExtension(fileType) {
        const extensionMap = {
            'pdf': 'pdf',
            'docs': 'pdf',
            'docx': 'docx',
            'sheets': 'xlsx',
            'xlsx': 'xlsx',
            'slides': 'pptx',
            'pptx': 'pptx',
            'jpg': 'jpg',
            'jpeg': 'jpg',
            'png': 'png',
            'zip': 'zip',
            'video': 'mp4'
        };
        return extensionMap[fileType.toLowerCase()] || 'pdf';
    }

    // Check if file is a Google Doc (simplified)
    isGoogleDoc(fileId) {
        // You can implement more sophisticated check if needed
        // For now, return false to use direct download
        return false;
    }

    updateNotesCounts() {
        if (!document.querySelector('.subcategory-grid')) return;
        
        const counts = {};
        const subcategories = Array.from(document.querySelectorAll('.subcategory-card'))
            .map(card => card.dataset.subcategory);
        
        subcategories.forEach(subcategory => {
            const possibleIds = [
                `${subcategory}NotesGrid`,
                `${subcategory.replace(/-([a-z])/g, (g) => g[1].toUpperCase())}NotesGrid`
            ];
            
            let noteCount = 0;
            for (const id of possibleIds) {
                const grid = document.getElementById(id);
                if (grid) {
                    noteCount = grid.querySelectorAll('.note-card').length;
                    break;
                }
            }
            counts[subcategory] = noteCount;
        });
        
        // Update count displays
        document.querySelectorAll('.subcategory-card').forEach(card => {
            const subcategory = card.dataset.subcategory;
            const count = counts[subcategory] || 0;
            const countElement = card.querySelector('.notes-count');
            if (countElement) {
                countElement.textContent = `${count} note${count !== 1 ? 's' : ''} available`;
            }
        });
    }

    // Create new note card with proper preview/download links
    createNoteCard(noteData) {
        const card = document.createElement('div');
        card.className = 'note-card';
        card.setAttribute('data-aos', 'fade-up');
        
        const fileId = noteData.driveId || this.extractFileId(noteData.url);
        const fileType = noteData.fileType || this.detectFileType(noteData.url);
        
        // Get optimized links
        const previewLink = fileId ? 
            this.getOptimizedPreviewLink(noteData.url || '', fileId) : 
            noteData.previewUrl;
        
        const downloadLink = fileId ? 
            this.getDirectDownloadLink(fileId, fileType) : 
            noteData.downloadUrl;
        
        const fileName = `${noteData.title}.${this.getFileExtension(fileType)}`;
        
        card.innerHTML = `
            <div class="note-header">
                <h5 class="note-title">${noteData.title}</h5>
                <p class="note-description">${noteData.description}</p>
            </div>
            <div class="note-body">
                <div class="note-meta">
                    <span class="note-type">${fileType.toUpperCase()}</span>
                    <div class="note-actions">
                        <!-- Preview Button -->
                        <a href="${previewLink}" 
                           class="note-action-btn preview-btn" 
                           target="_blank"
                           title="Preview this document">
                            <i class="fas fa-eye"></i> Preview
                        </a>
                        <!-- Download Button -->
                        <a href="${downloadLink}" 
                           class="note-action-btn download-btn" 
                           download="${fileName}"
                           title="Download to your device">
                            <i class="fas fa-download"></i> Download
                        </a>
                    </div>
                </div>
            </div>
            <div class="note-footer">
                <span class="note-date">${noteData.date}</span>
            </div>
        `;
        
        return card;
    }

    // Add note to specific category
    addNoteToCategory(subcategory, noteData) {
        const grid = document.getElementById(`${subcategory}NotesGrid`);
        if (!grid) return false;
        
        const noteCard = this.createNoteCard(noteData);
        grid.appendChild(noteCard);
        
        this.updateNotesCounts();
        this.refreshAOS();
        return true;
    }
}

// Utility Functions
const NotesUtils = {
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    },

    getPageType: () => {
        if (document.querySelector('.category-cards-grid')) return 'main';
        if (document.querySelector('.subcategory-grid')) return 'subject';
        return 'unknown';
    },

    // Quick fix for individual links (can be called manually)
    fixLink: (linkElement) => {
        if (!window.notesManager) window.notesManager = new NotesManager();
        
        const originalHref = linkElement.href;
        const fileId = window.notesManager.extractFileId(originalHref);
        
        if (!fileId) return false;
        
        const isDownload = linkElement.classList.contains('download-btn') || 
                          linkElement.textContent.toLowerCase().includes('download');
        
        if (isDownload) {
            const fileType = window.notesManager.detectFileType(originalHref);
            linkElement.href = window.notesManager.getDirectDownloadLink(fileId, fileType);
            linkElement.setAttribute('download', '');
            return true;
        }
        return false;
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.notes-hero')) {
        window.notesManager = new NotesManager();
        
        // Additional fixes after dynamic content loads
        setTimeout(() => {
            window.notesManager.updateNotesCounts();
            window.notesManager.enhanceGoogleDriveLinks();
            
            // Set up mutation observer for dynamically added content
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length) {
                        window.notesManager.enhanceGoogleDriveLinks();
                    }
                });
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }, 1000);
    }
});

// Global helper function for manual fixes
window.fixAllDriveLinks = function() {
    if (window.notesManager) {
        window.notesManager.enhanceGoogleDriveLinks();
        alert('✓ All Google Drive links enhanced!\n• Preview buttons open in viewer\n• Download buttons save directly to device');
    }
};