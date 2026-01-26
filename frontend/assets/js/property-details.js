// Property Details Page Script
let currentProperty = null;

document.addEventListener('DOMContentLoaded', async function () {
    // Update navigation
    AuthService.updateNavigation();

    // Setup search functionality
    setupSearchHandler();

    // Get property ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('id');

    if (!propertyId) {
        showToast('Property not found', 'error');
        setTimeout(() => window.location.href = 'properties.html', 2000);
        return;
    }

    // Load property details
    await loadPropertyDetails(propertyId);
    setupForms();
});

async function loadPropertyDetails(id) {
    showLoader();

    try {
        const response = await PropertyService.getProperty(id);

        hideLoader();

        if (response.success && response.data) {
            currentProperty = response.data;
            renderPropertyDetails(currentProperty);
        }
    } catch (error) {
        hideLoader();
        showToast(error.message || 'Failed to load property details', 'error');
        setTimeout(() => window.location.href = 'properties.html', 2000);
    }
}

function setupSearchHandler() {
    const searchInput = document.querySelector('input[placeholder*="Search"]') ||
        document.querySelector('input[placeholder*="search"]');
    const searchBtn = document.querySelector('[data-action="search"]');

    if (searchInput && searchBtn) {
        const handleSearch = () => {
            const searchQuery = searchInput.value.trim();
            if (searchQuery) {
                window.location.href = `properties.html?search=${encodeURIComponent(searchQuery)}`;
            } else {
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
}

function renderPropertyDetails(property) {
    // Update title and location
    const titleElement = document.querySelector('h1');
    if (titleElement) {
        titleElement.textContent = property.title || 'Property Details';
    }

    const locationElement = document.querySelector('p.flex.items-center.gap-2');
    if (locationElement) {
        locationElement.innerHTML = `
            <span class="material-symbols-outlined">location_on</span>
            ${property.location.address || ''}, ${property.location.city}, ${property.location.state || ''} ${property.location.zipCode || ''}
        `;
    }

    // Update price
    const priceElement = document.querySelector('.text-4xl.font-extrabold.text-primary');
    if (priceElement) {
        priceElement.textContent = formatPrice(property.price);
    }

    // Update specs
    updateSpec('Bedrooms', `${property.bedrooms} Beds`);
    updateSpec('Bathrooms', `${property.bathrooms} Baths`);
    updateSpec('Living Space', `${property.sqft.toLocaleString()} sqft`);
    updateSpec('Year Built', property.yearBuilt || 'N/A');

    // Update description
    const descriptionElement = document.querySelector('.text-\\[\\#686b82\\].dark\\:text-white\\/70 p');
    if (descriptionElement) {
        descriptionElement.textContent = property.description || 'No description available.';
    }

    // Update images
    if (property.images && property.images.length > 0) {
        updateImages(property.images);
    }

    // Update amenities
    if (property.amenities && property.amenities.length > 0) {
        renderAmenities(property.amenities);
    }

    // Update seller info
    if (property.seller) {
        renderSellerInfo(property.seller);
    }

    // Update favorite button
    updateFavoriteButton(property._id);
}

function updateSpec(label, value) {
    const specs = document.querySelectorAll('.flex.flex-col.gap-1');
    specs.forEach(spec => {
        const labelEl = spec.querySelector('.text-\\[\\#686b82\\]');
        if (labelEl && labelEl.textContent.includes(label)) {
            const valueEl = spec.querySelector('.text-xl.font-bold');
            if (valueEl) {
                if (label === 'Living Space' || label === 'Year Built') {
                    valueEl.innerHTML = value;
                } else {
                    valueEl.textContent = value;
                }
            }
        }
    });
}

function updateImages(images) {
    const mainImage = document.querySelector('.md\\:col-span-2.md\\:row-span-2 .bg-cover');
    if (mainImage && images[0]) {
        mainImage.style.backgroundImage = `url('${getImageUrl(images[0])}')`;
    }

    // Update side images
    const sideImages = document.querySelectorAll('.hidden.md\\:block .bg-cover');
    sideImages.forEach((img, index) => {
        if (images[index + 1]) {
            img.style.backgroundImage = `url('${getImageUrl(images[index + 1])}')`;
        }
    });
}

function renderAmenities(amenities) {
    const amenitiesGrid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-3.gap-4');
    if (!amenitiesGrid) return;

    amenitiesGrid.innerHTML = amenities.slice(0, 6).map(amenity => `
        <div class="p-5 bg-white dark:bg-white/5 border border-[#f1f1f4] dark:border-white/10 rounded-xl flex items-start gap-4 transition-transform hover:-translate-y-1">
            <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span class="material-symbols-outlined">check_circle</span>
            </div>
            <div>
                <p class="font-bold">${amenity}</p>
                <p class="text-sm text-[#686b82]">Available</p>
            </div>
        </div>
    `).join('');
}

function renderSellerInfo(seller) {
    const sellerName = document.querySelector('h4.font-bold.text-lg');
    if (sellerName) {
        sellerName.textContent = seller.name || 'Property Owner';
    }

    const sellerEmail = document.querySelector('p.text-sm.text-\\[\\#686b82\\]');
    if (sellerEmail && seller.email) {
        sellerEmail.textContent = seller.email;
    }
}

function updateFavoriteButton(propertyId) {
    // Find the favorite button by looking for buttons with favorite icon
    const buttons = Array.from(document.querySelectorAll('button'));
    const favoriteBtn = buttons.find(btn => {
        const icon = btn.querySelector('.material-symbols-outlined');
        return icon && icon.textContent.includes('favorite');
    });

    if (favoriteBtn) {
        favoriteBtn.onclick = async function () {
            if (!AuthService.isAuthenticated()) {
                showToast('Please login to save properties', 'info');
                setTimeout(() => window.location.href = 'login.html', 1500);
                return;
            }

            try {
                await BuyerService.addFavorite(propertyId);
                showToast('Property saved to favorites!', 'success');
                this.querySelector('span').classList.add('fill-1');
                this.classList.add('text-red-500');
            } catch (error) {
                if (error.message && error.message.includes('already')) {
                    showToast('Property already in favorites', 'info');
                } else {
                    showToast(error.message || 'Failed to save property', 'error');
                }
            }
        };
    }
}

function setupForms() {
    // Find buttons by looking for specific icons
    const buttons = Array.from(document.querySelectorAll('button'));

    // Schedule tour button (has event_available icon)
    const tourBtn = buttons.find(btn => {
        const icon = btn.querySelector('.material-symbols-outlined');
        return icon && icon.textContent.includes('event_available');
    });

    if (tourBtn) {
        tourBtn.onclick = function () {
            showScheduleVisitModal();
        };
    }

    // Contact seller button (has mail icon)
    const contactBtn = buttons.find(btn => {
        const icon = btn.querySelector('.material-symbols-outlined');
        return icon && icon.textContent.includes('mail');
    });

    if (contactBtn) {
        contactBtn.onclick = function () {
            showInquiryModal();
        };
    }
}

function showScheduleVisitModal() {
    if (!AuthService.isAuthenticated()) {
        showToast('Please login to schedule a visit', 'info');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 class="text-2xl font-bold mb-6">Schedule a Visit</h2>
            <form id="visitForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-semibold mb-2">Visit Date</label>
                    <input type="date" id="visitDate" required min="${new Date().toISOString().split('T')[0]}"
                        class="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                    <label class="block text-sm font-semibold mb-2">Preferred Time</label>
                    <input type="time" id="visitTime" required
                        class="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                    <label class="block text-sm font-semibold mb-2">Notes (Optional)</label>
                    <textarea id="visitNotes" rows="3"
                        class="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary"
                        placeholder="Any special requirements..."></textarea>
                </div>
                <div class="flex gap-3 pt-4">
                    <button type="button" onclick="this.closest('.fixed').remove()"
                        class="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-bold hover:bg-gray-50">
                        Cancel
                    </button>
                    <button type="submit"
                        class="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:opacity-90">
                        Schedule Visit
                    </button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('visitForm').onsubmit = async function (e) {
        e.preventDefault();

        const visitDate = document.getElementById('visitDate').value;
        const visitTime = document.getElementById('visitTime').value;
        const notes = document.getElementById('visitNotes').value;

        try {
            await BuyerService.scheduleVisit(currentProperty._id, visitDate, visitTime, notes);
            showToast('Visit scheduled successfully!', 'success');
            modal.remove();
        } catch (error) {
            showToast(error.message || 'Failed to schedule visit', 'error');
        }
    };
}

function showInquiryModal() {
    if (!AuthService.isAuthenticated()) {
        showToast('Please login to contact seller', 'info');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 class="text-2xl font-bold mb-6">Contact Seller</h2>
            <form id="inquiryForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-semibold mb-2">Your Message</label>
                    <textarea id="inquiryMessage" rows="5" required
                        class="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary"
                        placeholder="I'm interested in this property..."></textarea>
                </div>
                <div class="flex gap-3 pt-4">
                    <button type="button" onclick="this.closest('.fixed').remove()"
                        class="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-bold hover:bg-gray-50">
                        Cancel
                    </button>
                    <button type="submit"
                        class="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:opacity-90">
                        Send Inquiry
                    </button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('inquiryForm').onsubmit = async function (e) {
        e.preventDefault();

        const message = document.getElementById('inquiryMessage').value;

        try {
            await BuyerService.submitInquiry(currentProperty._id, message);
            showToast('Inquiry sent successfully!', 'success');
            modal.remove();
        } catch (error) {
            showToast(error.message || 'Failed to send inquiry', 'error');
        }
    };
}
