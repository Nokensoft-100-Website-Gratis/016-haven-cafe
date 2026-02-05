/**
 * Haven Cafe - Configuration
 * Centralized configuration for the website
 * Version: 1.0.0
 */

const HAVEN_CONFIG = {
    // Business Information
    business: {
        name: 'Haven Cafe',
        tagline: 'Coffee & Roastery Sentani Papua',
        description: 'Haven Cafe - Best Coffee Shop & Roastery in Sentani, Jayapura. Enjoy a cozy atmosphere with premium quality coffee.',
        founded: 2024,
        address: 'Ex-Bosco Fernandez, Jl. Gereja Silo, Hinekombe, Sentani, Papua',
        coordinates: {
            lat: -2.5833,
            lng: 140.4851
        }
    },

    // Contact Information
    contact: {
        whatsapp: '6282311005950',
        whatsappDisplay: '+62 823 1100 5950',
        email: 'info@havencafe.id',
        googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3985.877022068411!2d140.4851!3d-2.5833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMsKwMzUnMDAuMCJTIDE0MMKwMjknMDYuNCJF!5e0!3m2!1sen!2sid!4v1700000000000'
    },

    // Social Media Links
    social: {
        instagram: 'https://www.instagram.com/qwerty.cake20/',
        facebook: '#',
        tiktok: '#',
        youtube: '#'
    },

    // Operating Hours
    hours: {
        weekday: {
            open: '09:00',
            close: '22:00',
            display: 'Mon - Sat: 09:00 AM - 10:00 PM'
        },
        weekend: {
            open: '12:00',
            close: '23:00',
            display: 'Sun: 12:00 PM - 11:00 PM'
        }
    },

    // API Endpoints (Data Files)
    api: {
        categories: './data/menu/categories.json',
        reviews: './data/ulasan.json'
    },

    // Rating Information
    rating: {
        score: 4.8,
        max: 5.0,
        platform: 'Google'
    },

    // Image Paths
    images: {
        heroSlides: [
            'images/coffee-and-flawer.jpg',
            './images/haven-cafe-3.png',
            './images/haven-cafe-1.png',
            'images/haven-cafe-2.png'
        ],
        gallery: [
            'images/haven-cafe-1.png',
            'images/coffee-and-leaf.avif',
            'images/haven-cafe-2.png',
            'images/food.png',
            'images/haven-cafe-3.png',
            'images/cup-of-coffee.avif',
            'images/drink.png',
            'images/two-guns-espresso.avif'
        ],
        placeholder: 'images/placeholder.jpg'
    },

    // Slideshow Settings
    slideshow: {
        interval: 5000, // 5 seconds
        transition: 1000 // 1 second
    }
};

// Freeze config to prevent accidental modifications
Object.freeze(HAVEN_CONFIG);
Object.freeze(HAVEN_CONFIG.business);
Object.freeze(HAVEN_CONFIG.contact);
Object.freeze(HAVEN_CONFIG.social);
Object.freeze(HAVEN_CONFIG.hours);
Object.freeze(HAVEN_CONFIG.api);
Object.freeze(HAVEN_CONFIG.rating);
Object.freeze(HAVEN_CONFIG.images);
Object.freeze(HAVEN_CONFIG.slideshow);

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HAVEN_CONFIG;
}
