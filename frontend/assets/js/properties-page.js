// Properties Listing Page Script
let currentFilters = {
    city: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    propertyType: '',
    amenities: [],
    page: 1,
    limit: 6,
    sort: '-createdAt'
};

document.addEventListener('DOMContentLoaded', async function () {
    // Get filters from URL if any
    const urlParams = getQueryParams();
    if (urlParams.city) currentFilters.city = urlParams.city;

    AuthService.updateNavigation();

    // Initialize page
    await loadProperties();
    setupFilterHandlers();
    setupSortHandler();
});

async function loadProperties() {
    showLoader();

    try {
        const response = await PropertyService.getProperties(currentFilters);

        hideLoader();

        if (response.success && response.data) {
            renderProperties(response.data);
            updatePagination(response);
            updateResultsCount(response.count, response.totalPages);
        } else {
            renderEmptyState();
        }
    } catch (error) {
        hideLoader();
        showToast(error.message || 'Failed to load properties', 'error');
        renderEmptyState();
    }
}

function renderProperties(properties) {
    const grid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.xl\\:grid-cols-3');

    if (!grid) return;

    // Clear existing except the map card
    const mapCard = grid.querySelector('.relative.bg-primary\\/5');
    grid.innerHTML = '';

    if (properties.length === 0) {
        renderEmptyState();
        return;
    }

    properties.forEach(property => {
        const card = createPropertyCard(property);
        grid.appendChild(card);
    });

    // Add back map card
    if (mapCard) {
        grid.appendChild(mapCard);
    }
}

function createPropertyCard(property) {
    const card = document.createElement('div');
    card.className = 'group bg-white dark:bg-white/5 rounded-2xl overflow-hidden border border-[#e2e4e9] dark:border-white/10 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300';
    card.style.cursor = 'pointer';

    const imageUrl = property.images && property.images.length > 0
        ? getImageUrl(property.images[0])
        : 'https://via.placeholder.com/400x300?text=No+Image';

    const statusBadge = property.status === 'active' ?
        `<div class="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5">
            <div class="size-2 rounded-full bg-green-500 animate-pulse"></div>
            <span class="text-[10px] font-bold uppercase tracking-widest">New Listing</span>
        </div>` : '';

    card.innerHTML = `
        <div class="relative aspect-[4/3] overflow-hidden" onclick="window.location.href='property-details.html?id=${property._id}'">
            <div class="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" 
                style="background-image: url('${imageUrl}');"></div>
            ${statusBadge}
            <button class="absolute top-4 right-4 size-9 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md flex items-center justify-center text-white transition-all" 
                onclick="event.stopPropagation(); handleFavoriteToggle('${property._id}', this)">
                <span class="material-symbols-outlined text-[20px]">favorite</span>
            </button>
            <div class="absolute bottom-4 left-4 bg-primary text-white px-4 py-1.5 rounded-xl font-bold text-lg shadow-xl">
                ${formatPrice(property.price)}
            </div>
        </div>
        <div class="p-5 space-y-3" onclick="window.location.href='property-details.html?id=${property._id}'">
            <div>
                <h3 class="font-bold text-lg leading-tight group-hover:text-primary transition-colors">${property.title || 'Untitled Property'}</h3>
                <div class="flex items-center gap-1 text-gray-500 text-xs mt-1">
                    <span class="material-symbols-outlined text-sm">location_on</span>
                    ${property.location.city}${property.location.state ? ', ' + property.location.state : ''}
                </div>
            </div>
            <div class="flex items-center justify-between pt-4 border-t border-[#e2e4e9] dark:border-white/10">
                <div class="flex flex-col gap-0.5">
                    <span class="text-[10px] uppercase font-bold text-gray-400">Bedrooms</span>
                    <div class="flex items-center gap-1.5 font-bold">
                        <span class="material-symbols-outlined text-lg text-primary">bed</span> ${property.bedrooms} BHK
                    </div>
                </div>
                <div class="flex flex-col gap-0.5">
                    <span class="text-[10px] uppercase font-bold text-gray-400">Total Area</span>
                    <div class="flex items-center gap-1.5 font-bold">
                        <span class="material-symbols-outlined text-lg text-primary">straighten</span>
                        ${property.sqft.toLocaleString()} sq ft
                    </div>
                </div>
                <div class="flex flex-col gap-0.5">
                    <span class="text-[10px] uppercase font-bold text-gray-400">Bath</span>
                    <div class="flex items-center gap-1.5 font-bold">
                        <span class="material-symbols-outlined text-lg text-primary">bathtub</span> ${property.bathrooms}
                    </div>
                </div>
            </div>
        </div>
    `;

    return card;
}

async function handleFavoriteToggle(propertyId, button) {
    if (!AuthService.isAuthenticated()) {
        showToast('Please login to save properties', 'info');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }

    try {
        await BuyerService.addFavorite(propertyId);
        button.querySelector('span').classList.add('fill-1');
        button.classList.add('text-red-500');
        showToast('Property saved to favorites!', 'success');
    } catch (error) {
        if (error.message && error.message.includes('already')) {
            showToast('Property already in favorites', 'info');
        } else {
            showToast(error.message || 'Failed to save property', 'error');
        }
    }
}

function setupFilterHandlers() {
    // Property type chips
    document.querySelectorAll('.px-3.py-1\\.5.rounded-lg').forEach(chip => {
        chip.addEventListener('click', function () {
            // Reset all chips
            document.querySelectorAll('.px-3.py-1\\.5.rounded-lg').forEach(c => {
                c.classList.remove('bg-primary', 'text-white');
                c.classList.add('bg-[#f1f1f4]', 'dark:bg-white/5');
            });

            // Activate clicked chip
            this.classList.add('bg-primary', 'text-white');
            this.classList.remove('bg-[#f1f1f4]', 'dark:bg-white/5');

            currentFilters.propertyType = this.textContent.trim();
        });
    });

    // Bedrooms segmented control
    document.querySelectorAll('.flex.bg-\\[\\#f1f1f4\\] button').forEach((btn, index) => {
        btn.addEventListener('click', function () {
            // Reset all buttons
            document.querySelectorAll('.flex.bg-\\[\\#f1f1f4\\] button').forEach(b => {
                b.classList.remove('bg-white', 'dark:bg-white/10', 'shadow-sm');
            });

            // Activate clicked button
            this.classList.add('bg-white', 'dark:bg-white/10', 'shadow-sm');

            const text = this.textContent.trim();
            if (text === 'Any') {
                currentFilters.bedrooms = '';
            } else {
                currentFilters.bedrooms = parseInt(text.replace('+', ''));
            }
        });
    });

    // Amenities checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const amenity = this.nextElementSibling.textContent.trim();
            if (this.checked) {
                if (!currentFilters.amenities.includes(amenity)) {
                    currentFilters.amenities.push(amenity);
                }
            } else {
                currentFilters.amenities = currentFilters.amenities.filter(a => a !== amenity);
            }
        });
    });

    // Apply filters button
    const applyBtn = document.querySelector('button.w-full.bg-primary.text-white.py-3');
    if (applyBtn) {
        applyBtn.addEventListener('click', async () => {
            currentFilters.page = 1; // Reset to first page
            await loadProperties();
        });
    }

    // Reset filters
    const resetBtn = document.querySelector('button.text-xs.font-bold.text-primary');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            currentFilters = { page: 1, limit: 6, sort: '-createdAt' };
            location.reload();
        });
    }
}

function setupSortHandler() {
    const sortSelect = document.querySelector('select');
    if (sortSelect) {
        sortSelect.addEventListener('change', async function () {
            const value = this.value;
            switch (value) {
                case 'Price: Low to High':
                    currentFilters.sort = 'price';
                    break;
                case 'Price: High to Low':
                    currentFilters.sort = '-price';
                    break;
                case 'Sq Ft: Largest First':
                    currentFilters.sort = '-sqft';
                    break;
                default:
                    currentFilters.sort = '-createdAt';
            }
            currentFilters.page = 1;
            await loadProperties();
        });
    }
}

function updatePagination(response) {
    const loadMoreBtn = document.querySelector('.mt-4.px-10.py-3.border-2');

    if (loadMoreBtn && response.currentPage < response.totalPages) {
        loadMoreBtn.style.display = 'block';
        loadMoreBtn.onclick = async () => {
            currentFilters.page++;
            await loadProperties();
        };
    } else if (loadMoreBtn) {
        loadMoreBtn.style.display = 'none';
    }
}

function updateResultsCount(count, totalPages) {
    const countText = document.querySelector('.text-sm.text-gray-500');
    if (countText) {
        countText.textContent = `Showing ${count} properties`;
    }
}

function renderEmptyState() {
    const grid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.xl\\:grid-cols-3');
    if (!grid) return;

    grid.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center py-20">
            <span class="material-symbols-outlined text-6xl text-gray-300 mb-4">home_work</span>
            <h3 class="text-xl font-bold text-gray-600 mb-2">No Properties Found</h3>
            <p class="text-gray-500 text-sm">Try adjusting your filters or search criteria</p>
        </div>
    `;
}
