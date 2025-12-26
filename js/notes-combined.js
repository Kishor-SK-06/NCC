/**
 * notes-combined.js
 * Enhanced Notes Management System for Narmada College NCC
 * Handles preview, download, and mobile/desktop compatibility
 */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNotesFunctionality();
    initializeSubcategoryNavigation();
    setupEventListeners();
    initializeAOS();
});

// ========== MAIN INITIALIZATION ==========
function initializeNotesFunctionality() {
    console.log('Initializing NCC Notes System...');
    
    // Detect device type
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    window.isMobileDevice = isMobile;
    
    // Add device class to body
    if (isMobile) {
        document.body.classList.add('mobile-device');
        console.log('Mobile device detected');
    } else {
        document.body.classList.add('desktop-device');
        console.log('Desktop device detected');
    }
    
    // Initialize all note action buttons
    initializeNoteButtons();
}

// ========== SUB-CATEGORY NAVIGATION ==========
function initializeSubcategoryNavigation() {
    const subcategoryCards = document.querySelectorAll('.subcategory-card');
    const backButtonContainer = document.getElementById('backButtonContainer');
    const backToCategoriesBtn = document.getElementById('backToCategories');
    const subcategoryGrid = document.querySelector('.subcategory-grid');
    
    if (!subcategoryCards.length) return;
    
    // Click handler for subcategory cards
    subcategoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const subcategory = this.getAttribute('data-subcategory');
            showSubcategorySection(subcategory);
        });
    });
    
    // Back to categories button handler
    if (backToCategoriesBtn) {
        backToCategoriesBtn.addEventListener('click', function() {
            hideAllSections();
            if (subcategoryGrid) subcategoryGrid.classList.remove('hidden');
            if (backButtonContainer) backButtonContainer.classList.add('hidden');
        });
    }
    
    // Check URL hash for deep linking
    checkUrlHash();
}

function showSubcategorySection(subcategory) {
    const sectionId = `${subcategory}-section`;
    const section = document.getElementById(sectionId);
    const subcategoryGrid = document.querySelector('.subcategory-grid');
    const backButtonContainer = document.getElementById('backButtonContainer');
    
    if (!section) return;
    
    // Hide all sections and show selected
    hideAllSections();
    section.classList.remove('hidden');
    
    // Hide main grid and show back button
    if (subcategoryGrid) subcategoryGrid.classList.add('hidden');
    if (backButtonContainer) backButtonContainer.classList.remove('hidden');
    
    // Update URL hash for bookmarking
    window.location.hash = subcategory;
    
    // Initialize AOS for newly shown elements
    setTimeout(() => {
        AOS.refresh();
    }, 100);
    
    // Scroll to section on mobile
    if (window.isMobileDevice) {
        setTimeout(() => {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }
}

function hideAllSections() {
    const sections = document.querySelectorAll('[id$="-section"]');
    sections.forEach(section => {
        section.classList.add('hidden');
    });
}

function checkUrlHash() {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(`${hash}-section`)) {
        setTimeout(() => {
            showSubcategorySection(hash);
        }, 100);
    }
}

// ========== NOTE BUTTONS FUNCTIONALITY ==========
function initializeNoteButtons() {
    const noteActionButtons = document.querySelectorAll('.note-action-btn');
    
    noteActionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const url = this.getAttribute('href');
            const buttonText = this.textContent.trim().toLowerCase();
            const isPreview = this.innerHTML.includes('fa-eye');
            const isDownload = this.innerHTML.includes('fa-download');
            const isPDF = url.includes('.pdf') || url.includes('drive.google.com/file/d/');
            const isPPT = url.includes('.ppt') || url.includes('docs.google.com/presentation/');
            
            if (isPreview) {
                handlePreview(url, isPDF, isPPT);
            } else if (isDownload) {
                handleDownload(url, isPDF, isPPT, buttonText);
            }
        });
    });
    
    // Add download all functionality for PDF sections
    setupDownloadAllFunctionality();
}

// ========== PREVIEW HANDLERS ==========
function handlePreview(url, isPDF, isPPT) {
    console.log('Preview requested:', url);
    
    if (isPDF) {
        previewPDF(url);
    } else if (isPPT) {
        previewPPT(url);
    } else {
        // Generic preview for other file types
        window.open(url, '_blank');
    }
}

function previewPDF(url) {
    // For Google Drive PDFs
    if (url.includes('drive.google.com/file/d/')) {
        // Convert view link to preview link
        let previewUrl = url;
        if (!url.includes('/preview')) {
            previewUrl = url.replace('/view?', '/preview?');
            if (url.includes('/view?usp=drive_link')) {
                previewUrl = url.replace('/view?usp=drive_link', '/preview');
            }
        }
        
        // Open in new tab for desktop, same tab for mobile
        if (window.isMobileDevice) {
            window.open(previewUrl, '_blank');
        } else {
            // Create modal for PDF preview on desktop
            createPDFModal(previewUrl);
        }
    } else {
        // Direct PDF link
        window.open(url, '_blank');
    }
}

function previewPPT(url) {
    // For Google Slides presentations
    if (url.includes('docs.google.com/presentation/d/')) {
        let previewUrl = url;
        
        // Ensure it's a preview link
        if (!url.includes('/preview')) {
            previewUrl = url.replace('/edit?', '/preview?');
            if (url.includes('/edit?usp=drive_link')) {
                previewUrl = url.replace('/edit?usp=drive_link', '/preview');
            }
        }
        
        // Open in new window with proper size
        const width = window.isMobileDevice ? window.screen.width - 20 : 1000;
        const height = window.isMobileDevice ? window.screen.height - 100 : 700;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;
        
        window.open(previewUrl, 'previewWindow', 
            `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
        );
    } else {
        // Direct PPT link
        window.open(url, '_blank');
    }
}

// ========== DOWNLOAD HANDLERS ==========
function handleDownload(url, isPDF, isPPT, buttonText) {
    console.log('Download requested:', url, 'Button text:', buttonText);
    
    // Special handling for "Modified" and "Original" buttons
    if (buttonText.includes('modified') || buttonText.includes('original')) {
        triggerDirectDownload(url);
        return;
    }
    
    if (isPDF) {
        downloadPDF(url);
    } else if (isPPT) {
        downloadPPT(url);
    } else {
        triggerDirectDownload(url);
    }
}

function downloadPDF(url) {
    // For Google Drive PDFs
    if (url.includes('drive.google.com/file/d/')) {
        // Convert to direct download link
        let downloadUrl = url;
        
        if (url.includes('/preview')) {
            downloadUrl = url.replace('/preview', '/view?usp=sharing');
        } else if (url.includes('/view?')) {
            downloadUrl = url.replace('/view?', '/view?usp=sharing&');
        }
        
        // Ensure it has the export parameter for direct download
        if (!downloadUrl.includes('export=download')) {
            downloadUrl = downloadUrl.replace('/view?', '/export?format=pdf&') || 
                          downloadUrl + '&export=download';
        }
        
        triggerDirectDownload(downloadUrl);
    } else {
        // Direct PDF download
        triggerDirectDownload(url);
    }
}

function downloadPPT(url) {
    // For Google Slides
    if (url.includes('docs.google.com/presentation/d/')) {
        let downloadUrl = url;
        
        // Convert to PPTX download link
        if (url.includes('/edit?')) {
            downloadUrl = url.replace('/edit?', '/export/pptx?');
        } else if (url.includes('/preview')) {
            downloadUrl = url.replace('/preview', '/export/pptx');
        }
        
        // Add export parameters
        if (!downloadUrl.includes('export=pptx')) {
            if (downloadUrl.includes('?')) {
                downloadUrl += '&export=pptx';
            } else {
                downloadUrl += '?export=pptx';
            }
        }
        
        triggerDirectDownload(downloadUrl);
    } else {
        // Direct PPT download
        triggerDirectDownload(url);
    }
}

function triggerDirectDownload(url) {
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.download = ''; // Let browser determine filename
    
    // For mobile devices, open in new tab and let user handle download
    if (window.isMobileDevice) {
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        // For desktop, try to trigger download directly
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        
        // Remove after click
        setTimeout(() => {
            document.body.removeChild(a);
        }, 100);
    }
    
    // Show download confirmation
    showDownloadToast();
}

// ========== PDF MODAL FOR DESKTOP ==========
function createPDFModal(pdfUrl) {
    // Remove existing modal if any
    const existingModal = document.getElementById('pdfPreviewModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal HTML
    const modalHTML = `
        <div id="pdfPreviewModal" class="modal fade" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-xl modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">PDF Preview</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-0">
                        <iframe src="${pdfUrl}" 
                                frameborder="0" 
                                style="width: 100%; height: 70vh;"
                                allowfullscreen>
                        </iframe>
                    </div>
                    <div class="modal-footer">
                        <a href="${pdfUrl.replace('/preview', '/view?usp=sharing')}" 
                           class="btn btn-primary" 
                           target="_blank" 
                           download>
                            <i class="fas fa-download me-2"></i>Download PDF
                        </a>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Append modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Initialize and show modal
    const modalElement = document.getElementById('pdfPreviewModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
    
    // Clean up on close
    modalElement.addEventListener('hidden.bs.modal', function() {
        modalElement.remove();
    });
}

// ========== DOWNLOAD ALL FUNCTIONALITY ==========
function setupDownloadAllFunctionality() {
    // Check for complete PDF sections
    const completeSections = document.querySelectorAll('[id$="complete-section"]');
    
    completeSections.forEach(section => {
        const downloadAllBtn = document.createElement('button');
        downloadAllBtn.className = 'btn btn-success mb-4';
        downloadAllBtn.innerHTML = '<i class="fas fa-download me-2"></i>Download All Notes in this Category';
        
        downloadAllBtn.addEventListener('click', function() {
            downloadAllNotesInSection(section);
        });
        
        // Insert button after title
        const title = section.querySelector('.subcategory-title');
        if (title) {
            title.parentNode.insertBefore(downloadAllBtn, title.nextSibling);
        }
    });
}

function downloadAllNotesInSection(section) {
    const noteCards = section.querySelectorAll('.note-card');
    const downloadPromises = [];
    
    noteCards.forEach(card => {
        const downloadBtn = card.querySelector('.note-action-btn[href*="download"], .note-action-btn:has(.fa-download)');
        if (downloadBtn) {
            const url = downloadBtn.getAttribute('href');
            downloadPromises.push(triggerSequentialDownload(url));
        }
    });
    
    // Show progress
    if (downloadPromises.length > 0) {
        showToast(`Starting download of ${downloadPromises.length} files...`, 'info');
        
        // Sequential download to avoid browser blocking
        downloadSequentially(downloadPromises, 0);
    }
}

function downloadSequentially(promises, index) {
    if (index >= promises.length) {
        showToast('All downloads completed!', 'success');
        return;
    }
    
    promises[index]().then(() => {
        setTimeout(() => {
            downloadSequentially(promises, index + 1);
        }, 1000); // 1 second delay between downloads
    });
}

function triggerSequentialDownload(url) {
    return function() {
        return new Promise((resolve) => {
            const a = document.createElement('a');
            a.href = url;
            a.target = '_blank';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            
            setTimeout(() => {
                document.body.removeChild(a);
                resolve();
            }, 500);
        });
    };
}

// ========== UTILITY FUNCTIONS ==========
function setupEventListeners() {
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            AOS.refresh();
        }, 250);
    });
    
    // Handle escape key to go back
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const backBtn = document.getElementById('backToCategories');
            if (backBtn && !backBtn.classList.contains('hidden')) {
                backBtn.click();
            }
        }
    });
}

function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 600,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100
        });
    }
}

function showDownloadToast() {
    showToast('Download started. Check your downloads folder.', 'success');
}

function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.custom-toast');
    existingToasts.forEach(toast => toast.remove());
    
    // Create toast
    const toastHTML = `
        <div class="custom-toast toast align-items-center text-bg-${type} border-0 position-fixed" 
             style="bottom: 20px; right: 20px; z-index: 9999;">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', toastHTML);
    
    // Initialize and show toast
    const toastElement = document.querySelector('.custom-toast');
    const toast = new bootstrap.Toast(toastElement, {
        delay: 3000
    });
    toast.show();
    
    // Remove after hide
    toastElement.addEventListener('hidden.bs.toast', function() {
        toastElement.remove();
    });
}

// ========== MOBILE SPECIFIC ENHANCEMENTS ==========
function setupMobileEnhancements() {
    if (!window.isMobileDevice) return;
    
    // Add touch feedback for cards
    const cards = document.querySelectorAll('.subcategory-card, .note-card');
    cards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('touchstart', function() {
            this.style.opacity = '0.7';
        });
        card.addEventListener('touchend', function() {
            this.style.opacity = '1';
        });
    });
    
    // Prevent zoom on double tap
    let lastTap = 0;
    document.addEventListener('touchend', function(e) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        if (tapLength < 500 && tapLength > 0) {
            e.preventDefault();
        }
        lastTap = currentTime;
    }, false);
}

// Initialize mobile enhancements
setupMobileEnhancements();

// ========== ERROR HANDLING ==========
window.addEventListener('error', function(e) {
    console.error('Notes system error:', e.error);
    showToast('An error occurred. Please try again.', 'danger');
});

// Export functions for debugging (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeNotesFunctionality,
        handlePreview,
        handleDownload,
        previewPDF,
        downloadPDF
    };
}