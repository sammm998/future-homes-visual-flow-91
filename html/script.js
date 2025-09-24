// Global state
let searchFilters = {
    propertyType: '',
    bedrooms: '',
    location: '',
    refNo: '',
    sortBy: '',
    minPrice: '',
    maxPrice: '',
    minSqFt: '',
    maxSqFt: '',
    amenities: [],
    status: []
};

let currentTab = 'buy';
let properties = [];

// Fallback properties data
const fallbackProperties = [
    {
        id: "fallback-1",
        title: "Luxury Marina Apartments",
        location: "Dubai, Marina",
        price: "$1,110,000",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
        bedrooms: "1-6",
        bathrooms: "2-7",
        sizes_m2: "78-1,505"
    },
    {
        id: "fallback-2",
        title: "Twin Villas Launch Price",
        location: "Antalya, Kemer",
        price: "$350,000",
        image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
        bedrooms: "3",
        bathrooms: "2",
        sizes_m2: "115"
    },
    {
        id: "fallback-3",
        title: "Magnificent Complex",
        location: "Dubai, JVC",
        price: "$313,000",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
        bedrooms: "1-2",
        bathrooms: "1-2",
        sizes_m2: "70-112"
    },
    {
        id: "fallback-4",
        title: "Investment Apartments",
        location: "Antalya, Aksu",
        price: "$135,000",
        image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop",
        bedrooms: "1-2",
        bathrooms: "1-2",
        sizes_m2: "75-104"
    },
    {
        id: "fallback-5",
        title: "Modern Design Apartments",
        location: "Antalya, Aksu",
        price: "$147,000",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
        bedrooms: "1-2",
        bathrooms: "1-2",
        sizes_m2: "60-100"
    },
    {
        id: "fallback-6",
        title: "Ready Luxury Apartment",
        location: "Antalya, Altintas",
        price: "$110,000",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=300&fit=crop",
        bedrooms: "1",
        bathrooms: "1",
        sizes_m2: "72"
    }
];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeComponents();
    loadProperties();
});

// Initialize all components
function initializeComponents() {
    setupMobileMenu();
    setupSearchTabs();
    setupAdvancedSearch();
    setupNewsletterForm();
    setupFAQ();
    setupBannerClose();
    setupGalleryHover();
    setupAnimations();
}

// Mobile Menu
function setupMobileMenu() {
    const mobileToggle = document.querySelector('[data-mobile-menu]');
    const sidebar = document.querySelector('[data-sidebar]');
    const sidebarClose = document.querySelector('[data-sidebar-close]');
    
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', function() {
            sidebar.classList.add('sidebar-open');
        });
    }
    
    if (sidebarClose && sidebar) {
        sidebarClose.addEventListener('click', function() {
            sidebar.classList.remove('sidebar-open');
        });
    }
    
    // Close sidebar when clicking outside
    document.addEventListener('click', function(e) {
        if (sidebar && !sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
            sidebar.classList.remove('sidebar-open');
        }
    });
}

// Search Tabs
function setupSearchTabs() {
    const tabs = document.querySelectorAll('[data-tab]');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabType = this.getAttribute('data-tab');
            
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('tab-active'));
            
            // Add active class to clicked tab
            this.classList.add('tab-active');
            
            // Update current tab
            currentTab = tabType;
        });
    });
}

// Advanced Search Modal
function setupAdvancedSearch() {
    const advancedBtn = document.querySelector('[data-advanced-search]');
    const modal = document.querySelector('[data-modal="advanced-search"]');
    const modalClose = document.querySelector('[data-modal-close]');
    const modalApply = document.querySelector('[data-modal-apply]');
    const modalReset = document.querySelector('[data-modal-reset]');
    
    if (advancedBtn && modal) {
        advancedBtn.addEventListener('click', function() {
            modal.classList.add('modal-open');
        });
    }
    
    if (modalClose && modal) {
        modalClose.addEventListener('click', function() {
            modal.classList.remove('modal-open');
        });
    }
    
    if (modalApply && modal) {
        modalApply.addEventListener('click', function() {
            applyAdvancedFilters();
            modal.classList.remove('modal-open');
        });
    }
    
    if (modalReset) {
        modalReset.addEventListener('click', function() {
            resetAdvancedFilters();
        });
    }
    
    // Close modal when clicking overlay
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('modal-open');
            }
        });
    }
}

// Newsletter Form
function setupNewsletterForm() {
    const form = document.querySelector('[data-newsletter-form]');
    const emailInput = document.querySelector('[data-email-input]');
    
    if (form && emailInput) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            
            if (!email) {
                alert('Please enter your email address');
                return;
            }
            
            if (!isValidEmail(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Simulate form submission
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            
            setTimeout(function() {
                alert('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1000);
        });
    }
}

// FAQ Accordion
function setupFAQ() {
    const faqItems = document.querySelectorAll('[data-faq-item]');
    
    faqItems.forEach(item => {
        const toggle = item.querySelector('[data-faq-toggle]');
        
        if (toggle) {
            toggle.addEventListener('click', function() {
                const isActive = item.classList.contains('faq-active');
                
                // Close all FAQ items
                faqItems.forEach(faqItem => {
                    faqItem.classList.remove('faq-active');
                });
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add('faq-active');
                }
            });
        }
    });
}

// Banner Close
function setupBannerClose() {
    const bannerClose = document.querySelector('[data-banner-close]');
    const banner = document.querySelector('[data-update-banner]');
    
    if (bannerClose && banner) {
        bannerClose.addEventListener('click', function() {
            banner.style.display = 'none';
        });
    }
}

// Gallery Hover Effects
function setupGalleryHover() {
    const galleryItems = document.querySelectorAll('[data-gallery-item]');
    
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const overlay = this.querySelector('.gallery-overlay');
            const counter = this.querySelector('.gallery-counter');
            const info = this.querySelector('.gallery-info');
            
            if (overlay) overlay.style.opacity = '1';
            if (counter) counter.style.opacity = '1';
            if (info) {
                info.style.opacity = '1';
                info.style.transform = 'translateY(0)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const overlay = this.querySelector('.gallery-overlay');
            const counter = this.querySelector('.gallery-counter');
            const info = this.querySelector('.gallery-info');
            
            if (overlay) overlay.style.opacity = '0';
            if (counter) counter.style.opacity = '0';
            if (info) {
                info.style.opacity = '0';
                info.style.transform = 'translateY(8px)';
            }
        });
    });
}

// Animations
function setupAnimations() {
    // Animate elements on scroll
    const animateElements = document.querySelectorAll('[data-animate]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.getAttribute('data-animate');
                
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                
                observer.unobserve(element);
            }
        });
    });
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(40px)';
        element.style.transition = 'all 0.8s ease';
        observer.observe(element);
    });
    
    // Staggered animations for stats
    const statItems = document.querySelectorAll('[data-animate-delay]');
    statItems.forEach(item => {
        const delay = item.getAttribute('data-animate-delay');
        item.style.transitionDelay = delay + 'ms';
    });
}

// Load and display properties
function loadProperties() {
    // Simulate loading
    const propertyGrid = document.querySelector('[data-property-grid]');
    
    if (propertyGrid) {
        // Use fallback properties for demo
        properties = [...fallbackProperties];
        renderProperties();
    }
}

// Render properties in the grid
function renderProperties() {
    const propertyGrid = document.querySelector('[data-property-grid]');
    
    if (!propertyGrid || properties.length === 0) return;
    
    propertyGrid.innerHTML = '';
    
    properties.forEach((property, index) => {
        const propertyCard = createPropertyCard(property, index);
        propertyGrid.appendChild(propertyCard);
    });
}

// Create a property card element
function createPropertyCard(property, index) {
    const card = document.createElement('div');
    card.className = `property-card ${index === 0 ? 'featured' : 'side'}`;
    card.setAttribute('data-property-id', property.id);
    
    card.innerHTML = `
        <img src="${property.image}" alt="${property.title}" class="property-image">
        <div class="property-overlay"></div>
        <div class="property-price">${property.price}</div>
        <div class="property-content">
            <h3 class="property-title">${property.title}</h3>
            <div class="property-location">
                📍 ${property.location}
            </div>
            <div class="property-details">
                <div class="property-features">
                    ${property.sizes_m2 ? `<div class="feature-item">📐 ${property.sizes_m2} m²</div>` : ''}
                    ${property.bedrooms ? `<div class="feature-item">🛏️ ${property.bedrooms} ${property.bedrooms === '1' ? 'Bed' : 'Beds'}</div>` : ''}
                    ${property.bathrooms ? `<div class="feature-item">🚿 ${property.bathrooms} ${property.bathrooms === '1' ? 'Bath' : 'Baths'}</div>` : ''}
                </div>
            </div>
        </div>
    `;
    
    // Add click event
    card.addEventListener('click', function() {
        handlePropertyClick(property);
    });
    
    // Add hover effects
    card.addEventListener('mouseenter', function() {
        const image = this.querySelector('.property-image');
        if (image) {
            image.style.transform = 'scale(1.05)';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        const image = this.querySelector('.property-image');
        if (image) {
            image.style.transform = 'scale(1)';
        }
    });
    
    return card;
}

// Handle property card click
function handlePropertyClick(property) {
    // For demo purposes, show alert
    alert(`Viewing property: ${property.title}\nLocation: ${property.location}\nPrice: ${property.price}`);
    
    // In a real application, this would navigate to the property details page
    // window.location.href = `property.html?id=${property.id}`;
}

// Search functionality
function performSearch() {
    // Collect all filter values
    const propertyType = document.querySelector('[data-filter="property-type"]')?.value || '';
    const bedrooms = document.querySelector('[data-filter="bedrooms"]')?.value || '';
    const location = document.querySelector('[data-filter="location"]')?.value || '';
    const refNo = document.querySelector('[data-filter="ref-no"]')?.value || '';
    const sortBy = document.querySelector('[data-filter="sort"]')?.value || '';
    
    // Update search filters
    searchFilters = {
        ...searchFilters,
        propertyType,
        bedrooms,
        location,
        refNo,
        sortBy
    };
    
    // In a real application, this would make an API call
    // For demo purposes, show search parameters
    console.log('Search filters:', searchFilters);
    
    // Navigate to appropriate location page
    let targetPage = 'properties.html';
    
    if (location) {
        const locationRoutes = {
            'antalya': 'antalya.html',
            'dubai': 'dubai.html',
            'cyprus': 'cyprus.html',
            'mersin': 'mersin.html',
            'bali': 'bali.html'
        };
        targetPage = locationRoutes[location] || 'properties.html';
    }
    
    // Build query string
    const queryParams = new URLSearchParams();
    
    Object.entries(searchFilters).forEach(([key, value]) => {
        if (value && value.length > 0) {
            if (Array.isArray(value)) {
                queryParams.set(key, value.join(','));
            } else {
                queryParams.set(key, value);
            }
        }
    });
    
    const queryString = queryParams.toString();
    const url = queryString ? `${targetPage}?${queryString}` : targetPage;
    
    alert(`Navigating to: ${url}`);
    
    // In a real application:
    // window.location.href = url;
}

// Advanced filter functions
function applyAdvancedFilters() {
    // Collect advanced filter values
    const minPrice = document.querySelector('[data-advanced-filter="min-price"]')?.value || '';
    const maxPrice = document.querySelector('[data-advanced-filter="max-price"]')?.value || '';
    const minSqFt = document.querySelector('[data-advanced-filter="min-sqft"]')?.value || '';
    const maxSqFt = document.querySelector('[data-advanced-filter="max-sqft"]')?.value || '';
    
    // Collect amenity checkboxes
    const amenities = [];
    document.querySelectorAll('[data-advanced-filter^="pool"], [data-advanced-filter^="gym"], [data-advanced-filter^="garden"], [data-advanced-filter^="parking"], [data-advanced-filter^="sea-view"], [data-advanced-filter^="security"]').forEach(checkbox => {
        if (checkbox.checked) {
            amenities.push(checkbox.getAttribute('data-advanced-filter'));
        }
    });
    
    // Collect status checkboxes
    const status = [];
    document.querySelectorAll('[data-advanced-filter^="residence-permit"], [data-advanced-filter^="ready-to-move"], [data-advanced-filter^="under-construction"]').forEach(checkbox => {
        if (checkbox.checked) {
            status.push(checkbox.getAttribute('data-advanced-filter'));
        }
    });
    
    // Update search filters
    searchFilters = {
        ...searchFilters,
        minPrice,
        maxPrice,
        minSqFt,
        maxSqFt,
        amenities,
        status
    };
    
    console.log('Advanced filters applied:', searchFilters);
}

function resetAdvancedFilters() {
    // Reset all advanced filter inputs
    document.querySelectorAll('[data-advanced-filter]').forEach(input => {
        if (input.type === 'checkbox') {
            input.checked = false;
        } else {
            input.value = '';
        }
    });
    
    // Reset filter state
    searchFilters.minPrice = '';
    searchFilters.maxPrice = '';
    searchFilters.minSqFt = '';
    searchFilters.maxSqFt = '';
    searchFilters.amenities = [];
    searchFilters.status = [];
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Event listeners for search functionality
document.addEventListener('DOMContentLoaded', function() {
    // Search button
    const searchBtn = document.querySelector('[data-search]');
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    // Enter key in search inputs
    document.querySelectorAll('[data-filter]').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    });
    
    // Gallery explore button
    const galleryExploreBtn = document.querySelector('[data-gallery-explore]');
    if (galleryExploreBtn) {
        galleryExploreBtn.addEventListener('click', function() {
            alert('Navigating to full property gallery...');
            // In a real application: window.location.href = 'gallery.html';
        });
    }
});

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add loading states for dynamic content
function showLoading(element) {
    if (element) {
        element.innerHTML = '<div class="loading-spinner">Loading...</div>';
    }
}

function hideLoading() {
    const loadingElements = document.querySelectorAll('.loading-spinner');
    loadingElements.forEach(el => el.remove());
}

// Initialize tooltips and other enhancements
function initializeEnhancements() {
    // Add smooth transitions to buttons
    const buttons = document.querySelectorAll('button, .btn, [role="button"]');
    buttons.forEach(button => {
        button.style.transition = 'all 0.2s ease';
    });
    
    // Add focus outlines for accessibility
    const focusableElements = document.querySelectorAll('button, a, input, select, textarea');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid hsl(221, 83%, 53%)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
}

// Call enhancements on load
document.addEventListener('DOMContentLoaded', initializeEnhancements);