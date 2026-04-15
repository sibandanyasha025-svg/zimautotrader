// ============================================
// ZimAutoTrader.com - Complete JavaScript
// Zimbabwe's Premium Vehicle & Machinery Marketplace
// ============================================

// App State
let currentUser = JSON.parse(localStorage.getItem('zimautotrader_user')) || null;
let users = JSON.parse(localStorage.getItem('zimautotrader_users')) || [];
let listings = JSON.parse(localStorage.getItem('zimautotrader_listings')) || [];
let cart = JSON.parse(localStorage.getItem('zimautotrader_cart')) || [];
let currentTab = 'marketplace';
let isLoginMode = true;
let selectedProfileType = 'individual';
let currentListing = null;
let currentFilters = {
    category: null,
    make: null,
    location: null
};

// Zimbabwe Locations (Comprehensive)
const zimbabweLocations = [
    'Harare', 'Bulawayo', 'Chitungwiza', 'Mutare', 'Gweru', 'Kwekwe',
    'Kadoma', 'Masvingo', 'Chinhoyi', 'Marondera', 'Norton', 'Chegutu',
    'Zvishavane', 'Victoria Falls', 'Hwange', 'Kariba', 'Bindura',
    'Shamva', 'Mazowe', 'Glendale', 'Banket', 'Concession', 'Mvurwi',
    'Rusape', 'Chipinge', 'Chiredzi', 'Triangle', 'Beitbridge', 'Gwanda',
    'Plumtree', 'Kezi', 'Esigodini', 'Filabusi', 'Mberengwa', 'Shurugwi',
    'Gokwe', 'Karoi', 'Mhangura', 'Centenary', 'Mount Darwin', 'Guruve',
    'Muzarabani', 'Rushinga', 'Nyanga', 'Chimanimani', 'Birchenough Bridge',
    'Other'
];

// Vehicle Makes
const vehicleMakes = [
    'Toyota', 'Nissan', 'Honda', 'Mazda', 'Mitsubishi', 'Ford',
    'Volkswagen', 'BMW', 'Mercedes-Benz', 'Audi', 'Isuzu', 'Subaru',
    'Suzuki', 'Daihatsu', 'Hyundai', 'Kia', 'Land Rover', 'Jaguar',
    'Volvo', 'Chevrolet', 'Peugeot', 'Renault', 'Fiat', 'Jeep',
    'Lexus', 'Infiniti', 'Acura', 'Scania', 'MAN', 'Freightliner',
    'Other'
];

// Vehicle Specialists
const vehicleSpecialists = [
    { brand: 'Mercedes-Benz', icon: 'fa-car', specialists: 'German Auto Care' },
    { brand: 'BMW', icon: 'fa-car', specialists: 'Bavarian Motors' },
    { brand: 'Audi', icon: 'fa-car', specialists: 'VAG Specialists' },
    { brand: 'Toyota', icon: 'fa-car', specialists: 'Toyota Tech Zim' },
    { brand: 'Nissan', icon: 'fa-car', specialists: 'Nissan Pro Center' },
    { brand: 'Land Rover', icon: 'fa-truck', specialists: 'Rover Experts' },
    { brand: 'Volkswagen', icon: 'fa-car', specialists: 'VW Specialist Harare' }
];

// Reputable Service Companies
const reputableServices = [
    { name: 'Auto Panel Beaters', type: 'Panel Beating', icon: 'fa-hammer', location: 'Harare' },
    { name: 'Precision Spray Painting', type: 'Spray Painting', icon: 'fa-spray-can', location: 'Bulawayo' },
    { name: 'Zim Auto Diagnostics', type: 'Diagnostics', icon: 'fa-laptop', location: 'Harare' },
    { name: 'Gearbox & Diff Specialists', type: 'Transmission', icon: 'fa-gear', location: 'Mutare' },
    { name: 'Truck & Bus Service Center', type: 'Commercial Vehicles', icon: 'fa-truck', location: 'Gweru' },
    { name: 'Harare Auto Electrical', type: 'Auto Electrical', icon: 'fa-bolt', location: 'Harare' },
    { name: 'Bulawayo Tyre Centre', type: 'Tyres & Wheels', icon: 'fa-circle', location: 'Bulawayo' },
    { name: 'Zim Tractor Repairs', type: 'Tractor Service', icon: 'fa-tractor', location: 'Chinhoyi' }
];

// Subscription Plans
const subscriptionPlans = [
    {
        name: 'Basic',
        price: 0,
        priceRange: 'Free',
        features: [
            '1 active listing',
            '3 photos per listing',
            'Basic contact info',
            '7-day listing duration',
            'WhatsApp integration'
        ],
        color: '#95a5a6'
    },
    {
        name: 'Professional',
        price: 3.29,
        priceRange: '$3.29 - $6.58',
        features: [
            '25-50 active listings',
            'Unlimited photos',
            'Basic analytics',
            '30-day listing duration',
            'Priority support',
            'WhatsApp integration'
        ],
        color: '#3498db',
        featured: true
    },
    {
        name: 'Dealer',
        price: 7.49,
        priceRange: '$7.49 - $11.49',
        features: [
            'Unlimited listings',
            'Bulk CSV upload',
            'Featured placement',
            'Lead export',
            'API access',
            'Advanced analytics',
            'WhatsApp integration'
        ],
        color: '#e67e22'
    },
    {
        name: 'Enterprise',
        price: 15,
        priceRange: '$15 - $25',
        features: [
            'Dedicated account manager',
            'Custom branding',
            'Advanced lead routing',
            'Priority placement',
            'API integration',
            'White-label options',
            'Multi-user accounts',
            'WhatsApp integration'
        ],
        color: '#9b59b6'
    }
];

// ============================================
// INITIALIZATION
// ============================================

function init() {
    loadUserState();
    populateLocationSelects();
    populateMakeSelect();
    updateCartCount();
    renderContent();
    attachEventListeners();
    
    if (listings.length === 0) {
        addSampleListings();
    }
}

function attachEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            if (currentTab === 'marketplace') {
                renderMarketplace(document.getElementById('dynamicContent'));
            }
        });
    }
    
    // Auth form
    const authForm = document.getElementById('authForm');
    if (authForm) {
        authForm.addEventListener('submit', handleAuthSubmit);
    }
    
    // Post ad form
    const postAdForm = document.getElementById('postAdForm');
    if (postAdForm) {
        postAdForm.addEventListener('submit', handlePostAdSubmit);
    }
    
    // Navigation tabs
    document.querySelectorAll('[data-tab]').forEach(tab => {
        tab.addEventListener('click', (e) => {
            switchTab(tab.dataset.tab);
        });
    });
    
    // Modal close buttons
    document.querySelectorAll('[data-close]').forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(btn.dataset.close);
        });
    });
    
    // Profile type selector
    document.querySelectorAll('[data-type]').forEach(opt => {
        opt.addEventListener('click', () => {
            selectProfileType(opt.dataset.type);
        });
    });
    
    // Switch auth mode link
    const switchLink = document.getElementById('switchLink');
    if (switchLink) {
        switchLink.addEventListener('click', toggleAuthMode);
    }
    
    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
}

function loadUserState() {
    if (currentUser) {
        if (!currentUser.subscription) {
            currentUser.subscription = 'Basic';
            currentUser.trialEnds = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
            currentUser.listingsCount = 0;
            currentUser.profileType = currentUser.profileType || 'individual';
            localStorage.setItem('zimautotrader_user', JSON.stringify(currentUser));
        }
    }
    renderUserSection();
}

function populateLocationSelects() {
    const locationSelects = document.querySelectorAll('#adLocation, #locationFilter');
    const options = zimbabweLocations.map(loc => `<option value="${loc}">${loc}</option>`).join('');
    locationSelects.forEach(select => {
        if (select) select.innerHTML = '<option value="">Select Location</option>' + options;
    });
}

function populateMakeSelect() {
    const makeSelect = document.getElementById('adMake');
    if (makeSelect) {
        makeSelect.innerHTML = '<option value="">Select Make</option>' +
            vehicleMakes.map(make => `<option value="${make}">${make}</option>`).join('');
    }
}

function addSampleListings() {
    const sampleListings = [
        {
            id: Date.now() + 1,
            category: 'Vehicles',
            make: 'Toyota',
            title: 'Toyota Hilux 2020 Double Cab 4x4',
            price: 35000,
            location: 'Harare',
            description: 'Excellent condition, full service history, 50,000km, one owner, never been in accident. Includes service records and spare key.',
            whatsapp: '+263771234567',
            status: 'available',
            seller: 'John Moyo',
            sellerType: 'Professional',
            sellerProfileType: 'individual',
            date: '2024-01-15',
            views: 245
        },
        {
            id: Date.now() + 2,
            category: 'Vehicles',
            make: 'Mercedes-Benz',
            title: 'Mercedes-Benz C200 2019 AMG Line',
            price: 28000,
            location: 'Bulawayo',
            description: 'Immaculate condition, panoramic roof, navigation, leather seats, 35,000km, full Mercedes service history.',
            whatsapp: '+263719876543',
            status: 'available',
            seller: 'Premium Motors',
            sellerType: 'Dealer',
            sellerProfileType: 'company',
            date: '2024-01-14',
            views: 189
        },
        {
            id: Date.now() + 3,
            category: 'Machinery',
            make: 'Massey Ferguson',
            title: 'Massey Ferguson MF 375 Tractor',
            price: 15000,
            location: 'Chinhoyi',
            description: '75HP, well maintained, comes with plough and harrow. Recently serviced, new tyres, ready for work.',
            whatsapp: '+263784567890',
            status: 'available',
            seller: 'Farm Equipment ZW',
            sellerType: 'Professional',
            sellerProfileType: 'company',
            date: '2024-01-13',
            views: 123
        },
        {
            id: Date.now() + 4,
            category: 'Parts',
            make: 'Toyota',
            title: 'Toyota Hilux Engine 2KD-FTV Complete',
            price: 2500,
            location: 'Harare',
            description: 'Complete engine, low mileage import from Japan. Includes turbo, alternator, starter. Tested and working.',
            whatsapp: '+263732345678',
            status: 'available',
            seller: 'Zim Spares',
            sellerType: 'Dealer',
            sellerProfileType: 'company',
            date: '2024-01-12',
            views: 89
        },
        {
            id: Date.now() + 5,
            category: 'Equipment',
            make: 'Caterpillar',
            title: 'Caterpillar 320D Excavator',
            price: 85000,
            location: 'Mutare',
            description: '2018 model, 3,500 hours, excellent condition, ready to work. New tracks and bucket.',
            whatsapp: '+263776543210',
            status: 'available',
            seller: 'Mining Equipment ZW',
            sellerType: 'Dealer',
            sellerProfileType: 'company',
            date: '2024-01-10',
            views: 312
        },
        {
            id: Date.now() + 6,
            category: 'Vehicles',
            make: 'BMW',
            title: 'BMW X5 2018 M Sport',
            price: 42000,
            location: 'Harare',
            description: 'Full M Sport package, heads-up display, Harman Kardon sound, panoramic roof, 45,000km.',
            whatsapp: '+263712345678',
            status: 'sold',
            seller: 'Luxury Rides ZW',
            sellerType: 'Dealer',
            sellerProfileType: 'company',
            date: '2024-01-05',
            views: 567
        }
    ];
    
    listings = [...sampleListings, ...listings];
    localStorage.setItem('zimautotrader_listings', JSON.stringify(listings));
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function isInTrialPeriod() {
    if (!currentUser || !currentUser.trialEnds) return false;
    return new Date(currentUser.trialEnds) > new Date();
}

function getTrialDaysLeft() {
    if (!currentUser || !currentUser.trialEnds) return 0;
    const daysLeft = Math.ceil((new Date(currentUser.trialEnds) - new Date()) / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? daysLeft : 0;
}

function getCategoryIcon(category) {
    const icons = {
        'Vehicles': 'fa-car',
        'Machinery': 'fa-tractor',
        'Equipment': 'fa-digging',
        'Parts': 'fa-cog'
    };
    return icons[category] || 'fa-tag';
}

function getCategoryCount(category) {
    return listings.filter(l => l.category === category).length;
}

function getMakeCount(make) {
    return listings.filter(l => l.make === make).length;
}

function getListingTitle() {
    if (currentFilters.category) return `${currentFilters.category} Listings`;
    if (currentFilters.make) return `${currentFilters.make} Vehicles`;
    return 'All Listings';
}

function calculateTransportFee(location) {
    const fees = {
        'Harare': 150,
        'Bulawayo': 200,
        'Mutare': 180,
        'Gweru': 170,
        'Kwekwe': 160,
        'Masvingo': 190,
        'Chinhoyi': 140,
        'Marondera': 130,
        'Victoria Falls': 350,
        'Hwange': 320,
        'Beitbridge': 280,
        'Chiredzi': 250,
        'Kadoma': 145,
        'Chegutu': 150,
        'Zvishavane': 220,
        'Kariba': 300,
        'Bindura': 135,
        'Chipinge': 260,
        'Gwanda': 240,
        'Plumtree': 230
    };
    return fees[location] || 200;
}

// ============================================
// RENDERING FUNCTIONS
// ============================================

function renderUserSection() {
    const section = document.getElementById('userSection');
    if (!section) return;
    
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (currentUser) {
        const trialDays = getTrialDaysLeft();
        const trialText = isInTrialPeriod() && currentUser.subscription !== 'Basic' ?
            `<span class="trial-badge-header"><i class="fas fa-clock"></i> ${trialDays} days left</span>` : '';
        
        const profileTypeClass = currentUser.profileType === 'company' ? 'profile-type-company' : 'profile-type-individual';
        const profileTypeIcon = currentUser.profileType === 'company' ? 'fa-building' : 'fa-user';
        
        section.innerHTML = `
            <div class="cart-icon" onclick="switchTab('cart')">
                <i class="fas fa-shopping-cart"></i>
                <span class="cart-count">${cartCount}</span>
            </div>
            <div class="subscription-badge">
                <i class="fas fa-crown"></i> ${currentUser.subscription}
                ${trialText}
            </div>
            <div class="user-info" style="display:flex; align-items:center; gap:0.5rem;">
                <i class="fas ${profileTypeIcon}"></i>
                <span>${currentUser.name}</span>
                <span class="profile-type-badge ${profileTypeClass}">${currentUser.profileType === 'company' ? 'Company' : 'Individual'}</span>
            </div>
            <button class="btn btn-outline" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i> Logout
            </button>
        `;
        
        const analyticsTab = document.getElementById('analyticsTab');
        if (analyticsTab) {
            analyticsTab.style.display = ['Professional', 'Dealer', 'Enterprise'].includes(currentUser.subscription) ? 'block' : 'none';
        }
    } else {
        section.innerHTML = `
            <div class="cart-icon" onclick="switchTab('cart')">
                <i class="fas fa-shopping-cart"></i>
                <span class="cart-count">${cartCount}</span>
            </div>
            <button class="btn btn-primary" onclick="openAuthModal()">
                <i class="fas fa-sign-in-alt"></i> Login / Register
            </button>
            <button class="btn btn-outline" onclick="switchTab('subscriptions')">
                <i class="fas fa-crown"></i> View Plans
            </button>
        `;
        
        const analyticsTab = document.getElementById('analyticsTab');
        if (analyticsTab) {
            analyticsTab.style.display = 'none';
        }
    }
}

function renderContent() {
    const container = document.getElementById('dynamicContent');
    if (!container) return;
    
    switch(currentTab) {
        case 'marketplace':
            renderMarketplace(container);
            break;
        case 'cart':
            renderCart(container);
            break;
        case 'profile':
            renderProfile(container);
            break;
        case 'specialists':
            renderSpecialists(container);
            break;
        case 'subscriptions':
            renderSubscriptions(container);
            break;
        case 'analytics':
            renderAnalytics(container);
            break;
    }
}

function renderMarketplace(container) {
    const showMakesSection = currentFilters.category === 'Vehicles';
    
    container.innerHTML = `
        <div class="categories-section">
            <div class="section-title">
                <h3>Browse Categories on ZimAutoTrader.com</h3>
                <button class="btn btn-primary" onclick="resetFilters()">
                    <i class="fas fa-sync-alt"></i> Reset Filters
                </button>
            </div>
            <div class="category-grid">
                ${renderCategoryCards()}
            </div>
        </div>

        <div class="makes-section ${showMakesSection ? 'visible' : ''}">
            <div class="section-title">
                <h3><i class="fas fa-car"></i> Search by Vehicle Make</h3>
            </div>
            <div class="makes-grid">
                ${renderMakeCards()}
            </div>
        </div>

        <div class="main-content">
            <div class="content-header">
                <h2>${getListingTitle()}</h2>
                <div style="display: flex; gap: 1rem;">
                    <select class="filter-select" id="locationFilter" onchange="applyLocationFilter()">
                        ${renderLocationOptions()}
                    </select>
                    <button class="btn btn-primary" onclick="openPostAdModal()">
                        <i class="fas fa-plus-circle"></i> Post Free Ad
                    </button>
                </div>
            </div>
            
            <div id="listingsContainer">
                ${renderListings()}
            </div>
        </div>
    `;
}

function renderCategoryCards() {
    const categories = [
        { id: 'Vehicles', icon: 'fa-car', name: 'Vehicles', count: getCategoryCount('Vehicles') },
        { id: 'Machinery', icon: 'fa-tractor', name: 'Farming Machinery', count: getCategoryCount('Machinery') },
        { id: 'Equipment', icon: 'fa-digging', name: 'Mining Equipment', count: getCategoryCount('Equipment') },
        { id: 'Parts', icon: 'fa-cog', name: 'Spare Parts', count: getCategoryCount('Parts') }
    ];
    
    return categories.map(cat => `
        <div class="category-card" onclick="filterByCategory('${cat.id}')">
            <i class="fas ${cat.icon}"></i>
            <h4>${cat.name}</h4>
            <small>${cat.count} listings</small>
        </div>
    `).join('');
}

function renderMakeCards() {
    const makes = [...new Set(listings.filter(l => l.make).map(l => l.make))];
    if (makes.length === 0) makes.push(...vehicleMakes.slice(0, 8));
    
    return makes.slice(0, 12).map(make => `
        <div class="make-card" onclick="filterByMake('${make}')">
            <i class="fas fa-car"></i>
            <div>${make}</div>
            <small>${getMakeCount(make)} listings</small>
        </div>
    `).join('');
}

function renderLocationOptions() {
    return '<option value="">📍 All Locations</option>' +
        zimbabweLocations.map(loc => `<option value="${loc}">${loc}</option>`).join('');
}

function renderListings() {
    let filteredListings = listings;
    
    if (currentFilters.category) {
        filteredListings = filteredListings.filter(l => l.category === currentFilters.category);
    }
    if (currentFilters.make) {
        filteredListings = filteredListings.filter(l => l.make === currentFilters.make);
    }
    if (currentFilters.location) {
        filteredListings = filteredListings.filter(l => l.location === currentFilters.location);
    }
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filteredListings = filteredListings.filter(l =>
                l.title.toLowerCase().includes(searchTerm) ||
                l.make?.toLowerCase().includes(searchTerm) ||
                l.description.toLowerCase().includes(searchTerm)
            );
        }
    }
    
    if (filteredListings.length === 0) {
        return `
            <div style="text-align: center; padding: 3rem;">
                <i class="fas fa-box-open" style="font-size: 4rem; color: #ccc;"></i>
                <h3>No listings found</h3>
                <p>Be the first to post in this category!</p>
            </div>
        `;
    }
    
    return `
        <div class="listings-grid">
            ${filteredListings.map(listing => {
                const inCart = isInCart(listing.id);
                const isAvailable = listing.status === 'available';
                
                return `
                <div class="listing-card" onclick="viewListing(${listing.id})">
                    <div class="listing-image">
                        <i class="fas ${getCategoryIcon(listing.category)}"></i>
                        <span class="status-badge ${isAvailable ? 'status-available' : 'status-sold'}">
                            ${isAvailable ? 'AVAILABLE' : 'SOLD'}
                        </span>
                        ${listing.sellerType === 'Dealer' ? '<span class="featured-badge">FEATURED</span>' : ''}
                    </div>
                    <div class="listing-content">
                        <h3 class="listing-title">${listing.title}</h3>
                        <div class="listing-price">$${listing.price.toLocaleString()}</div>
                        <div class="listing-meta">
                            <span><i class="fas fa-map-marker-alt"></i> ${listing.location}</span>
                            <span><i class="fas fa-calendar"></i> ${listing.date}</span>
                        </div>
                        <div class="seller-info">
                            <i class="fas ${listing.sellerProfileType === 'company' ? 'fa-building' : 'fa-user'}"></i>
                            <span>${listing.seller}</span>
                            <span class="profile-type-badge ${listing.sellerProfileType === 'company' ? 'profile-type-company' : 'profile-type-individual'}">
                                ${listing.sellerProfileType === 'company' ? 'Company' : 'Individual'}
                            </span>
                        </div>
                        <div class="listing-actions">
                            <button class="whatsapp-btn" onclick="event.stopPropagation(); contactSeller('${listing.whatsapp}', '${listing.title.replace(/'/g, "\\'")}')">
                                <i class="fab fa-whatsapp"></i> WhatsApp Seller
                            </button>
                            <button class="quote-btn" onclick="event.stopPropagation(); openQuotationModal(${listing.id})">
                                <i class="fas fa-file-invoice"></i> Request Quotation
                            </button>
                            <button class="add-to-cart-btn ${inCart ? 'in-cart' : ''}" 
                                    onclick="event.stopPropagation(); addToCart(${listing.id})"
                                    ${!isAvailable ? 'disabled' : ''}>
                                <i class="fas fa-shopping-cart"></i> 
                                ${inCart ? 'In Cart' : (isAvailable ? 'Add to Cart' : 'Sold Out')}
                            </button>
                        </div>
                    </div>
                </div>
            `}).join('')}
        </div>
    `;
}

function renderCart(container) {
    const cartTotal = getCartTotal();
    const tax = cartTotal * 0.15;
    const transportTotal = cart.reduce((sum, item) => sum + calculateTransportFee(item.location) * item.quantity, 0);
    const grandTotal = cartTotal + tax + transportTotal;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="cart-section">
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h2>Your cart is empty</h2>
                    <p>Browse our marketplace and add items to your cart!</p>
                    <button class="btn btn-primary" onclick="switchTab('marketplace')" style="margin-top: 2rem;">
                        <i class="fas fa-store"></i> Go to Marketplace
                    </button>
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="cart-section">
            <div class="cart-header">
                <h2><i class="fas fa-shopping-cart"></i> Shopping Cart (${cart.length} items)</h2>
                <button class="btn btn-outline" onclick="clearCart()" style="background: #f44336; color: white; border: none;">
                    <i class="fas fa-trash"></i> Clear Cart
                </button>
            </div>
            
            <div class="cart-items">
                ${cart.map(item => {
                    const listing = listings.find(l => l.id === item.id);
                    const isAvailable = listing && listing.status === 'available';
                    const itemTotal = item.price * item.quantity;
                    
                    return `
                        <div class="cart-item">
                            <div class="cart-item-image">
                                <i class="fas ${getCategoryIcon(item.category)}"></i>
                            </div>
                            <div class="cart-item-details">
                                <h4>${item.title}</h4>
                                <p style="color: #666; font-size: 0.9rem;">
                                    ${item.make ? item.make + ' • ' : ''}${item.location}
                                </p>
                                <p style="color: #666; font-size: 0.9rem;">
                                    Seller: ${item.seller} 
                                    <span class="profile-type-badge ${item.sellerProfileType === 'company' ? 'profile-type-company' : 'profile-type-individual'}">
                                        ${item.sellerProfileType === 'company' ? 'Company' : 'Individual'}
                                    </span>
                                </p>
                                ${!isAvailable ? '<p style="color: #f44336;"><i class="fas fa-exclamation-triangle"></i> This item may no longer be available</p>' : ''}
                            </div>
                            <div class="cart-item-price">
                                $${item.price.toLocaleString()}
                            </div>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, -1)">-</button>
                                <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, 1)">+</button>
                            </div>
                            <div class="cart-item-total">
                                $${itemTotal.toLocaleString()}
                            </div>
                            <button class="remove-item-btn" onclick="removeFromCart(${item.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div class="cart-summary">
                <h3>Order Summary</h3>
                <div class="cart-total-row">
                    <span>Subtotal (${cart.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                    <span>$${cartTotal.toLocaleString()}</span>
                </div>
                <div class="cart-total-row">
                    <span>VAT (15%):</span>
                    <span>$${tax.toLocaleString()}</span>
                </div>
                <div class="cart-total-row">
                    <span>Estimated Transport Fees:</span>
                    <span>$${transportTotal.toLocaleString()}</span>
                </div>
                <div class="cart-grand-total">
                    <span>Grand Total:</span>
                    <span>$${grandTotal.toLocaleString()}</span>
                </div>
                <button class="checkout-btn" onclick="checkoutCart()">
                    <i class="fas fa-file-invoice"></i> Proceed to Checkout & Get Quotation
                </button>
                <p style="text-align: center; margin-top: 1rem; color: #666; font-size: 0.9rem;">
                    <i class="fas fa-info-circle"></i> You'll receive a combined quotation with all items, VAT, and transport fees.
                </p>
            </div>
        </div>
    `;
}

function renderProfile(container) {
    if (!currentUser) {
        container.innerHTML = `
            <div style="padding: 3rem; text-align: center;">
                <i class="fas fa-user-circle" style="font-size: 4rem; color: #ccc;"></i>
                <h3>Please login to view your profile</h3>
                <button class="btn btn-primary" onclick="openAuthModal()" style="margin-top: 1rem;">
                    Login / Register
                </button>
            </div>
        `;
        return;
    }
    
    const userListings = listings.filter(l => l.seller === currentUser.name);
    const activeListings = userListings.filter(l => l.status === 'available');
    const soldListings = userListings.filter(l => l.status === 'sold');
    const totalViews = userListings.reduce((sum, l) => sum + (l.views || 0), 0);
    
    container.innerHTML = `
        <div class="profile-section">
            <div class="profile-header">
                <div class="profile-avatar">
                    <i class="fas ${currentUser.profileType === 'company' ? 'fa-building' : 'fa-user'}"></i>
                </div>
                <div class="profile-info">
                    <h2>
                        ${currentUser.name}
                        <span class="profile-type-badge ${currentUser.profileType === 'company' ? 'profile-type-company' : 'profile-type-individual'}">
                            ${currentUser.profileType === 'company' ? 'Company Account' : 'Individual Account'}
                        </span>
                    </h2>
                    <p><i class="fas fa-envelope"></i> ${currentUser.email}</p>
                    ${currentUser.regNumber ? `<p><i class="fas fa-file"></i> Reg Number: ${currentUser.regNumber}</p>` : ''}
                    ${currentUser.address ? `<p><i class="fas fa-map-marker-alt"></i> ${currentUser.address}</p>` : ''}
                    
                    <div class="profile-stats">
                        <div class="stat-item">
                            <div class="stat-value">${userListings.length}</div>
                            <div class="stat-label">Total Listings</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${activeListings.length}</div>
                            <div class="stat-label">Active</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${soldListings.length}</div>
                            <div class="stat-label">Sold</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${totalViews}</div>
                            <div class="stat-label">Total Views</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <h3 style="margin: 2rem 0 1rem;">My Listings</h3>
            <div class="listings-grid">
                ${userListings.length > 0 ? userListings.map(listing => `
                    <div class="listing-card" onclick="viewListing(${listing.id})">
                        <div class="listing-image">
                            <i class="fas ${getCategoryIcon(listing.category)}"></i>
                            <span class="status-badge ${listing.status === 'available' ? 'status-available' : 'status-sold'}">
                                ${listing.status === 'available' ? 'AVAILABLE' : 'SOLD'}
                            </span>
                        </div>
                        <div class="listing-content">
                            <h3 class="listing-title">${listing.title}</h3>
                            <div class="listing-price">$${listing.price.toLocaleString()}</div>
                            <div class="listing-meta">
                                <span><i class="fas fa-eye"></i> ${listing.views || 0} views</span>
                                <span><i class="fas fa-calendar"></i> ${listing.date}</span>
                            </div>
                        </div>
                    </div>
                `).join('') : '<p>No listings yet. Post your first ad!</p>'}
            </div>
        </div>
    `;
}

function renderSpecialists(container) {
    container.innerHTML = `
        <div class="specialists-section">
            <div class="section-title">
                <h2><i class="fas fa-tools"></i> Vehicle Brand Specialists</h2>
            </div>
            <div class="specialists-grid">
                ${vehicleSpecialists.map(spec => `
                    <div class="specialist-card" onclick="contactSpecialist('${spec.brand}')">
                        <i class="fas ${spec.icon}"></i>
                        <h4>${spec.brand} Specialist</h4>
                        <p>${spec.specialists}</p>
                        <small><i class="fas fa-check-circle"></i> Certified</small>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="specialists-section">
            <div class="section-title">
                <h2><i class="fas fa-star"></i> Reputable Service Providers</h2>
                <span class="verified-badge"><i class="fas fa-check"></i> Verified Businesses</span>
            </div>
            <div class="specialists-grid">
                ${reputableServices.map(service => `
                    <div class="specialist-card reputable" onclick="contactService('${service.name}')">
                        <i class="fas ${service.icon}"></i>
                        <h4>${service.name}</h4>
                        <p>${service.type}</p>
                        <small><i class="fas fa-map-marker-alt"></i> ${service.location}</small>
                        <span class="verified-badge">Verified</span>
                    </div>
                `).join('')}
            </div>
        </div>

        <div style="padding: 2rem; text-align: center;">
            <h3>Are you a service provider?</h3>
            <p style="margin: 1rem 0;">List your business and reach thousands of vehicle owners in Zimbabwe</p>
            <button class="btn btn-primary" onclick="openAuthModal()">
                <i class="fas fa-store"></i> Register Your Business
            </button>
        </div>
    `;
}

function renderSubscriptions(container) {
    container.innerHTML = `
        <div style="padding: 2rem;">
            <h2 style="text-align: center; margin-bottom: 1rem;">Choose Your Plan</h2>
            <div class="trial-offer-banner" style="margin-bottom: 2rem;">
                <i class="fas fa-gift"></i> 
                <strong>ALL PLANS INCLUDE A 7-DAY FREE TRIAL!</strong> 
                <i class="fas fa-gift"></i><br>
                <small>No credit card required for trial. Cancel anytime.</small>
            </div>
            <div class="plans-grid">
                ${subscriptionPlans.map(plan => `
                    <div class="plan-card ${plan.featured ? 'featured' : ''}">
                        <div class="plan-name" style="color: ${plan.color}">${plan.name}</div>
                        <div class="plan-price">
                            ${plan.price === 0 ? 'Free' : `$${plan.price}+`}
                            <small>/${plan.price === 0 ? 'forever' : 'month'}</small>
                        </div>
                        <div style="color: #666; margin-bottom: 1rem;">${plan.priceRange}</div>
                        <ul class="plan-features">
                            ${plan.features.map(f => `
                                <li><i class="fas fa-check"></i> ${f}</li>
                            `).join('')}
                        </ul>
                        <div class="trial-badge">
                            <i class="fas fa-gift"></i> 7-Day Free Trial Included
                        </div>
                        <button class="submit-btn" style="margin-top: 1rem;" onclick="upgradePlan('${plan.name}')">
                            ${currentUser && currentUser.subscription === plan.name ? 'Current Plan' : 'Start Free Trial'}
                        </button>
                    </div>
                `).join('')}
            </div>
            
            <div style="margin-top: 3rem; padding: 2rem; background: #f8f9fa; border-radius: 15px;">
                <h3>Need a custom enterprise solution?</h3>
                <p>Contact our sales team for custom pricing and dedicated support</p>
                <button class="btn btn-primary" style="margin-top: 1rem;" onclick="contactSales()">
                    <i class="fab fa-whatsapp"></i> Contact Sales via WhatsApp
                </button>
            </div>
        </div>
    `;
}

function renderAnalytics(container) {
    if (!currentUser || !['Professional', 'Dealer', 'Enterprise'].includes(currentUser.subscription)) {
        container.innerHTML = '<div style="padding:3rem; text-align:center;"><h3>Upgrade to Professional or higher to access analytics</h3></div>';
        return;
    }
    
    const userListings = listings.filter(l => l.seller === currentUser.name);
    const totalViews = userListings.reduce((sum, l) => sum + (l.views || 0), 0);
    
    container.innerHTML = `
        <div style="padding: 2rem;">
            <h2>Analytics Dashboard - ZimAutoTrader.com</h2>
            ${isInTrialPeriod() ? `
                <div class="trial-offer-banner">
                    <i class="fas fa-clock"></i> Trial Period: ${getTrialDaysLeft()} days remaining
                </div>
            ` : ''}
            <div class="analytics-grid">
                <div class="analytics-card">
                    <div class="analytics-value">${userListings.length}</div>
                    <div class="analytics-label">Active Listings</div>
                </div>
                <div class="analytics-card">
                    <div class="analytics-value">${totalViews}</div>
                    <div class="analytics-label">Total Views</div>
                </div>
                <div class="analytics-card">
                    <div class="analytics-value">${Math.round(totalViews / (userListings.length || 1))}</div>
                    <div class="analytics-label">Avg Views/Listing</div>
                </div>
            </div>
            
            <h3 style="margin: 2rem 0 1rem;">Recent Listing Performance</h3>
            <div style="background: white; border-radius: 15px; padding: 1.5rem;">
                ${userListings.slice(0, 5).map(l => `
                    <div style="display: flex; justify-content: space-between; padding: 1rem; border-bottom: 1px solid #eee;">
                        <div>
                            <strong>${l.title}</strong>
                            <div style="color: #666; font-size: 0.9rem;">${l.date}</div>
                        </div>
                        <div>
                            <i class="fas fa-eye"></i> ${l.views || 0} views
                        </div>
                    </div>
                `).join('')}
            </div>
            
            ${currentUser.subscription === 'Dealer' || currentUser.subscription === 'Enterprise' ? `
                <div style="margin-top: 2rem;">
                    <button class="btn btn-primary" onclick="exportLeads()">
                        <i class="fas fa-download"></i> Export Leads (CSV)
                    </button>
                </div>
            ` : ''}
        </div>
    `;
}

// ============================================
// CART FUNCTIONS
// ============================================

function addToCart(listingId) {
    const listing = listings.find(l => l.id === listingId);
    if (!listing || listing.status === 'sold') return;
    
    const existingItem = cart.find(item => item.id === listingId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: listing.id,
            title: listing.title,
            price: listing.price,
            category: listing.category,
            make: listing.make,
            location: listing.location,
            seller: listing.seller,
            sellerProfileType: listing.sellerProfileType,
            whatsapp: listing.whatsapp,
            quantity: 1
        });
    }
    
    localStorage.setItem('zimautotrader_cart', JSON.stringify(cart));
    updateCartCount();
    
    const cartBadge = document.querySelector('.cart-count');
    if (cartBadge) {
        cartBadge.classList.add('cart-badge-pulse');
        setTimeout(() => cartBadge.classList.remove('cart-badge-pulse'), 500);
    }
    
    alert(`✅ "${listing.title}" added to cart!`);
    
    if (currentTab === 'marketplace') {
        renderMarketplace(document.getElementById('dynamicContent'));
    }
}

function removeFromCart(listingId) {
    cart = cart.filter(item => item.id !== listingId);
    localStorage.setItem('zimautotrader_cart', JSON.stringify(cart));
    updateCartCount();
    if (currentTab === 'cart') {
        renderCart(document.getElementById('dynamicContent'));
    }
    renderUserSection();
}

function updateCartQuantity(listingId, change) {
    const item = cart.find(item => item.id === listingId);
    if (item) {
        item.quantity = Math.max(1, item.quantity + change);
        localStorage.setItem('zimautotrader_cart', JSON.stringify(cart));
        updateCartCount();
        if (currentTab === 'cart') {
            renderCart(document.getElementById('dynamicContent'));
        }
        renderUserSection();
    }
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-count');
    badges.forEach(badge => {
        badge.textContent = count;
    });
}

function isInCart(listingId) {
    return cart.some(item => item.id === listingId);
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        localStorage.setItem('zimautotrader_cart', JSON.stringify(cart));
        updateCartCount();
        renderCart(document.getElementById('dynamicContent'));
        renderUserSection();
    }
}

function checkoutCart() {
    if (!currentUser) {
        alert('Please login to proceed with checkout');
        openAuthModal();
        return;
    }
    
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    
    openCartQuotationModal();
}

function openCartQuotationModal() {
    const cartTotal = getCartTotal();
    const tax = cartTotal * 0.15;
    const transportTotal = cart.reduce((sum, item) => sum + calculateTransportFee(item.location) * item.quantity, 0);
    const grandTotal = cartTotal + tax + transportTotal;
    
    const content = document.getElementById('quotationContent');
    content.innerHTML = `
        <div class="quotation-details">
            <h3 style="margin-bottom: 1rem;">Cart Quotation (${cart.length} items)</h3>
            
            <div style="max-height: 300px; overflow-y: auto; margin-bottom: 1rem;">
                ${cart.map(item => `
                    <div style="padding: 0.5rem 0; border-bottom: 1px solid #eee;">
                        <strong>${item.title}</strong> x${item.quantity}<br>
                        <small>$${item.price.toLocaleString()} each • ${item.location}</small>
                    </div>
                `).join('')}
            </div>
            
            <div class="quotation-row">
                <span>Items Subtotal:</span>
                <span>$${cartTotal.toLocaleString()}</span>
            </div>
            <div class="quotation-row">
                <span>VAT (15%):</span>
                <span>$${tax.toLocaleString()}</span>
            </div>
            <div class="quotation-row">
                <span>Transport Fees (Estimated):</span>
                <span>$${transportTotal.toLocaleString()}</span>
            </div>
            <div class="quotation-total">
                <span>Total Estimate:</span>
                <span>$${grandTotal.toLocaleString()}</span>
            </div>
            <p style="margin-top: 1rem; color: #666; font-size: 0.9rem;">
                <i class="fas fa-info-circle"></i> Transport fees are estimated based on distance from major cities.
            </p>
        </div>
        
        <form id="quotationForm" onsubmit="sendCartQuotation(event)">
            <div class="form-group">
                <label>Your Email Address</label>
                <input type="email" id="buyerEmail" value="${currentUser?.email || ''}" required>
            </div>
            <div class="form-group">
                <label>Your Full Name</label>
                <input type="text" id="buyerName" value="${currentUser?.name || ''}" required>
            </div>
            <div class="form-group">
                <label>Delivery Address</label>
                <textarea id="deliveryAddress" rows="3" required placeholder="Enter your full delivery address in Zimbabwe"></textarea>
            </div>
            <div class="form-group">
                <label>Additional Notes (Optional)</label>
                <textarea id="additionalNotes" rows="2" placeholder="Any special delivery instructions..."></textarea>
            </div>
            
            <input type="hidden" id="quotationSubtotal" value="${cartTotal}">
            <input type="hidden" id="quotationTax" value="${tax}">
            <input type="hidden" id="quotationTransport" value="${transportTotal}">
            <input type="hidden" id="quotationTotal" value="${grandTotal}">
            
            <button type="submit" class="submit-btn">
                <i class="fas fa-paper-plane"></i> Send Combined Quotation to Email
            </button>
        </form>
    `;
    
    document.getElementById('quotationModal').classList.add('active');
}

function sendCartQuotation(event) {
    event.preventDefault();
    
    const buyerEmail = document.getElementById('buyerEmail').value;
    const buyerName = document.getElementById('buyerName').value;
    const deliveryAddress = document.getElementById('deliveryAddress').value;
    const additionalNotes = document.getElementById('additionalNotes').value;
    const subtotal = parseFloat(document.getElementById('quotationSubtotal').value);
    const tax = parseFloat(document.getElementById('quotationTax').value);
    const transport = parseFloat(document.getElementById('quotationTransport').value);
    const total = parseFloat(document.getElementById('quotationTotal').value);
    
    const quoteRef = 'ZAT-CART-' + Date.now().toString().slice(-8);
    
    const itemsList = cart.map(item =>
        `- ${item.title} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toLocaleString()}`
    ).join('\n');
    
    const sellersList = [...new Set(cart.map(item => `${item.seller}: ${item.whatsapp}`))].join('\n');
    
    console.log('Cart Quotation Generated:', { quoteRef, buyerEmail, items: cart });
    
    const quotations = JSON.parse(localStorage.getItem('zimautotrader_quotations')) || [];
    quotations.push({
        id: quoteRef,
        date: new Date().toISOString(),
        buyerEmail,
        buyerName,
        items: cart.map(item => item.id),
        total,
        status: 'sent',
        type: 'cart'
    });
    localStorage.setItem('zimautotrader_quotations', JSON.stringify(quotations));
    
    closeModal('quotationModal');
    
    cart = [];
    localStorage.setItem('zimautotrader_cart', JSON.stringify(cart));
    updateCartCount();
    renderUserSection();
    
    alert(`✅ Combined quotation ${quoteRef} has been sent to ${buyerEmail}!\n\nYour cart has been cleared. Please contact the sellers via WhatsApp to complete your purchases.`);
}

// ============================================
// MODAL FUNCTIONS
// ============================================

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function openAuthModal() {
    document.getElementById('authModal').classList.add('active');
}

function openPostAdModal() {
    if (!currentUser) {
        alert('Please login to post an ad on ZimAutoTrader.com');
        openAuthModal();
        return;
    }
    
    const userListings = listings.filter(l => l.seller === currentUser.name);
    const limits = {
        'Basic': 1,
        'Professional': 50,
        'Dealer': Infinity,
        'Enterprise': Infinity
    };
    
    if (userListings.length >= limits[currentUser.subscription]) {
        alert(`You've reached your listing limit. Upgrade to Professional or higher for more listings.`);
        switchTab('subscriptions');
        return;
    }
    
    document.getElementById('postAdModal').classList.add('active');
}

function openQuotationModal(listingId) {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) return;
    currentListing = listing;
    
    const subtotal = listing.price;
    const tax = subtotal * 0.15;
    const transportFee = calculateTransportFee(listing.location);
    const total = subtotal + tax + transportFee;
    
    const content = document.getElementById('quotationContent');
    content.innerHTML = `
        <div class="quotation-details">
            <h3 style="margin-bottom: 1rem;">${listing.title}</h3>
            <div class="quotation-row">
                <span>Item Price:</span>
                <span>$${subtotal.toLocaleString()}</span>
            </div>
            <div class="quotation-row">
                <span>VAT (15%):</span>
                <span>$${tax.toLocaleString()}</span>
            </div>
            <div class="quotation-row">
                <span>Transport to ${listing.location}:</span>
                <span>$${transportFee.toLocaleString()}</span>
            </div>
            <div class="quotation-total">
                <span>Total Estimate:</span>
                <span>$${total.toLocaleString()}</span>
            </div>
            <p style="margin-top: 1rem; color: #666; font-size: 0.9rem;">
                <i class="fas fa-info-circle"></i> Transport fees are estimated based on distance from major cities.
            </p>
        </div>
        
        <form id="quotationForm" onsubmit="sendQuotation(event)">
            <div class="form-group">
                <label>Your Email Address</label>
                <input type="email" id="buyerEmail" value="${currentUser?.email || ''}" required>
            </div>
            <div class="form-group">
                <label>Your Full Name</label>
                <input type="text" id="buyerName" value="${currentUser?.name || ''}" required>
            </div>
            <div class="form-group">
                <label>Delivery Address</label>
                <textarea id="deliveryAddress" rows="3" required placeholder="Enter your full delivery address in Zimbabwe"></textarea>
            </div>
            <div class="form-group">
                <label>Additional Notes (Optional)</label>
                <textarea id="additionalNotes" rows="2" placeholder="Any special delivery instructions..."></textarea>
            </div>
            
            <input type="hidden" id="quotationSubtotal" value="${subtotal}">
            <input type="hidden" id="quotationTax" value="${tax}">
            <input type="hidden" id="quotationTransport" value="${transportFee}">
            <input type="hidden" id="quotationTotal" value="${total}">
            
            <button type="submit" class="submit-btn">
                <i class="fas fa-paper-plane"></i> Send Quotation to Email
            </button>
        </form>
    `;
    
    closeModal('listingDetailModal');
    document.getElementById('quotationModal').classList.add('active');
}

function sendQuotation(event) {
    event.preventDefault();
    
    if (!currentListing) {
        alert('No listing selected');
        return;
    }
    
    const buyerEmail = document.getElementById('buyerEmail').value;
    const buyerName = document.getElementById('buyerName').value;
    const deliveryAddress = document.getElementById('deliveryAddress').value;
    const additionalNotes = document.getElementById('additionalNotes').value;
    const subtotal = parseFloat(document.getElementById('quotationSubtotal').value);
    const tax = parseFloat(document.getElementById('quotationTax').value);
    const transport = parseFloat(document.getElementById('quotationTransport').value);
    const total = parseFloat(document.getElementById('quotationTotal').value);
    
    const quoteRef = 'ZAT-' + Date.now().toString().slice(-8);
    
    console.log('Quotation Generated:', { quoteRef, buyerEmail, listing: currentListing.id });
    
    const quotations = JSON.parse(localStorage.getItem('zimautotrader_quotations')) || [];
    quotations.push({
        id: quoteRef,
        date: new Date().toISOString(),
        buyerEmail,
        buyerName,
        listing: currentListing.id,
        total,
        status: 'sent'
    });
    localStorage.setItem('zimautotrader_quotations', JSON.stringify(quotations));
    
    closeModal('quotationModal');
    
    alert(`✅ Quotation ${quoteRef} has been generated and sent to ${buyerEmail}!\n\nCheck your email for the complete quotation including item price, VAT (15%), and transport fees.\n\nPlease contact the seller via WhatsApp to proceed with the purchase.`);
}

function viewListing(id) {
    const listing = listings.find(l => l.id === id);
    if (!listing) return;
    currentListing = listing;
    const inCart = isInCart(listing.id);
    const isAvailable = listing.status === 'available';
    
    listing.views = (listing.views || 0) + 1;
    localStorage.setItem('zimautotrader_listings', JSON.stringify(listings));
    
    const content = document.getElementById('listingDetailContent');
    content.innerHTML = `
        <div style="text-align: center; margin-bottom: 2rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">
                <i class="fas ${getCategoryIcon(listing.category)}"></i>
            </div>
            <div style="display: flex; justify-content: center; gap: 1rem; margin-bottom: 1rem;">
                <span class="status-badge ${isAvailable ? 'status-available' : 'status-sold'}">
                    ${isAvailable ? 'AVAILABLE' : 'SOLD'}
                </span>
                ${listing.sellerType === 'Dealer' ? '<span class="featured-badge">FEATURED</span>' : ''}
            </div>
            <h2 style="color: #1a472a; margin-bottom: 0.5rem;">${listing.title}</h2>
            ${listing.make ? `<p><i class="fas fa-tag"></i> ${listing.make}</p>` : ''}
            <div style="font-size: 2rem; color: #1a472a; font-weight: bold; margin: 1rem 0;">
                $${listing.price.toLocaleString()}
            </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px; margin-bottom: 1.5rem;">
            <h3>Description</h3>
            <p style="line-height: 1.6; margin-top: 0.5rem;">${listing.description}</p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
            <div><strong><i class="fas fa-tag"></i> Category:</strong> ${listing.category}</div>
            <div><strong><i class="fas fa-map-marker-alt"></i> Location:</strong> ${listing.location}</div>
            <div>
                <strong><i class="fas ${listing.sellerProfileType === 'company' ? 'fa-building' : 'fa-user'}"></i> Seller:</strong> 
                ${listing.seller}
                <span class="profile-type-badge ${listing.sellerProfileType === 'company' ? 'profile-type-company' : 'profile-type-individual'}">
                    ${listing.sellerProfileType === 'company' ? 'Company' : 'Individual'}
                </span>
            </div>
            <div><strong><i class="fas fa-calendar"></i> Posted:</strong> ${listing.date}</div>
            <div><strong><i class="fas fa-eye"></i> Views:</strong> ${listing.views || 0}</div>
        </div>
        
        <div class="listing-actions">
            <button class="whatsapp-btn" onclick="contactSeller('${listing.whatsapp}', '${listing.title.replace(/'/g, "\\'")}')">
                <i class="fab fa-whatsapp"></i> Contact Seller via WhatsApp
            </button>
            <button class="quote-btn" onclick="openQuotationModal(${listing.id})">
                <i class="fas fa-file-invoice"></i> Request Quotation
            </button>
            <button class="add-to-cart-btn ${inCart ? 'in-cart' : ''}" 
                    onclick="addToCart(${listing.id}); closeModal('listingDetailModal');"
                    ${!isAvailable ? 'disabled' : ''}>
                <i class="fas fa-shopping-cart"></i> 
                ${inCart ? 'In Cart' : (isAvailable ? 'Add to Cart' : 'Sold Out')}
            </button>
        </div>
        
        <button class="submit-btn" onclick="closeModal('listingDetailModal')" style="margin-top: 1rem; background: #666;">
            Close
        </button>
    `;
    
    document.getElementById('listingDetailModal').classList.add('active');
}

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    document.getElementById('modalTitle').textContent = isLoginMode ? 'Login to ZimAutoTrader.com' : 'Register on ZimAutoTrader.com';
    document.getElementById('authSubmitBtn').textContent = isLoginMode ? 'Login' : 'Register';
    document.getElementById('switchText').textContent = isLoginMode ? "Don't have an account?" : "Already have an account?";
    document.getElementById('switchLink').textContent = isLoginMode ? 'Register' : 'Login';
    document.getElementById('registerNameGroup').style.display = isLoginMode ? 'none' : 'block';
    document.getElementById('profileTypeGroup').style.display = isLoginMode ? 'none' : 'block';
    document.getElementById('companyDetailsGroup').style.display = 'none';
}

function selectProfileType(type) {
    selectedProfileType = type;
    document.getElementById('authProfileType').value = type;
    
    document.querySelectorAll('.profile-type-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    document.getElementById(type + 'Option').classList.add('selected');
    
    document.getElementById('companyDetailsGroup').style.display = type === 'company' ? 'block' : 'none';
}

function handleAuthSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    
    if (isLoginMode) {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            currentUser = user;
            localStorage.setItem('zimautotrader_user', JSON.stringify(user));
            renderUserSection();
            closeModal('authModal');
            
            const trialMsg = isInTrialPeriod() && user.subscription !== 'Basic' ?
                `\nYour ${user.subscription} trial has ${getTrialDaysLeft()} days remaining.` : '';
            alert('Welcome back to ZimAutoTrader.com, ' + user.name + '!' + trialMsg);
        } else {
            alert('Invalid email or password');
        }
    } else {
        const name = document.getElementById('authName').value;
        if (!name) {
            alert('Please enter your full name or company name');
            return;
        }
        
        if (users.find(u => u.email === email)) {
            alert('Email already registered');
            return;
        }
        
        const profileType = document.getElementById('authProfileType').value;
        const regNumber = document.getElementById('authRegNumber').value;
        const address = document.getElementById('authAddress').value;
        
        const newUser = {
            email,
            password,
            name,
            profileType,
            regNumber: profileType === 'company' ? regNumber : null,
            address: profileType === 'company' ? address : null,
            subscription: 'Basic',
            listingsCount: 0
        };
        users.push(newUser);
        localStorage.setItem('zimautotrader_users', JSON.stringify(users));
        currentUser = newUser;
        localStorage.setItem('zimautotrader_user', JSON.stringify(newUser));
        renderUserSection();
        closeModal('authModal');
        alert(`Welcome to ZimAutoTrader.com, ${name}!\n\nYou've registered as a ${profileType === 'company' ? 'Company' : 'Individual'} account.\nStart with our Free Basic plan or upgrade to a 7-day free trial of our premium plans.`);
    }
    
    document.getElementById('authForm').reset();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('zimautotrader_user');
    renderUserSection();
    renderContent();
    alert('You have been logged out of ZimAutoTrader.com');
}

// ============================================
// POST AD FUNCTIONS
// ============================================

function toggleMakeField() {
    const category = document.getElementById('adCategory').value;
    const makeField = document.getElementById('makeFieldGroup');
    makeField.style.display = category === 'Vehicles' ? 'block' : 'none';
}

function handlePostAdSubmit(e) {
    e.preventDefault();
    
    const category = document.getElementById('adCategory').value;
    const make = category === 'Vehicles' ? document.getElementById('adMake').value : null;
    
    const newListing = {
        id: Date.now(),
        category: category,
        make: make,
        title: document.getElementById('adTitle').value,
        price: parseFloat(document.getElementById('adPrice').value),
        location: document.getElementById('adLocation').value,
        description: document.getElementById('adDescription').value,
        whatsapp: document.getElementById('adWhatsapp').value,
        status: document.getElementById('adStatus').value,
        seller: currentUser.name,
        sellerType: currentUser.subscription === 'Basic' ? 'Private' :
                   currentUser.subscription === 'Professional' ? 'Professional' : 'Dealer',
        sellerProfileType: currentUser.profileType || 'individual',
        date: new Date().toISOString().split('T')[0],
        views: 0
    };
    
    listings.unshift(newListing);
    localStorage.setItem('zimautotrader_listings', JSON.stringify(listings));
    
    closeModal('postAdModal');
    document.getElementById('postAdForm').reset();
    renderContent();
    
    alert('Your ad has been posted successfully on ZimAutoTrader.com!');
}

// ============================================
// FILTER FUNCTIONS
// ============================================

function filterByCategory(category) {
    currentFilters.category = category;
    currentFilters.make = null;
    switchTab('marketplace');
}

function filterByMake(make) {
    currentFilters.make = make;
    switchTab('marketplace');
}

function applyLocationFilter() {
    const locationFilter = document.getElementById('locationFilter');
    if (locationFilter) {
        currentFilters.location = locationFilter.value;
        renderMarketplace(document.getElementById('dynamicContent'));
    }
}

function resetFilters() {
    currentFilters = { category: null, make: null, location: null };
    renderMarketplace(document.getElementById('dynamicContent'));
}

// ============================================
// CONTACT FUNCTIONS
// ============================================

function contactSeller(whatsapp, title) {
    const message = `Hi, I'm interested in your listing on ZimAutoTrader.com: ${title}`;
    const url = `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function contactSpecialist(brand) {
    const specialist = vehicleSpecialists.find(s => s.brand === brand);
    alert(`Contact ${specialist.specialists} for ${brand} services\n\nVisit our Specialists page on ZimAutoTrader.com to see contact details and book an appointment.`);
}

function contactService(name) {
    alert(`Contact ${name}\n\nVisit our Services page on ZimAutoTrader.com to see full contact details and customer reviews.`);
}

function contactSales() {
    window.open('https://wa.me/263712345678?text=Hi%2C%20I%27m%20interested%20in%20the%20Enterprise%20plan%20on%20ZimAutoTrader.com', '_blank');
}

// ============================================
// SUBSCRIPTION FUNCTIONS
// ============================================

function upgradePlan(planName) {
    if (!currentUser) {
        alert('Please login first to start your free trial!');
        openAuthModal();
        return;
    }
    
    if (planName !== 'Basic') {
        currentUser.trialEnds = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    }
    
    currentUser.subscription = planName;
    localStorage.setItem('zimautotrader_user', JSON.stringify(currentUser));
    renderUserSection();
    
    if (planName === 'Basic') {
        alert(`You are now on the Basic (Free) plan.`);
    } else {
        alert(`Success! You've started your 7-day free trial of the ${planName} plan on ZimAutoTrader.com!\n\nEnjoy all features for 7 days. No charges will be made during the trial period.`);
    }
    
    switchTab('marketplace');
}

function exportLeads() {
    const userListings = listings.filter(l => l.seller === currentUser.name);
    const csv = [
        ['Title', 'Price', 'Views', 'Date', 'Status', 'WhatsApp'].join(','),
        ...userListings.map(l => [l.title, l.price, l.views || 0, l.date, l.status, l.whatsapp].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zimautotrader-leads.csv';
    a.click();
}

// ============================================
// NAVIGATION
// ============================================

function switchTab(tab) {
    currentTab = tab;
    
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    currentFilters = { category: null, make: null, location: null };
    renderContent();
}

// ============================================
// START THE APP
// ============================================

document.addEventListener('DOMContentLoaded', init);

// Make functions globally available for onclick handlers
window.switchTab = switchTab;
window.openAuthModal = openAuthModal;
window.closeModal = closeModal;
window.filterByCategory = filterByCategory;
window.filterByMake = filterByMake;
window.applyLocationFilter = applyLocationFilter;
window.resetFilters = resetFilters;
window.openPostAdModal = openPostAdModal;
window.viewListing = viewListing;
window.openQuotationModal = openQuotationModal;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.clearCart = clearCart;
window.checkoutCart = checkoutCart;
window.contactSeller = contactSeller;
window.contactSpecialist = contactSpecialist;
window.contactService = contactService;
window.contactSales = contactSales;
window.upgradePlan = upgradePlan;
window.exportLeads = exportLeads;
window.logout = logout;
window.selectProfileType = selectProfileType;
window.toggleAuthMode = toggleAuthMode;
window.toggleMakeField = toggleMakeField;