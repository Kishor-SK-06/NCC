// Homepage specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Homepage JS loaded');
    
    // Add hover effects to hierarchy images (Homepage specific)
    const hierarchyImages = document.querySelectorAll('.hierarchy-img');
    hierarchyImages.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Add click effect to cards (Homepage specific)
    const cards = document.querySelectorAll('.modern-card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            setTimeout(() => {
                this.style.transform = 'translateY(-10px) scale(1)';
            }, 150);
        });
    });

    // Leader image loading handler (Homepage specific)
    const leaderImages = document.querySelectorAll('.leader-card img');
    leaderImages.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
        
        // Fallback in case image is already loaded
        if (img.complete) {
            img.classList.add('loaded');
        }
    });

    // Homepage specific animations
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.01)';
        });
        
        heroSection.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
        });
    }
});

// Homepage specific functions
const HomepageUtils = {
    // Function to handle hierarchy card interactions
    initHierarchyCards: function() {
        const hierarchyCards = document.querySelectorAll('#hierarchy .modern-card');
        hierarchyCards.forEach((card, index) => {
            card.addEventListener('mouseenter', function() {
                this.style.zIndex = '10';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.zIndex = '1';
            });
        });
    },

    // Function to handle leader card statistics
    animateLeaderStats: function() {
        const statItems = document.querySelectorAll('.stat-item h5');
        statItems.forEach(stat => {
            const originalText = stat.textContent;
            stat.addEventListener('mouseover', function() {
                this.style.transform = 'scale(1.2)';
                this.style.color = 'var(--accent)';
            });
            
            stat.addEventListener('mouseout', function() {
                this.style.transform = 'scale(1)';
                this.style.color = '';
            });
        });
    }
};

// Initialize homepage specific features
document.addEventListener('DOMContentLoaded', function() {
    HomepageUtils.initHierarchyCards();
    HomepageUtils.animateLeaderStats();
});

// Disclaimer Popup functionality
class DisclaimerPopup {
    constructor() {
        this.popup = document.getElementById('welcomePopup');
        this.closeBtn = document.getElementById('closePopup');
        this.understandBtn = document.getElementById('understandButton');
        this.photoContainer = document.getElementById('photoContainer');
        this.popupPhoto = document.getElementById('popupPhoto');
        this.hasAgreed = sessionStorage.getItem('disclaimerAgreed');
        
        this.init();
    }
    
    init() {
        // Handle image loading errors
        this.handleImageError();
        
        // Show popup on page load (only once per session)
        if (!this.hasAgreed) {
            setTimeout(() => {
                this.showPopup();
            }, 1000); // Show after 1 seconds
        }
        
        // Event listeners - ONLY close button and agree button can close the popup
        this.closeBtn.addEventListener('click', () => this.hidePopup());
        this.understandBtn.addEventListener('click', () => this.agreeAndClose());
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.popup.style.display === 'flex') {
                this.hidePopup();
            }
        });
    }
    
    handleImageError() {
        // Check if image loaded successfully
        this.popupPhoto.onerror = () => {
            this.popupPhoto.style.display = 'none';
            this.photoContainer.innerHTML = '<i class="fas fa-user-graduate fa-3x" style="color: var(--primary); margin-top: 50px;"></i>';
        };
        
        // If image is already broken, replace it
        if (this.popupPhoto.complete && this.popupPhoto.naturalHeight === 0) {
            this.popupPhoto.style.display = 'none';
            this.photoContainer.innerHTML = '<i class="fas fa-user-graduate fa-3x" style="color: var(--primary); margin-top: 50px;"></i>';
        }
    }
    
    showPopup() {
        this.popup.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Add entrance animation
        const modal = this.popup.querySelector('.popup-modal');
        modal.style.animation = 'popupSlideIn 0.5s ease-out';
    }
    
    hidePopup() {
        this.popup.style.display = 'none';
        document.body.style.overflow = '';
        
        // Add exit animation
        const modal = this.popup.querySelector('.popup-modal');
        modal.style.animation = 'popupSlideOut 0.3s ease-in';
        
        setTimeout(() => {
            modal.style.animation = '';
        }, 300);
    }
    
    agreeAndClose() {
        // Mark as agreed in session storage
        sessionStorage.setItem('disclaimerAgreed', 'true');
        
        // Visual feedback
        this.understandBtn.innerHTML = '<i class="fas fa-thumbs-up me-2"></i> Thank You!';
        this.understandBtn.style.background = 'linear-gradient(135deg, #4caf50, #45a049)';
        this.understandBtn.disabled = true; // Prevent multiple clicks
        
        setTimeout(() => {
            this.hidePopup();
            // Reset button after popup closes (for future use)
            setTimeout(() => {
                this.understandBtn.innerHTML = '<i class="fas fa-check-circle me-2"></i> I Understand & Agree';
                this.understandBtn.style.background = '';
                this.understandBtn.disabled = false;
            }, 300);
        }, 1000);
    }
}

// Add exit animation to CSS
const disclaimerStyle = document.createElement('style');
disclaimerStyle.textContent = `
    @keyframes popupSlideOut {
        from {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        to {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
        }
    }
`;
document.head.appendChild(disclaimerStyle);

// Complete Important Dates Data from PDF
const importantDates = [
    // January
    {
        date: "January 04",
        name: "World Braille Day",
        objective: "To recognize efforts of Luis Braille who invented the Braille language which helps blind people to read and write.",
        categories: ["international", "education"]
    },
    {
        date: "January 09",
        name: "Pravasi Bhartiya Divas (NRI Day)",
        objective: "The day commemorates the return of Mahatma Gandhi from South Africa in Bombay on 9 January 1915.",
        categories: ["national", "cultural"]
    },
    {
        date: "January 10",
        name: "World Hindi Day",
        objective: "To promote the use of Hindi language abroad and to mark the anniversary of first World Hindi Conference which was held in 1975.",
        categories: ["international", "cultural"]
    },
    {
        date: "January 12",
        name: "National Youth Day",
        objective: "To commemorate the birthday of great spiritual leader, Swami Vivekananda.",
        categories: ["national", "cultural"]
    },
    {
        date: "January 15",
        name: "Indian Army Day",
        objective: "In recognition of Lieutenant General K. M. Cariappa becoming the first Indian Commander-in-Chief in 1948.",
        categories: ["national", "armed-forces", "army"]
    },
    {
        date: "January 23",
        name: "Desh Prem Divas",
        objective: "To celebrate the birth anniversary of Netaji Subhash Chandra Bose.",
        categories: ["national", "cultural"]
    },
    {
        date: "January 24",
        name: "National Girl Child Day",
        objective: "To create awareness among people about the inequalities faced by the girl child in the society.",
        categories: ["national", "social"]
    },
    {
        date: "January 25",
        name: "National Voters Day",
        objective: "To increase participation of citizens of the country in the political process.",
        categories: ["national", "social"]
    },
    {
        date: "January 25",
        name: "National Tourism Day",
        objective: "To raise awareness about the importance of tourism for the Indian economy.",
        categories: ["national", "cultural"]
    },
    {
        date: "January 26",
        name: "International Customs Day",
        objective: "To commemorate the very first official conference of the Customs Co-operation Council i.e. World Customs Organization.",
        categories: ["international"]
    },
    {
        date: "January 26",
        name: "India's Republic Day",
        objective: "On this day, the Constitution of India came into force and replaced the existing Government of India Act,1935.",
        categories: ["national"]
    },
    {
        date: "January 30",
        name: "World Leprosy Eradication Day",
        objective: "To increase awareness among people regarding Leprosy or Hansen's Disease.",
        categories: ["international", "health"]
    },
    {
        date: "January 30",
        name: "Martyr's Day / Mahatma Gandhi Death Anniversary",
        objective: "To honour those who lost their lives defending the sovereignty of the nation.",
        categories: ["national", "cultural"]
    },

    // February
    {
        date: "February 02",
        name: "World Wetland day",
        objective: "To mark the date of the signing of the Convention on Wetlands, on 2 February 1971, in the Iranian city of Ramsar on the shores of the Caspian Sea.",
        categories: ["international", "environment"]
    },
    {
        date: "February 04",
        name: "World Cancer Day",
        objective: "To raise awareness of cancer and to encourage its prevention, detection and treatment.",
        categories: ["international", "health"]
    },
    {
        date: "February 06",
        name: "International Day of zero Tolerance to Female Genital Mutilation",
        objective: "To raise awareness about the female genital mutilation and to promote its eradication.",
        categories: ["international", "social", "health"]
    },
    {
        date: "February 11",
        name: "International Day Women and Girls in Science",
        objective: "To highlight the achievement of female, equal participation and access in the science field.",
        categories: ["international", "science", "social"]
    },
    {
        date: "February 13",
        name: "World Radio Day",
        objective: "To celebrate radio as a medium to promote and access information.",
        categories: ["international", "cultural"]
    },
    {
        date: "February 20",
        name: "World day of Social Justice",
        objective: "To promote efforts to tackle issues such as poverty, exclusion, and unemployment.",
        categories: ["international", "social"]
    },
    {
        date: "February 21",
        name: "International Mother Language Day",
        objective: "To promote awareness of linguistic and cultural diversity and multilingualism.",
        categories: ["international", "cultural", "education"]
    },
    {
        date: "February 24",
        name: "Central Excise Day",
        objective: "To encourage the employees of excise department to carry out the central excised duty all over India in a better way to prevent corruption.",
        categories: ["national"]
    },
    {
        date: "February 28",
        name: "National Science Day",
        objective: "To mark the discovery of Raman Effect by C V Raman on 28th February 1928.",
        categories: ["national", "science"]
    },

    // March
    {
        date: "March 04",
        name: "National Security Day",
        objective: "To praise the work of security forces who plays a major role in the security of people of the nation.",
        categories: ["national", "armed-forces"]
    },
    {
        date: "March 08",
        name: "International Women's Day",
        objective: "To celebrate social, economic, cultural and political achievements of women.",
        categories: ["international", "social"]
    },
    {
        date: "March 15",
        name: "World Consumer Rights Day",
        objective: "To promote the basic rights of all consumers and to demand that those rights are protected.",
        categories: ["international", "social"]
    },
    {
        date: "March 22",
        name: "World Water Day",
        objective: "To create awareness about the importance of water and conservation of water for future generation.",
        categories: ["international", "environment"]
    },
    {
        date: "March 23",
        name: "World Meteorological Day",
        objective: "To commemorate the establishment of the World Meteorological Organization to keep the constant watch on the weather and climate for better life and future.",
        categories: ["international", "science"]
    },
    {
        date: "March 23",
        name: "Martyrs Day",
        objective: "On this day, Indians pay homage to three martyrs who sacrificed their lives for the country-Bhagat Singh, Sukhdev Thapar, and Shivaram Rajguru.",
        categories: ["national", "cultural"]
    },

    // April
    {
        date: "April 05",
        name: "National Maritime Day",
        objective: "To commemorate the maiden voyage of the first Indian vessel S S Loyalty of the Scindia Steam Navigation Company from Mumbai to the UK.",
        categories: ["national", "navy"]
    },
    {
        date: "April 22",
        name: "World Earth Day",
        objective: "To increase the awareness among people about environment safety as well as to demonstrate the environmental protection measures.",
        categories: ["international", "environment"]
    },

    // May
    {
        date: "May 01",
        name: "International Labour day",
        objective: "To celebrate achievements of workers in achieving economic and social rights all over the world.",
        categories: ["international", "social"]
    },
    {
        date: "May 11",
        name: "National Technology Day",
        objective: "To commemorate the history of India's technological innovations and excellence.",
        categories: ["national", "science"]
    },

    // June
    {
        date: "June 05",
        name: "World Environment Day",
        objective: "For encouraging worldwide awareness and action for the protection of our environment.",
        categories: ["international", "environment"]
    },
    {
        date: "June 21",
        name: "International Yoga Day",
        objective: "To encourage the practice of Yoga & Meditation, creating awareness about Yoga and its benefits in daily life.",
        categories: ["international", "health"]
    },

    // July
    {
        date: "July 01",
        name: "National Doctor's Day",
        objective: "To honour the legendary physician and the second Chief Minister of West Bengal, Dr. B C Roy and to lay emphasis on the value of doctors in our lives.",
        categories: ["national", "health"]
    },
    {
        date: "July 26",
        name: "Kargil Vijay Divas",
        objective: "To honour Kargil war heroes, who laid down their lives fighting infiltrators from Pakistan who had occupied Indian positions on the Line of Control (LOC) in Kargil and Dras sectors, Ladakh.",
        categories: ["national", "armed-forces", "army"]
    },

    // August
    {
        date: "August 07",
        name: "National Handloom Day",
        objective: "To highlight the contribution of handloom to the socioeconomic development of the country and promote handlooms to increase the income of weavers and also enhance their pride.",
        categories: ["national", "cultural"]
    },
    {
        date: "August 15",
        name: "Indian Independence Day",
        objective: "To commemorate the nation's independence from British Empire on 15th August 1947 and to promote patriotism.",
        categories: ["national"]
    },
    {
        date: "August 29",
        name: "National Sports Day",
        objective: "To mark the birth anniversary of the hockey player, Dhyan Chand, who won gold medals in Olympics for India in the years 1928,1932 and 1936.",
        categories: ["national", "armed-forces"]
    },

    // September
    {
        date: "September 05",
        name: "National Teacher's Day",
        objective: "To commemorate the birth anniversary of Dr. Sarvepalli Radhakrishnan and to give tribute to the contributions made by the teachers to the society.",
        categories: ["national", "education"]
    },
    {
        date: "September 08",
        name: "International Day of Literacy",
        objective: "To highlight the importance of literacy to individuals, communities and societies.",
        categories: ["international", "education"]
    },

    // October
    {
        date: "October 02",
        name: "International day of Non-violence",
        objective: "To mark the birth anniversary of Mahatma Gandhi and to disseminate the message of non-violence, including through education and public awareness.",
        categories: ["international", "national", "cultural"]
    },
    {
        date: "October 08",
        name: "Indian Air Force Day",
        objective: "To increase awareness about Indian Airforce, to secure Indian airspace and to conduct aerial warfare during a conflict.",
        categories: ["national", "armed-forces", "air-force"]
    },
    {
        date: "October 31",
        name: "National Unity Day",
        objective: "To commemorate the birth anniversary of Independent India's first Deputy Prime Minister Sardar Vallabhai Patel.",
        categories: ["national", "cultural"]
    },

    // November
    {
        date: "November 14",
        name: "Children's Day",
        objective: "To mark the birth anniversary of India's first Prime Minister Pandit Jawaharlal Nehru and to encourage the welfare of children all over the country.",
        categories: ["national", "social"]
    },
    {
        date: "November 16",
        name: "National Press Day",
        objective: "To mark the day on which the Press Council of India started functioning.",
        categories: ["national", "armed-forces"]
    },
    {
        date: "November 19",
        name: "National Integration Day",
        objective: "To mark the birth anniversary of India's first woman Prime Minister Indira Gandhi and to enhance love and unity among people all across the country.",
        categories: ["national", "cultural"]
    },
    {
        date: "November 26",
        name: "Constitution Day (Samvidhan Diwas)",
        objective: "To commemorate the adoption of Constitution and to spread thoughts and ideas of Dr. B.R. Ambedkar.",
        categories: ["national", "cultural"]
    },
    {
        date: "November (4th Sunday)",
        name: "National Cadet Corps Day (NCC Day)",
        objective: "Celebrates the founding of the National Cadet Corps on November 28, 1948. NCC Day is observed on the 4th Sunday of November each year to honor the contributions of NCC cadets.",
        categories: ["national", "armed-forces", "education", "cultural"]
    },

    // December
    {
        date: "December 04",
        name: "Indian Navy Day",
        objective: "To celebrate the magnificence, achievements and role of the naval force to the country.",
        categories: ["national", "armed-forces", "navy"]
    },
    {
        date: "December 07",
        name: "Indian Armed Forces Flag Day",
        objective: "To collect funds from people of India for the welfare of the Indian Armed Forces personnel.",
        categories: ["national", "armed-forces"]
    },
    {
        date: "December 16",
        name: "Vijay Diwas",
        objective: "To mark the anniversary of the win of Indian Army in the Indo-Pak war on 16th December 1971.",
        categories: ["national", "armed-forces", "army"]
    },
    {
        date: "December 25",
        name: "Christmas Day",
        objective: "To mark the birth anniversary of Jesus Christ.",
        categories: ["international", "cultural"]
    },
    {
        date: "December 25",
        name: "Good Governance Day",
        objective: "To mark the birth anniversary of former Prime Minister Atal Bihari Vajpayee and to foster among the Indian people the accountability in government.",
        categories: ["national"]
    }
];

// Calendar System - FIXED VERSION
class ImportantDatesCalendar {
    constructor() {
        this.importantDates = [...importantDates];
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // DOM Elements
        this.elements = {
            calendarBtn: document.getElementById('calendarBtn'),
            calendarModal: document.getElementById('calendarModal'),
            closeModal: document.getElementById('closeModal'),
            datesContainer: document.getElementById('datesContainer'),
            datesCount: document.getElementById('datesCount'),
            modalFilter: document.getElementById('modalFilter'),
            dateSearch: document.getElementById('dateSearch')
        };
        
        this.init();
    }
    
    init() {
        console.log('Calendar system initialized');
        console.log('Is mobile device:', this.isMobile);
        this.setupEventListeners();
        this.loadAllDates();
        this.addCalendarStyles();
    }
    
    setupEventListeners() {
        // Open calendar
        this.elements.calendarBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.openCalendar();
        });
        
        // Close button
        this.elements.closeModal.addEventListener('click', () => {
            this.closeCalendar();
        });
        
        // Close on overlay click
        this.elements.calendarModal.addEventListener('click', (e) => {
            if (e.target === this.elements.calendarModal) {
                this.closeCalendar();
            }
        });
        
        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.elements.calendarModal.style.display === 'block') {
                this.closeCalendar();
            }
        });
        
        // Filter change
        this.elements.modalFilter.addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.loadAllDates();
        });
        
        // Search input
        this.elements.dateSearch.addEventListener('input', (e) => {
            this.currentSearch = e.target.value.trim().toLowerCase();
            this.loadAllDates();
        });
        
        // For better mobile UX: Add click handler for the search input
        this.elements.dateSearch.addEventListener('click', () => {
            // Allow focus when user intentionally clicks
            if (this.isMobile) {
                // On mobile, focus is okay when user clicks
                this.elements.dateSearch.focus();
            }
        });
    }
    
    openCalendar() {
        console.log('Opening calendar');
        console.log('Mobile device:', this.isMobile);
        this.elements.calendarModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Reset and refresh
        this.elements.modalFilter.value = 'all';
        this.elements.dateSearch.value = '';
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.loadAllDates();
        
        // FIX: Only auto-focus on desktop, not mobile
        if (!this.isMobile) {
            // Auto-focus on desktop for better UX
            setTimeout(() => {
                this.elements.dateSearch.focus();
            }, 100);
        } else {
            // On mobile, ensure input is not focused to prevent keyboard popup
            this.elements.dateSearch.blur();
            // Add a visual hint for mobile users
            this.showMobileSearchHint();
        }
    }
    
    closeCalendar() {
        console.log('Closing calendar');
        this.elements.calendarModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Blur input when closing
        this.elements.dateSearch.blur();
    }
    
    loadAllDates() {
        console.log('Loading dates with filter:', this.currentFilter, 'search:', this.currentSearch);
        
        // Clear container
        this.elements.datesContainer.innerHTML = '';
        
        // Filter dates
        const filteredDates = this.filterDates();
        
        // Group by month
        const datesByMonth = this.groupDatesByMonth(filteredDates);
        
        // Display
        this.displayDates(datesByMonth);
        
        // Update count
        this.elements.datesCount.textContent = filteredDates.length;
    }
    
    filterDates() {
        return this.importantDates.filter(date => {
            // Category filter
            if (this.currentFilter !== 'all') {
                if (!date.categories.includes(this.currentFilter)) {
                    return false;
                }
            }
            
            // Search filter
            if (this.currentSearch) {
                const searchText = this.currentSearch;
                const inDate = date.date.toLowerCase().includes(searchText);
                const inName = date.name.toLowerCase().includes(searchText);
                const inObjective = date.objective.toLowerCase().includes(searchText);
                
                // Also search in formatted categories
                const inCategories = date.categories.some(cat => {
                    // Search both original and formatted category names
                    const originalMatch = cat.toLowerCase().includes(searchText);
                    const formattedCat = cat.split('-')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                    const formattedMatch = formattedCat.toLowerCase().includes(searchText);
                    return originalMatch || formattedMatch;
                });
                
                if (!(inDate || inName || inObjective || inCategories)) {
                    return false;
                }
            }
            
            return true;
        });
    }
    
    groupDatesByMonth(dates) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        const grouped = {};
        months.forEach(month => {
            grouped[month] = [];
        });
        
        dates.forEach(date => {
            const month = date.date.split(' ')[0];
            if (grouped[month]) {
                grouped[month].push(date);
            }
        });
        
        // Remove empty months
        Object.keys(grouped).forEach(month => {
            if (grouped[month].length === 0) {
                delete grouped[month];
            }
        });
        
        return grouped;
    }
    
    displayDates(datesByMonth) {
        const months = Object.keys(datesByMonth);
        
        if (months.length === 0) {
            this.showNoResults();
            return;
        }
        
        months.forEach(month => {
            // Add month header
            const monthHeader = document.createElement('div');
            monthHeader.className = 'month-header';
            monthHeader.textContent = month;
            this.elements.datesContainer.appendChild(monthHeader);
            
            // Add dates for this month
            datesByMonth[month].forEach(date => {
                const dateCard = this.createDateCard(date);
                this.elements.datesContainer.appendChild(dateCard);
            });
        });
    }
    
    createDateCard(date) {
        const card = document.createElement('div');
        card.className = 'date-card';
        
        // Format categories
        const categoryTags = date.categories.map(category => {
            const displayName = category.split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            return `<span class="category-tag ${category}">${displayName}</span>`;
        }).join('');
        
        card.innerHTML = `
            <div class="date-header">
                <div class="date">
                    <i class="fas fa-calendar-day"></i>
                    <span>${date.date}</span>
                </div>
                <div class="category-tags">
                    ${categoryTags}
                </div>
            </div>
            <h3 class="event-name">${date.name}</h3>
            <p class="event-objective">${date.objective}</p>
        `;
        
        // Add click effect
        card.addEventListener('click', () => {
            this.showDateDetails(date);
        });
        
        return card;
    }
    
    showDateDetails(date) {
        const modal = document.createElement('div');
        modal.className = 'date-details-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 3000;
            animation: fadeIn 0.3s;
        `;
        
        const categories = date.categories.map(cat => 
            `<span class="category-tag ${cat}">${cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>`
        ).join('');
        
        modal.innerHTML = `
            <div class="date-details-content" style="
                background: white;
                border-radius: 15px;
                padding: 30px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 50px rgba(0,0,0,0.3);
                animation: slideIn 0.3s;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #2c3e50;">${date.name}</h2>
                    <button class="close-details" style="
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #7f8c8d;
                    ">&times;</button>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <i class="fas fa-calendar-day" style="color: #3498db; margin-right: 10px;"></i>
                        <span style="font-size: 1.2rem; font-weight: bold; color: #2c3e50;">${date.date}</span>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <div style="font-weight: bold; margin-bottom: 5px; color: #555;">Categories:</div>
                        <div style="display: flex; flex-wrap: wrap; gap: 5px;">
                            ${categories}
                        </div>
                    </div>
                </div>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #3498db;">
                    <h4 style="margin-top: 0; color: #2c3e50; margin-bottom: 10px;">Objective:</h4>
                    <p style="margin: 0; line-height: 1.6; color: #555;">${date.objective}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close button
        modal.querySelector('.close-details').addEventListener('click', () => {
            modal.remove();
        });
        
        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Escape key
        document.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', closeOnEscape);
            }
        });
    }
    
    showNoResults() {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <i class="fas fa-calendar-times fa-3x" style="color: #bdc3c7; margin-bottom: 20px;"></i>
            <h4 style="color: #34495e; margin-bottom: 10px;">No dates found</h4>
            <p style="color: #7f8c8d;">Try a different filter or search term</p>
        `;
        this.elements.datesContainer.appendChild(noResults);
    }
    
    showMobileSearchHint() {
        // Temporarily change placeholder to show hint
        const originalPlaceholder = this.elements.dateSearch.placeholder;
        this.elements.dateSearch.placeholder = "Tap here to search...";
        
        // Reset after 2 seconds
        setTimeout(() => {
            this.elements.dateSearch.placeholder = originalPlaceholder;
        }, 2000);
    }
    
    addCalendarStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideIn {
                from { 
                    opacity: 0;
                    transform: translateY(-30px);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .date-card {
                cursor: pointer;
                transition: all 0.3s ease;
                animation: fadeIn 0.5s ease;
            }
            
            .date-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
            }
            
            .month-header {
                background: linear-gradient(to right, #2c3e50, #4a6491);
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                margin: 20px 0 10px;
                font-size: 1.4rem;
                font-weight: bold;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                animation: slideIn 0.3s ease;
            }
            
            .no-results {
                grid-column: 1 / -1;
                text-align: center;
                padding: 60px 20px;
                background: #f8f9fa;
                border-radius: 10px;
                margin: 20px 0;
                animation: fadeIn 0.5s ease;
            }
            
            /* Ensure modal is visible */
            .calendar-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.8);
                z-index: 2000;
                overflow-y: auto;
                animation: fadeIn 0.3s ease;
            }
            
            .calendar-modal[style*="display: block"] {
                display: block !important;
            }
            
            /* Category tag styles */
            .category-tag {
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 0.75rem;
                font-weight: 600;
                color: white;
                display: inline-block;
                margin: 2px;
            }
            
            /* Category colors - ensure they're applied */
            .national { background-color: #FF9933 !important; }
            .international { background-color: #2ecc71 !important; }
            .armed-forces { background-color: #e74c3c !important; }
            .army { background-color: #8B4513 !important; }
            .navy { background-color: #000080 !important; }
            .air-force { background-color: #87CEEB !important; color: #000 !important; }
            .health { background-color: #9b59b6 !important; }
            .environment { background-color: #27ae60 !important; }
            .social { background-color: #f39c12 !important; }
            .cultural { background-color: #d35400 !important; }
            .education { background-color: #3498db !important; }
            .science { background-color: #16a085 !important; }
            
            /* Mobile-specific styles for better UX */
            @media (max-width: 768px) {
                .modal-filter {
                    width: 100%;
                    margin-bottom: 10px;
                }
                
                #dateSearch {
                    width: 100%;
                    font-size: 16px; /* Prevents zoom on iOS */
                }
                
                .modal-header h2 {
                    font-size: 1.5rem;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    
    // Initialize homepage features
    HomepageUtils.initHierarchyCards();
    HomepageUtils.animateLeaderStats();
    
    // Initialize disclaimer popup
    new DisclaimerPopup();
    
    // Initialize calendar system
    const calendar = new ImportantDatesCalendar();
    
    // Make calendar accessible globally for debugging
    window.calendar = calendar;
    
    console.log('All systems initialized successfully');
});