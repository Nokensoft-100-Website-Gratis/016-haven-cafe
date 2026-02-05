/**
 * Haven Cafe - Main Application
 * Utility functions and Alpine.js data handlers
 * Version: 1.0.0
 */

// ==========================================================================
// Tailwind Configuration
// ==========================================================================
tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#1a4d2e',
                dark: '#111827',
                darkLighter: '#1f2937'
            },
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'sans-serif'],
            },
        }
    }
};

// ==========================================================================
// Utility Functions
// ==========================================================================

/**
 * Format number as Indonesian Rupiah currency
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

/**
 * Generate WhatsApp URL with message
 * @param {string} phone - Phone number (without +)
 * @param {string} message - Message to send
 * @returns {string} WhatsApp URL
 */
function getWhatsAppUrl(phone, message = '') {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${encodedMessage}`;
}

/**
 * Create reservation message for WhatsApp
 * @param {Object} data - Reservation data
 * @returns {string} Formatted reservation message
 */
function createReservationMessage(data) {
    return `Hi Haven Cafe, I would like to make a reservation:

- Name: ${data.name}
- Date/Time: ${data.date}
- Guests: ${data.guests}`;
}

/**
 * Create event inquiry message for WhatsApp
 * @returns {string} Event inquiry message
 */
function createEventInquiryMessage() {
    return "Hi Haven Cafe, I'm interested in your Garden Event Packages.";
}

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Check if element is in viewport
 * @param {Element} element - DOM element to check
 * @returns {boolean} True if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Smooth scroll to element
 * @param {string} selector - CSS selector for target element
 */
function scrollToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ==========================================================================
// Alpine.js Data Handlers
// ==========================================================================

/**
 * Main app state handler for Alpine.js
 */
function appState() {
    return {
        darkMode: localStorage.getItem('theme') === 'dark',
        activeTab: 'popular',
        currentSection: 'home',
        
        toggleDarkMode() {
            this.darkMode = !this.darkMode;
            localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
        },
        
        setSection(section) {
            this.currentSection = section;
        }
    };
}

/**
 * Hero slideshow handler for Alpine.js
 */
function heroSlideshow() {
    return {
        activeSlide: 0,
        slides: HAVEN_CONFIG.images.heroSlides,
        intervalId: null,
        
        init() {
            this.startAutoPlay();
        },
        
        startAutoPlay() {
            this.intervalId = setInterval(() => {
                this.nextSlide();
            }, HAVEN_CONFIG.slideshow.interval);
        },
        
        stopAutoPlay() {
            if (this.intervalId) {
                clearInterval(this.intervalId);
            }
        },
        
        nextSlide() {
            this.activeSlide = (this.activeSlide + 1) % this.slides.length;
        },
        
        prevSlide() {
            this.activeSlide = this.activeSlide === 0 
                ? this.slides.length - 1 
                : this.activeSlide - 1;
        },
        
        goToSlide(index) {
            this.activeSlide = index;
        }
    };
}

/**
 * Menu section handler for Alpine.js
 */
function menuSection() {
    return {
        categories: [],
        activeCategory: '',
        menuItems: [],
        searchQuery: '',
        loading: false,
        error: null,

        async init() {
            await this.loadCategories();
        },

        async loadCategories() {
            try {
                const res = await fetch(HAVEN_CONFIG.api.categories);
                if (!res.ok) throw new Error('Failed to load categories');
                this.categories = await res.json();
                if (this.categories.length > 0) {
                    await this.switchCategory(this.categories[0]);
                }
            } catch (e) {
                this.error = 'Gagal memuat daftar kategori';
                console.error(this.error, e);
            }
        },

        async switchCategory(cat) {
            // Toggle on mobile
            if (this.activeCategory === cat.id && window.innerWidth < 768) {
                this.activeCategory = '';
                return;
            }
            
            // Skip if already active on desktop
            if (this.activeCategory === cat.id) return;

            this.loading = true;
            this.activeCategory = cat.id;
            this.searchQuery = '';
            this.error = null;

            try {
                const res = await fetch(`./data/menu/${cat.file}`);
                if (!res.ok) throw new Error('Menu file not found');
                const data = await res.json();
                this.menuItems = data.filter(item => item.status);
            } catch (e) {
                this.menuItems = [];
                this.error = `File menu tidak ditemukan: ${cat.file}`;
                console.error(this.error, e);
            }
            
            this.loading = false;
        },

        get filteredItems() {
            if (!this.searchQuery) return this.menuItems;
            const query = this.searchQuery.toLowerCase();
            return this.menuItems.filter(item =>
                item.menu_name.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query)
            );
        },

        formatPrice(price) {
            return formatRupiah(price);
        }
    };
}

/**
 * Reservation form handler for Alpine.js
 */
function reservationForm() {
    return {
        name: '',
        date: '',
        guests: '2 Persons',
        
        sendWhatsApp() {
            const message = createReservationMessage({
                name: this.name,
                date: this.date,
                guests: this.guests
            });
            window.open(getWhatsAppUrl(HAVEN_CONFIG.contact.whatsapp, message), '_blank');
        },
        
        isValid() {
            return this.name.trim() !== '' && this.date !== '';
        }
    };
}

/**
 * Gallery lightbox handler for Alpine.js
 */
function galleryLightbox() {
    return {
        open: false,
        activeImg: '',
        images: HAVEN_CONFIG.images.gallery,
        
        openImage(img) {
            this.activeImg = img;
            this.open = true;
            document.body.style.overflow = 'hidden';
        },
        
        closeImage() {
            this.open = false;
            document.body.style.overflow = '';
        },
        
        nextImage() {
            const currentIndex = this.images.indexOf(this.activeImg);
            const nextIndex = (currentIndex + 1) % this.images.length;
            this.activeImg = this.images[nextIndex];
        },
        
        prevImage() {
            const currentIndex = this.images.indexOf(this.activeImg);
            const prevIndex = currentIndex === 0 
                ? this.images.length - 1 
                : currentIndex - 1;
            this.activeImg = this.images[prevIndex];
        }
    };
}

/**
 * Reviews section handler for Alpine.js
 */
function reviewsSection() {
    return {
        reviews: [],
        loading: true,
        error: null,
        
        async init() {
            try {
                const res = await fetch(HAVEN_CONFIG.api.reviews);
                if (!res.ok) throw new Error('Failed to load reviews');
                this.reviews = await res.json();
            } catch (e) {
                this.error = 'Gagal memuat ulasan';
                console.error(this.error, e);
            }
            this.loading = false;
        }
    };
}

// ==========================================================================
// Event Listeners
// ==========================================================================

// Handle keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    const lightbox = document.querySelector('[x-data*="galleryLightbox"]');
    if (lightbox && lightbox.__x) {
        const data = lightbox.__x.$data;
        if (data.open) {
            if (e.key === 'Escape') data.closeImage();
            if (e.key === 'ArrowRight') data.nextImage();
            if (e.key === 'ArrowLeft') data.prevImage();
        }
    }
});

// Track active section on scroll
const observeSection = debounce(() => {
    const sections = ['home', 'menu', 'events', 'reservation', 'gallery', 'reviews', 'contact'];
    for (const sectionId of sections) {
        const section = document.getElementById(sectionId);
        if (section && isInViewport(section)) {
            // Update Alpine state if available
            const app = document.querySelector('[x-data*="appState"]');
            if (app && app.__x) {
                app.__x.$data.currentSection = sectionId;
            }
            break;
        }
    }
}, 100);

window.addEventListener('scroll', observeSection);

// Console welcome message
console.log(
    '%c☕ Haven Cafe Website',
    'color: #1a4d2e; font-size: 20px; font-weight: bold;'
);
console.log(
    '%cPowered by Nokensoft - https://nokensoft.com',
    'color: #666; font-size: 12px;'
);
