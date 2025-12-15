// Notes Manager - Complete Solution with Mobile Support
class NotesManager {
    constructor() {
        this.currentSubcategory = null;
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
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
        this.enhanceGoogleDriveLinks();
        console.log(`NotesManager initialized (Mobile: ${this.isMobile})`);
    }

    initializeAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                once: true,
                offset: 100,
                disable: this.isMobile ? true : false // Disable AOS on mobile for performance
            });
        }
    }

    initializeEventListeners() {
        if (document.querySelector('.subcategory-grid')) {
            this.initializeSubcategoryNavigation();
        }
        
        // Add mobile-specific download handlers
        if (this.isMobile) {
            this.addMobileDownloadListeners();
        }
    }

    addMobileDownloadListeners() {
        document.addEventListener('click', (e) => {
            const downloadBtn = e.target.closest('.download-btn');
            if (downloadBtn) {
                e.preventDefault();
                this.handleMobileDownload(downloadBtn);
            }
        });
    }

    handleMobileDownload(linkElement) {
        const originalHref = linkElement.getAttribute('href');
        const fileName = linkElement.getAttribute('download') || 'document.pdf';
        
        // For mobile, we need a different approach
        if (this.isIOS()) {
            this.handleIOSDownload(originalHref, fileName, linkElement);
        } else if (this.isAndroid()) {
            this.handleAndroidDownload(originalHref, fileName, linkElement);
        } else {
            // For other mobile browsers, try to force download
            this.forceMobileDownload(originalHref, fileName, linkElement);
        }
    }

    isIOS() {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    }

    isAndroid() {
        return /Android/i.test(navigator.userAgent);
    }

    handleIOSDownload(url, fileName, linkElement) {
        // iOS requires special handling
        const tempLink = document.createElement('a');
        tempLink.href = url;
        tempLink.setAttribute('download', fileName);
        tempLink.setAttribute('target', '_blank');
        
        // Create a hidden iframe for the download
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;
        document.body.appendChild(iframe);
        
        // Show user instructions
        this.showMobileInstructions('iOS', fileName);
        
        // Fallback: Open in new tab
        setTimeout(() => {
            window.open(url, '_blank');
        }, 1000);
    }

    handleAndroidDownload(url, fileName, linkElement) {
        // For Android, try to force download with blob
        this.downloadViaBlob(url, fileName).then(success => {
            if (!success) {
                // Fallback: Open in new tab
                window.open(url, '_blank');
                this.showMobileInstructions('Android', fileName);
            }
        });
    }

    async downloadViaBlob(url, fileName) {
        try {
            const response = await fetch(url, { mode: 'cors' });
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up
            window.URL.revokeObjectURL(blobUrl);
            return true;
        } catch (error) {
            console.error('Blob download failed:', error);
            return false;
        }
    }

    forceMobileDownload(url, fileName, linkElement) {
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        const downloadUrl = url.includes('?') ? 
            `${url}&t=${timestamp}&force_download=true` : 
            `${url}?t=${timestamp}&force_download=true`;
        
        // Try to open in new window/tab
        const newWindow = window.open(downloadUrl, '_blank');
        
        if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
            // If popup blocked, redirect current page
            window.location.href = downloadUrl;
        }
        
        this.showMobileInstructions('mobile', fileName);
    }

    showMobileInstructions(platform, fileName) {
        const message = platform === 'iOS' ? 
            `To download "${fileName}", tap and hold the link, then select "Download Linked File"` :
            `Downloading "${fileName}". If it opens instead of downloading, use browser menu → Download`;
        
        // Create a temporary notification
        this.showNotification(message, 5000);
        
        console.log(`Mobile ${platform} download: ${fileName}`);
    }

    showNotification(message, duration = 3000) {
        // Remove existing notification if any
        const existing = document.getElementById('mobile-download-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.id = 'mobile-download-notification';
        notification.innerHTML = `
            <style>
                #mobile-download-notification {
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0, 0, 0, 0.9);
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    z-index: 9999;
                    font-size: 14px;
                    text-align: center;
                    max-width: 90%;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    animation: slideDown 0.3s ease;
                }
                @keyframes slideDown {
                    from { top: -100px; }
                    to { top: 20px; }
                }
            </style>
            <div>${message}</div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after duration
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, duration);
    }

    // MAIN FIX: Enhanced mobile download links
    enhanceGoogleDriveLinks() {
        console.log('Enhancing Google Drive links for all devices...');
        
        const allLinks = document.querySelectorAll('a[href*="drive.google.com"], a[href*="docs.google.com"]');
        
        allLinks.forEach(link => {
            const originalHref = link.getAttribute('href');
            const fileId = this.extractFileId(originalHref);
            
            if (!fileId) return;
            
            const isPreviewBtn = link.classList.contains('preview-btn') || 
                               link.textContent.toLowerCase().includes('preview') ||
                               link.querySelector('i.fa-eye');
            
            const isDownloadBtn = link.classList.contains('download-btn') || 
                                link.textContent.toLowerCase().includes('download') ||
                                link.querySelector('i.fa-download');
            
            if (isPreviewBtn) {
                this.enhancePreviewLink(link, fileId, originalHref);
            } else if (isDownloadBtn) {
                this.enhanceDownloadLink(link, fileId, originalHref);
            }
        });
        
        console.log(`Enhanced ${allLinks.length} Google Drive links`);
    }

    enhancePreviewLink(link, fileId, originalUrl) {
        const previewLink = this.getOptimizedPreviewLink(originalUrl, fileId);
        link.href = previewLink;
        link.target = '_blank';
        link.removeAttribute('download');
        
        // Add mobile preview hint
        if (this.isMobile) {
            link.setAttribute('title', 'Tap to preview (opens in new tab)');
        }
    }

    enhanceDownloadLink(link, fileId, originalUrl) {
        const fileType = this.detectFileType(originalUrl);
        const downloadLink = this.getMobileOptimizedDownloadLink(fileId, fileType);
        const fileName = this.getFileNameFromLink(link);
        
        link.href = downloadLink;
        link.setAttribute('download', fileName);
        
        // For mobile, add data attributes for better handling
        if (this.isMobile) {
            link.setAttribute('data-file-id', fileId);
            link.setAttribute('data-file-type', fileType);
            link.setAttribute('data-file-name', fileName);
            link.setAttribute('title', 'Tap to download (may open in viewer first)');
            
            // Add download icon with mobile-specific class
            if (!link.querySelector('i')) {
                link.innerHTML = '<i class="fas fa-download"></i> Download';
            }
        } else {
            // For desktop, ensure proper download attribute
            link.setAttribute('title', 'Click to download directly to your device');
        }
    }

    // MOBILE-OPTIMIZED Download Link Generator
    getMobileOptimizedDownloadLink(fileId, fileType) {
        const type = fileType.toLowerCase();
        
        // For mobile, we need to handle Google Workspace files differently
        switch(type) {
            case 'docs':
            case 'docx':
                return `${this.googleDriveConfig.docsExport}${fileId}/export?format=docx&mobile=1`;
                
            case 'sheets':
            case 'xlsx':
                return `${this.googleDriveConfig.sheetsExport}${fileId}/export?format=xlsx&mobile=1`;
                
            case 'slides':
            case 'pptx':
                // For PowerPoint files on mobile, force download
                return `${this.googleDriveConfig.slidesExport}${fileId}/export/pptx?forcedownload=1`;
                
            case 'pdf':
                // For mobile PDFs, try to force download
                return `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t&mobile=1`;
                
            default:
                // For all other files on mobile
                return `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t&mobile=1&forcedownload=1`;
        }
    }

    getOptimizedPreviewLink(originalUrl, fileId) {
        if (originalUrl.includes('/document/')) {
            return `${this.googleDriveConfig.docsExport}${fileId}/preview`;
        } else if (originalUrl.includes('/spreadsheets/')) {
            return `${this.googleDriveConfig.sheetsExport}${fileId}/preview`;
        } else if (originalUrl.includes('/presentation/')) {
            return `${this.googleDriveConfig.slidesExport}${fileId}/preview`;
        } else {
            return `${this.googleDriveConfig.previewBase}${fileId}/preview`;
        }
    }

    extractFileId(url) {
        const patterns = [
            /\/d\/([a-zA-Z0-9_-]+)/,
            /id=([a-zA-Z0-9_-]+)/,
            /\/file\/d\/([a-zA-Z0-9_-]+)/,
            /\/document\/d\/([a-zA-Z0-9_-]+)/,
            /\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/,
            /\/presentation\/d\/([a-zA-Z0-9_-]+)/
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) return match[1];
        }
        return null;
    }

    detectFileType(url) {
        const urlLower = url.toLowerCase();
        
        if (urlLower.includes('/document/') || urlLower.includes('format=docx')) return 'docx';
        if (urlLower.includes('/spreadsheets/') || urlLower.includes('format=xlsx')) return 'xlsx';
        if (urlLower.includes('/presentation/') || urlLower.includes('export/pptx')) return 'pptx';
        if (urlLower.includes('.pdf') || urlLower.includes('format=pdf')) return 'pdf';
        return 'pdf';
    }

    getFileNameFromLink(link) {
        if (link.dataset.filename) return link.dataset.filename;
        
        const noteCard = link.closest('.note-card');
        if (noteCard) {
            const titleElement = noteCard.querySelector('.note-title');
            if (titleElement) {
                const title = titleElement.textContent.trim();
                const fileType = this.detectFileType(link.href);
                const extension = this.getFileExtension(fileType);
                return `${title.replace(/[^\w\s]/gi, '')}.${extension}`;
            }
        }
        
        return `document_${Date.now()}.pdf`;
    }

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
            'png': 'png'
        };
        return extensionMap[fileType.toLowerCase()] || 'pdf';
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
            this.enhanceGoogleDriveLinks(); // Re-enhance links in new section
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
        
        document.querySelectorAll('.subcategory-card').forEach(card => {
            const subcategory = card.dataset.subcategory;
            const count = counts[subcategory] || 0;
            const countElement = card.querySelector('.notes-count');
            if (countElement) {
                countElement.textContent = `${count} note${count !== 1 ? 's' : ''} available`;
            }
        });
    }
}

// Mobile-specific utility
const MobileDownloadHelper = {
    init() {
        this.addMobileStyles();
    },
    
    addMobileStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Mobile download button styles */
            .download-btn.mobile-download {
                position: relative;
            }
            
            .download-btn.mobile-download:after {
                content: '📱';
                font-size: 12px;
                margin-left: 5px;
            }
            
            /* Mobile notification */
            .mobile-download-hint {
                display: none;
                position: absolute;
                background: #333;
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                z-index: 1000;
                max-width: 200px;
                text-align: center;
            }
            
            @media (max-width: 768px) {
                .download-btn {
                    padding: 12px 20px;
                    font-size: 16px;
                }
                
                .mobile-download-hint {
                    display: block;
                }
            }
        `;
        document.head.appendChild(style);
    },
    
    showHint(element, message) {
        const hint = document.createElement('div');
        hint.className = 'mobile-download-hint';
        hint.textContent = message;
        
        const rect = element.getBoundingClientRect();
        hint.style.top = `${rect.bottom + 10}px`;
        hint.style.left = `${rect.left}px`;
        
        document.body.appendChild(hint);
        
        setTimeout(() => hint.remove(), 3000);
    }
};

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.notes-hero')) {
        window.notesManager = new NotesManager();
        
        // Initialize mobile helper
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            MobileDownloadHelper.init();
        }
        
        // Add test/debug mode
        setTimeout(() => {
            console.log(`
            📱 MOBILE DOWNLOAD SUPPORT ENABLED
            ================================
            Device: ${navigator.userAgent.match(/iPhone|iPad|iPod|Android/i) ? 'Mobile' : 'Desktop'}
            User Agent: ${navigator.userAgent.substring(0, 80)}...
            Download buttons: ${document.querySelectorAll('.download-btn').length}
            Preview buttons: ${document.querySelectorAll('.preview-btn').length}
            ================================
            `);
            
            // Test a download link
            const testLink = document.querySelector('.download-btn');
            if (testLink) {
                console.log('Sample download link:', testLink.href);
                console.log('Has download attr:', testLink.hasAttribute('download'));
            }
        }, 1000);
    }
});

// Export for global use
window.MobileDownloadHelper = MobileDownloadHelper;