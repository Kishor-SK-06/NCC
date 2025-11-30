// Camps Page JavaScript with All New Camps
document.addEventListener('DOMContentLoaded', function() {
    initializeCampsPage();
});

function initializeCampsPage() {
    AOS.init({
        duration: 600,
        once: true,
        offset: 50
    });

    setupCampButtons();
}

function setupCampButtons() {
    const campButtons = document.querySelectorAll('.camp-btn');
    
    campButtons.forEach(button => {
        button.addEventListener('click', function() {
            const campId = this.getAttribute('data-camp');
            handleCampClick(campId);
        });
    });
}

function handleCampClick(campId) {
    const campURLs = {
        'nsc' : 'camps/nsc.html',
    };

    if (campURLs[campId]) {
        window.location.href = campURLs[campId];
    } else {
        showDevelopmentMessage(campId);
    }
}

function showDevelopmentMessage(campId) {
    const campName = getCampName(campId);
    
    const modal = document.createElement('div');
    modal.className = 'camp-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-icon">
                <i class="fas fa-tools"></i>
            </div>
            <h3>Under Development</h3>
            <p>The detailed page for <strong>${campName}</strong> is currently being developed and will be available soon.</p>
            <button class="modal-close">Understand</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => modal.classList.add('active'), 10);
    
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => closeModal(modal));
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
    
    document.addEventListener('keydown', function closeOnEscape(e) {
        if (e.key === 'Escape') {
            closeModal(modal);
            document.removeEventListener('keydown', closeOnEscape);
        }
    });
}

function closeModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 300);
}

function getCampName(campId) {
    const campNames = {
        'rdc': 'Republic Day Camp (RDC)',
        'ina': 'Indian Naval Academy Camp',
        'yep': 'Youth Exchange Program (YEP)',
        'alc': 'Advance Leadership Camp',
        'nsc': 'Nau Sainik Camp (NSC)',
        'aiyr': 'All India Yachting Regatta (AIYR)',
        'ship': 'Ship Attachment',
        'blc': 'Basic Leadership Camp',
        'spnt': 'Sardar Patel National Trekking (SPNT)',
        'ebsb': 'Ek Bharat Shrestha Camp (EBSB)',
        'snic': 'Sardar Patel National Integration Camp (SNIC)',
        'ssm': 'Saurashtra Samudra Manthan'
    };
    
    return campNames[campId] || 'This Camp';
}

// Utility function to add camp URLs later
function addCampURL(campId, url) {
    console.log(`Camp URL added: ${campId} -> ${url}`);
}