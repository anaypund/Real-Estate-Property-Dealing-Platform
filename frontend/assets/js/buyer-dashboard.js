// Buyer Dashboard Script
document.addEventListener('DOMContentLoaded', async function () {
    // Update navigation
    AuthService.updateNavigation();

    // Setup search functionality
    setupSearchHandler();

    // Update user name
    updateUserName();

    // Setup navigation scroll
    setupNavigationScroll();

    // Auth guard - redirect if not authenticated or not a buyer
    const user = AuthService.getUser();
    if (!user || (user.role !== 'buyer' && user.role !== 'agent')) {
        showToast('Please login as a buyer to access this page', 'warning');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }

    // Update user name in UI
    updateUserInfo(user);

    // Update navigation to show profile dropdown
    AuthService.updateNavigation();

    // Load all dashboard data
    await Promise.all([
        loadFavorites(),
        loadInquiries(),
        loadVisits()
    ]);

    // Setup navigation
    setupNavigation();
});

function updateUserInfo(user) {
    const userName = document.querySelector('[data-user="name"]') ||
        document.querySelector('.text-xs.font-bold');
    if (userName) {
        userName.textContent = user.name;
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

function updateUserName() {
    const user = AuthService.getUser();
    if (user && user.name) {
        const firstName = user.name.split(' ')[0];
        const firstNameElement = document.querySelector('[data-user="firstName"]');
        if (firstNameElement) {
            firstNameElement.textContent = firstName;
        }
    }
}

function setupNavigationScroll() {
    const navLinks = document.querySelectorAll('[data-scroll]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-scroll');

            // Remove active class from all links
            navLinks.forEach(l => {
                l.classList.remove('bg-primary/10', 'dark:bg-primary/20', 'text-primary', 'dark:text-primary');
                l.classList.add('hover:bg-background-light', 'dark:hover:bg-[#1e212e]', 'text-[#686b82]', 'dark:text-gray-400');
            });
            // Add active class to clicked link
            link.classList.add('bg-primary/10', 'dark:bg-primary/20', 'text-primary', 'dark:text-primary');
            link.classList.remove('hover:bg-background-light', 'dark:hover:bg-[#1e212e]', 'text-[#686b82]', 'dark:text-gray-400');

            switch (target) {
                case 'top':
                    // Scroll to top
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    break;

                case 'saved':
                    // Scroll to Saved Properties section
                    scrollToAndHighlight('saved-section');
                    break;

                case 'inquiries':
                    // Scroll to Recent Inquiries section
                    scrollToAndHighlight('inquiries-section');
                    break;

                case 'visits':
                    // Scroll to Upcoming Visits section
                    scrollToAndHighlight('visits-section');
                    break;

                case 'profile':
                    // Scroll to top
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    break;
            }
        });
    });
}

function scrollToAndHighlight(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        // Scroll to element with offset for header
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - 100; // 100px offset for header

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        // Highlight after scroll
        setTimeout(() => highlightElement(elementId), 500);
    }
}

function highlightElement(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Create trail element
    const trail = document.createElement('div');
    trail.style.position = 'absolute';
    trail.style.width = '4px';
    trail.style.height = '4px';
    trail.style.background = 'linear-gradient(90deg, transparent, #252e7e, transparent)';
    trail.style.borderRadius = '2px';
    trail.style.pointerEvents = 'none';
    trail.style.zIndex = '1000';
    trail.style.boxShadow = '0 0 10px #252e7e, 0 0 20px #252e7e';

    // Make element position relative if not already
    const originalPosition = element.style.position;
    if (!originalPosition || originalPosition === 'static') {
        element.style.position = 'relative';
    }

    element.appendChild(trail);

    const rect = element.getBoundingClientRect();
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    const perimeter = 2 * (width + height);
    const duration = 500; // 0.5 seconds for complete circle
    const startTime = Date.now();

    function animateTrail() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const distance = progress * perimeter;

        let x, y, rotation;
        const trailLength = 40;

        if (distance < width) {
            // Top edge (left to right)
            x = distance - 10;
            y = -10;
            rotation = 0;
        } else if (distance < width + height) {
            // Right edge (top to bottom)
            x = width - 10;
            y = distance - width - 10;
            rotation = 90;
        } else if (distance < 2 * width + height) {
            // Bottom edge (right to left)
            x = width - (distance - width - height) - 10;
            y = height - 10;
            rotation = 180;
        } else {
            // Left edge (bottom to top)
            x = -10;
            y = height - (distance - 2 * width - height);
            rotation = 270;
        }

        trail.style.left = `${x}px`;
        trail.style.top = `${y}px`;
        trail.style.transform = `rotate(${rotation}deg)`;
        trail.style.width = `${trailLength}px`;
        trail.style.height = '3px';

        if (progress < 1) {
            requestAnimationFrame(animateTrail);
        } else {
            // Remove trail and restore position
            setTimeout(() => {
                trail.remove();
                if (!originalPosition || originalPosition === 'static') {
                    element.style.position = '';
                }
            }, 200);
        }
    }

    animateTrail();
}

async function loadFavorites() {
    try {
        const response = await BuyerService.getFavorites();

        if (response.success && response.data && response.data.length > 0) {
            renderFavorites(response.data);
        } else {
            renderEmptyFavorites();
        }
    } catch (error) {
        console.error('Failed to load favorites:', error);
        renderEmptyFavorites();
    }
}

function renderFavorites(favorites) {
    const grid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
    if (!grid) return;

    // Get the first 3 favorites to display
    const displayFavorites = favorites.slice(0, 3);

    // Clear grid but keep structure
    const existingCards = grid.querySelectorAll('.group.bg-white');
    existingCards.forEach(card => card.remove());

    displayFavorites.forEach(favorite => {
        const property = favorite.property || favorite;
        const card = createPropertyCard(property, true);
        grid.insertBefore(card, grid.firstChild);
    });
}

function createPropertyCard(property, showRemove = false) {
    const card = document.createElement('div');
    card.className = 'group bg-white dark:bg-[#1e212e] rounded-xl overflow-hidden border border-[#f1f1f4] dark:border-[#2a2d3d] shadow-sm hover:shadow-xl transition-all duration-300';

    const imageUrl = property.images && property.images.length > 0
        ? getImageUrl(property.images[0])
        : 'https://via.placeholder.com/400x300?text=No+Image';

    card.innerHTML = `
        <div class="relative h-48 overflow-hidden">
            <div class="absolute inset-0 bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
                style="background-image: url('${imageUrl}');"></div>
            <div class="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full size-8 flex items-center justify-center text-red-500 cursor-pointer shadow-sm"
                onclick="${showRemove ? `removeFavorite('${property._id}', this)` : `handleFavoriteToggle('${property._id}')`}">
                <span class="material-symbols-outlined fill-1 text-base">favorite</span>
            </div>
            ${property.status === 'active' ? `
            <div class="absolute bottom-4 left-4 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                Active
            </div>` : ''}
        </div>
        <div class="p-5" style="cursor: pointer;" onclick="window.location.href='property-details.html?id=${property._id}'">
            <div class="flex justify-between items-start mb-2">
                <p class="text-xl font-black">${formatPrice(property.price)}</p>
            </div>
            <p class="text-sm font-medium mb-1 truncate">${property.title || 'Property'}</p>
            <p class="text-xs text-[#686b82] mb-4 flex items-center gap-1">
                <span class="material-symbols-outlined text-xs">location_on</span> ${property.location.city}
            </p>
            <div class="flex items-center gap-4 py-3 border-t border-[#f1f1f4] dark:border-[#2a2d3d]">
                <div class="flex items-center gap-1 text-[#121317] dark:text-gray-300">
                    <span class="material-symbols-outlined text-sm">bed</span>
                    <span class="text-xs font-bold">${property.bedrooms}</span>
                </div>
                <div class="flex items-center gap-1 text-[#121317] dark:text-gray-300">
                    <span class="material-symbols-outlined text-sm">bathtub</span>
                    <span class="text-xs font-bold">${property.bathrooms}</span>
                </div>
                <div class="flex items-center gap-1 text-[#121317] dark:text-gray-300">
                    <span class="material-symbols-outlined text-sm">square_foot</span>
                    <span class="text-xs font-bold">${property.sqft.toLocaleString()}</span>
                </div>
            </div>
        </div>
    `;

    return card;
}

async function removeFavorite(propertyId, button) {
    try {
        await BuyerService.removeFavorite(propertyId);
        showToast('Removed from favorites', 'success');
        button.closest('.group').remove();

        // Reload favorites
        await loadFavorites();
    } catch (error) {
        showToast(error.message || 'Failed to remove favorite', 'error');
    }
}

function renderEmptyFavorites() {
    const grid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
    if (!grid) return;

    const existingCards = grid.querySelectorAll('.group.bg-white');
    existingCards.forEach(card => card.remove());

    const emptyState = document.createElement('div');
    emptyState.className = 'col-span-full text-center py-12';
    emptyState.innerHTML = `
        <span class="material-symbols-outlined text-6xl text-gray-300 mb-4">favorite_border</span>
        <h3 class="text-lg font-bold text-gray-600 mb-2">No Saved Properties</h3>
        <p class="text-gray-500 text-sm mb-6">Start saving properties to view them here</p>
        <a href="properties.html" class="inline-block px-6 py-3 bg-primary text-white rounded-lg font-bold">
            Browse Properties
        </a>
    `;

    grid.insertBefore(emptyState, grid.firstChild);
}

async function loadInquiries() {
    try {
        const response = await BuyerService.getInquiries();

        if (response.success && response.data && response.data.length > 0) {
            renderInquiries(response.data);
        }
    } catch (error) {
        console.error('Failed to load inquiries:', error);
    }
}

function renderInquiries(inquiries) {
    const tbody = document.querySelector('tbody.divide-y');
    if (!tbody) return;

    tbody.innerHTML = inquiries.slice(0, 3).map(inquiry => {
        const property = inquiry.property || {};
        const propertyImage = property.images && property.images.length > 0
            ? getImageUrl(property.images[0])
            : 'https://via.placeholder.com/60x60?text=No+Image';

        const statusClass = inquiry.status === 'pending' ? 'bg-blue-100 text-blue-700' :
            inquiry.status === 'responded' ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-600';

        return `
            <tr onclick="window.location.href='property-details.html?id=${property._id}'" style="cursor: pointer;">
                <td class="py-4">
                    <div class="flex items-center gap-3">
                        <div class="size-10 rounded bg-gray-200 bg-cover bg-center"
                            style="background-image: url('${propertyImage}');"></div>
                        <p class="text-sm font-bold">${property.title || 'Property'}</p>
                    </div>
                </td>
                <td class="py-4">
                    <p class="text-sm">${inquiry.seller?.name || 'Seller'}</p>
                </td>
                <td class="py-4">
                    <p class="text-xs text-[#686b82]">${formatRelativeTime(inquiry.createdAt)}</p>
                </td>
                <td class="py-4">
                    <span class="${statusClass} dark:bg-green-900/30 dark:text-green-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase">${inquiry.status}</span>
                </td>
            </tr>
        `;
    }).join('');
}

async function loadVisits() {
    try {
        const response = await BuyerService.getVisits();

        if (response.success && response.data && response.data.length > 0) {
            renderVisits(response.data);
        }
    } catch (error) {
        console.error('Failed to load visits:', error);
    }
}

function renderVisits(visits) {
    const timeline = document.querySelector('.grid.grid-cols-\\[30px_1fr\\]');
    if (!timeline) return;

    const timelineContainer = timeline.parentElement;
    timelineContainer.innerHTML = '';

    visits.slice(0, 3).forEach((visit, index) => {
        const property = visit.property || {};
        const isFirst = index === 0;
        const isLast = index === visits.length - 1 || index === 2;

        const statusColor = visit.status === 'confirmed' ? 'bg-primary' : 'bg-[#dddee4]';

        const item = document.createElement('div');
        item.className = 'grid grid-cols-[30px_1fr] gap-x-4';
        item.innerHTML = `
            <div class="flex flex-col items-center">
                <div class="${statusColor} size-4 rounded-full ${isFirst ? 'border-4 border-primary/20' : ''}"></div>
                ${!isLast ? '<div class="w-[1.5px] bg-primary/20 h-full"></div>' : ''}
            </div>
            <div class="${!isLast ? 'pb-6' : ''}">
                <p class="text-[#121317] dark:text-white text-sm font-bold">${property.title || 'Property Visit'}</p>
                <p class="text-[#686b82] text-xs mt-1">${formatDate(visit.visitDate)} at ${visit.visitTime || 'TBD'}</p>
                ${visit.status === 'confirmed' && isFirst ? `
                <div class="mt-3 p-2 bg-background-light dark:bg-background-dark rounded flex items-center justify-between">
                    <span class="text-[10px] font-bold text-primary">Confirmed with Agent</span>
                    <span class="material-symbols-outlined text-sm text-primary">check_circle</span>
                </div>` : ''}
            </div>
        `;

        timelineContainer.appendChild(item);
    });
}

function setupNavigation() {
    // Setup sidebar navigation
    const navLinks = document.querySelectorAll('aside a, aside .flex.items-center.gap-3');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const text = this.querySelector('span:last-child')?.textContent;

            if (text === 'Saved Properties') {
                document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3')?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Logout functionality
    const logoutBtn = document.querySelector('[data-auth="logout"]');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            AuthService.logout();
            window.location.href = 'index.html';
        });
    }
}

// Helper function for favorite toggle
async function handleFavoriteToggle(propertyId) {
    try {
        await BuyerService.addFavorite(propertyId);
        showToast('Added to favorites!', 'success');
    } catch (error) {
        showToast(error.message || 'Failed to add favorite', 'error');
    }
}
