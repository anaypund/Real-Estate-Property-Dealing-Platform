// Homepage Script - Fetch and display featured properties
document.addEventListener('DOMContentLoaded', async function () {
    // Update navigation
    AuthService.updateNavigation();

    // Add navigation event listeners
    const signInBtn = document.querySelector('[data-auth="signin"]');
    const listPropertyBtn = document.querySelector('[data-auth="list-property"]');

    if (signInBtn) {
        signInBtn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }

    if (listPropertyBtn) {
        listPropertyBtn.addEventListener('click', () => {
            const user = AuthService.getUser();
            if (user && (user.role === 'seller' || user.role === 'agent')) {
                window.location.href = 'seller-dashboard.html';
            } else {
                window.location.href = 'login.html';
            }
        });
    }

    // Search functionality
    const searchInput = document.querySelector('input[placeholder*="Search"]') ||
        document.querySelector('input[placeholder*="search"]');
    const searchBtn = document.querySelector('[data-action="search"]') ||
        document.querySelector('button:has(.material-symbols-outlined)') ||
        Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.trim() === 'Search');

    if (searchBtn && searchInput) {
        const handleSearch = () => {
            const searchQuery = searchInput.value.trim();
            if (searchQuery) {
                // Redirect to properties page with search query
                window.location.href = `properties.html?search=${encodeURIComponent(searchQuery)}`;
            } else {
                // If empty, just go to properties page
                window.location.href = 'properties.html';
            }
        };

        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    // Load featured properties
    await loadFeaturedProperties();

    // View all listings link
    const viewAllLink = document.querySelector('a[href="#"]');
    if (viewAllLink && viewAllLink.textContent.includes('View all listings')) {
        viewAllLink.href = 'properties.html';
    }
});

async function loadFeaturedProperties() {
    try {
        const response = await PropertyService.getFeaturedProperties();

        if (response.success && response.data.length > 0) {
            renderFeaturedProperties(response.data);
        }
    } catch (error) {
        console.error('Error loading featured properties:', error);
        // Keep static properties as fallback
    }
}

function renderFeaturedProperties(properties) {
    const propertiesGrid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');

    if (!propertiesGrid) return;

    // Clear existing properties
    propertiesGrid.innerHTML = '';

    // Render up to 3 featured properties
    properties.slice(0, 3).forEach(property => {
        const propertyCard = createPropertyCard(property);
        propertiesGrid.appendChild(propertyCard);
    });
}

function createPropertyCard(property) {
    const card = document.createElement('div');
    card.className = 'group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500';
    card.style.cursor = 'pointer';
    card.onclick = () => window.location.href = `property-details.html?id=${property._id}`;

    const imageUrl = property.images && property.images.length > 0
        ? getImageUrl(property.images[0])
        : 'https://via.placeholder.com/400x300?text=No+Image';

    card.innerHTML = `
        <div class="relative aspect-[4/3] overflow-hidden">
            <div class="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style="background-image: url('${imageUrl}');"></div>
            <div class="absolute top-4 left-4 flex gap-2">
                ${property.status === 'active' ? '<span class="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider">New Listing</span>' : ''}
                ${property.featured ? '<span class="bg-primary text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider">Featured</span>' : ''}
            </div>
            <button class="absolute top-4 right-4 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-red-500 p-2 rounded-full transition-all" onclick="event.stopPropagation(); handleFavorite('${property._id}')">
                <span class="material-symbols-outlined">favorite</span>
            </button>
        </div>
        <div class="p-6 space-y-4">
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="text-xl font-display font-bold text-slate-900 dark:text-white">${formatPrice(property.price)}</h3>
                    <p class="text-slate-500 dark:text-slate-400 text-sm">${property.location.city}</p>
                </div>
            </div>
            <div class="flex items-center justify-between py-4 border-y border-slate-50 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium">
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-[18px]">bed</span> ${property.bedrooms} Beds
                </div>
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-[18px]">bathtub</span> ${property.bathrooms} Baths
                </div>
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-[18px]">square_foot</span> ${property.sqft.toLocaleString()} sqft
                </div>
            </div>
        </div>
    `;

    return card;
}

async function handleFavorite(propertyId) {
    if (!AuthService.isAuthenticated()) {
        showToast('Please login to save properties', 'info');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }

    try {
        await BuyerService.addFavorite(propertyId);
        showToast('Property saved to favorites!', 'success');
    } catch (error) {
        showToast(error.message || 'Failed to save property', 'error');
    }
}
