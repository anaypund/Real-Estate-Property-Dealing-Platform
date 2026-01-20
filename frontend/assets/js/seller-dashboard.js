// Seller Dashboard Script
document.addEventListener('DOMContentLoaded', async function () {
    // Auth guard - redirect if not authenticated or not a seller/agent
    const user = AuthService.getUser();
    if (!user || (user.role !== 'seller' && user.role !== 'agent')) {
        showToast('Please login as a seller/agent to access this page', 'warning');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }

    // Update user info
    updateUserInfo(user);

    // Update navigation to show profile dropdown
    AuthService.updateNavigation();

    // Load dashboard data
    await Promise.all([
        loadDashboardStats(),
        loadMyListings(),
        loadLeads()
    ]);

    // Setup add property button
    setupAddPropertyButton();
});

function updateUserInfo(user) {
    const userName = document.querySelectorAll('.text-sm.font-bold')[1];
    if (userName) {
        userName.textContent = user.name;
    }
}

async function loadDashboardStats() {
    try {
        const response = await SellerService.getDashboardStats();

        if (response.success && response.data) {
            renderDashboardStats(response.data);
        }
    } catch (error) {
        console.error('Failed to load dashboard stats:', error);
    }
}

function renderDashboardStats(stats) {
    // Update total page views
    const viewsCard = document.querySelectorAll('.col-span-12.lg\\:col-span-4')[0];
    if (viewsCard) {
        const viewsValue = viewsCard.querySelector('.text-2xl.font-black');
        if (viewsValue) {
            viewsValue.textContent = (stats.totalViews || 0).toLocaleString();
        }
    }

    // Update new lead inquiries
    const leadsCard = document.querySelectorAll('.col-span-12.lg\\:col-span-4')[1];
    if (leadsCard) {
        const leadsValue = leadsCard.querySelector('.text-2xl.font-black');
        if (leadsValue) {
            leadsValue.textContent = stats.totalLeads || 0;
        }
    }

    // Update active ad campaigns
    const campaignsCard = document.querySelectorAll('.col-span-12.lg\\:col-span-4')[2];
    if (campaignsCard) {
        const campaignsValue = campaignsCard.querySelector('.text-2xl.font-black');
        if (campaignsValue) {
            campaignsValue.textContent = '0' + (stats.activeCampaigns || 8);
        }
    }
}

async function loadMyListings() {
    try {
        const response = await PropertyService.getProperties({
            seller: AuthService.getUser()._id,
            limit: 10
        });

        if (response.success && response.data && response.data.length > 0) {
            renderMyListings(response.data);
        } else {
            renderEmptyListings();
        }
    } catch (error) {
        console.error('Failed to load listings:', error);
        renderEmptyListings();
    }
}

function renderMyListings(properties) {
    const tbody = document.querySelector('tbody.divide-y');
    if (!tbody) return;

    // Fetch lead counts for all properties
    fetchLeadCounts(properties).then(leadCounts => {
        tbody.innerHTML = properties.slice(0, 3).map(property => {
            const imageUrl = property.images && property.images.length > 0
                ? getImageUrl(property.images[0])
                : 'https://via.placeholder.com/60x60?text=No+Image';

            const statusClass = property.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                property.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                    'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-400';

            const leadCount = leadCounts[property._id] || 0;

            return `
                <tr class="hover:bg-background-light/30 dark:hover:bg-zinc-800/30 transition-colors group">
                    <td class="px-6 py-5">
                        <div class="flex items-center gap-4">
                            <div class="size-14 rounded-lg bg-cover bg-center shrink-0 border border-[#dddee4] dark:border-zinc-800"
                                style="background-image: url('${imageUrl}');"></div>
                            <div class="flex flex-col">
                                <span class="text-[#121317] dark:text-white font-bold text-sm">${property.title || 'Property'}</span>
                                <span class="text-[#686b82] text-xs">${property.location.address || property.location.city}</span>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-5 text-center">
                        <span class="text-[#121317] dark:text-white font-bold text-sm">${formatPrice(property.price)}</span>
                    </td>
                    <td class="px-6 py-5 text-center">
                        <span class="${statusClass} px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">${property.status}</span>
                    </td>
                    <td class="px-6 py-5 text-center">
                        <span class="text-[#121317] dark:text-white text-sm">${property.views || 0}</span>
                    </td>
                    <td class="px-6 py-5 text-center">
                        <span class="text-[#121317] dark:text-white text-sm font-bold ${leadCount > 0 ? 'text-blue-600' : ''}">${leadCount}</span>
                    </td>
                    <td class="px-6 py-5 text-right">
                        <div class="flex items-center justify-end gap-2">
                            <button onclick="editProperty('${property._id}')"
                                class="p-2 hover:bg-white dark:hover:bg-zinc-700 rounded-lg text-[#686b82] hover:text-primary shadow-sm transition-all">
                                <span class="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button onclick="showPropertyMenu('${property._id}')"
                                class="p-2 hover:bg-white dark:hover:bg-zinc-700 rounded-lg text-[#686b82] hover:text-primary shadow-sm transition-all">
                                <span class="material-symbols-outlined text-lg">more_vert</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    });
}

async function fetchLeadCounts(properties) {
    try {
        const response = await SellerService.getLeads();
        const leadCounts = {};

        if (response.success && response.data) {
            response.data.forEach(lead => {
                const propertyId = lead.property?._id;
                if (propertyId) {
                    leadCounts[propertyId] = (leadCounts[propertyId] || 0) + 1;
                }
            });
        }

        return leadCounts;
    } catch (error) {
        console.error('Failed to fetch lead counts:', error);
        return {};
    }
}

function renderEmptyListings() {
    const tbody = document.querySelector('tbody.divide-y');
    if (!tbody) return;

    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="px-6 py-12 text-center">
                <span class="material-symbols-outlined text-6xl text-gray-300 mb-4">home_work</span>
                <h3 class="text-lg font-bold text-gray-600 mb-2">No Active Listings</h3>
                <p class="text-gray-500 text-sm mb-6">Start by adding your first property</p>
                <button onclick="showAddPropertyModal()" 
                    class="inline-block px-6 py-3 bg-primary text-white rounded-lg font-bold">
                    Add Property
                </button>
            </td>
        </tr>
    `;
}

async function loadLeads() {
    try {
        const response = await SellerService.getLeads();

        if (response.success && response.data) {
            const totalLeads = response.data.length;

            // Update lead count in sidebar
            const leadBadge = document.querySelector('.ml-auto.bg-primary');
            if (leadBadge && totalLeads > 0) {
                leadBadge.textContent = totalLeads;
            }

            // Group leads by property
            renderLeadsSection(response.data);
        }
    } catch (error) {
        console.error('Failed to load leads:', error);
    }
}

function renderLeadsSection(leads) {
    // Find a place to insert leads section (after the listings table)
    const listingsSection = document.querySelector('.bg-white.dark\\:bg-zinc-900.border');
    if (!listingsSection) return;

    // Remove existing leads section if any
    const existingLeadsSection = document.getElementById('leads-section');
    if (existingLeadsSection) existingLeadsSection.remove();

    // Group leads by property
    const leadsByProperty = {};
    leads.forEach(lead => {
        const propertyId = lead.property?._id || 'unknown';
        if (!leadsByProperty[propertyId]) {
            leadsByProperty[propertyId] = {
                property: lead.property,
                inquiries: [],
                visits: []
            };
        }

        if (lead.type === 'inquiry') {
            leadsByProperty[propertyId].inquiries.push(lead);
        } else if (lead.type === 'visit') {
            leadsByProperty[propertyId].visits.push(lead);
        }
    });

    // Create leads section
    const leadsSection = document.createElement('div');
    leadsSection.id = 'leads-section';
    leadsSection.className = 'mt-8';

    leadsSection.innerHTML = `
        <h3 class="text-[#121317] dark:text-white text-2xl font-black tracking-tight mb-6">Leads & Inquiries</h3>
        <div class="space-y-6" id="leads-container"></div>
    `;

    listingsSection.parentElement.appendChild(leadsSection);

    const container = document.getElementById('leads-container');

    // Render each property's leads
    Object.entries(leadsByProperty).forEach(([propertyId, data]) => {
        if (!data.property) return;

        const propertyCard = document.createElement('div');
        propertyCard.className = 'bg-white dark:bg-zinc-900 border border-[#dddee4] dark:border-zinc-800 rounded-xl overflow-hidden';

        const imageUrl = data.property.images && data.property.images.length > 0
            ? getImageUrl(data.property.images[0])
            : 'https://via.placeholder.com/100x80?text=No+Image';

        propertyCard.innerHTML = `
            <div class="p-6 border-b border-[#dddee4] dark:border-zinc-800 flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <div class="size-20 rounded-lg bg-cover bg-center border border-[#dddee4] dark:border-zinc-800"
                        style="background-image: url('${imageUrl}');"></div>
                    <div>
                        <h4 class="text-[#121317] dark:text-white font-bold text-lg">${data.property.title || 'Property'}</h4>
                        <p class="text-[#686b82] text-sm">${data.property.location.city}, ${data.property.location.state}</p>
                    </div>
                </div>
                <div class="flex gap-4">
                    <div class="text-center">
                        <p class="text-2xl font-black text-blue-600">${data.inquiries.length}</p>
                        <p class="text-xs text-[#686b82]">Inquiries</p>
                    </div>
                    <div class="text-center">
                        <p class="text-2xl font-black text-purple-600">${data.visits.length}</p>
                        <p class="text-xs text-[#686b82]">Visits</p>
                    </div>
                </div>
            </div>
            
            <div class="grid md:grid-cols-2 divide-x divide-[#dddee4] dark:divide-zinc-800">
                <!-- Inquiries Column -->
                <div class="p-6">
                    <h5 class="text-sm font-bold text-[#686b82] uppercase mb-4">Inquiries</h5>
                    <div class="space-y-3" id="inquiries-${propertyId}"></div>
                </div>
                
                <!-- Visits Column -->
                <div class="p-6">
                    <h5 class="text-sm font-bold text-[#686b82] uppercase mb-4">Scheduled Visits</h5>
                    <div class="space-y-3" id="visits-${propertyId}"></div>
                </div>
            </div>
        `;

        container.appendChild(propertyCard);

        // Render inquiries
        const inquiriesContainer = document.getElementById(`inquiries-${propertyId}`);
        if (data.inquiries.length > 0) {
            data.inquiries.forEach(inquiry => {
                const inquiryEl = document.createElement('div');
                inquiryEl.className = 'bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800';
                inquiryEl.innerHTML = `
                    <div class="flex justify-between items-start mb-2">
                        <p class="font-bold text-sm text-[#121317] dark:text-white">${inquiry.buyer?.name || 'Buyer'}</p>
                        <span class="text-xs text-[#686b82]">${formatRelativeTime(inquiry.createdAt)}</span>
                    </div>
                    <p class="text-xs text-[#686b82] mb-2 truncate">${inquiry.buyer?.email || ''}</p>
                    <p class="text-sm text-[#121317] dark:text-white">${inquiry.message || 'No message'}</p>
                `;
                inquiriesContainer.appendChild(inquiryEl);
            });
        } else {
            inquiriesContainer.innerHTML = '<p class="text-[#686b82] text-sm italic">No inquiries yet</p>';
        }

        // Render visits
        const visitsContainer = document.getElementById(`visits-${propertyId}`);
        if (data.visits.length > 0) {
            data.visits.forEach(visit => {
                const visitEl = document.createElement('div');
                visitEl.className = 'bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800';

                const statusClass = visit.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    visit.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700';

                visitEl.innerHTML = `
                    <div class="flex justify-between items-start mb-2">
                        <p class="font-bold text-sm text-[#121317] dark:text-white">${visit.buyer?.name || 'Buyer'}</p>
                        <span class="text-xs px-2 py-1 rounded-full ${statusClass}">${visit.status}</span>
                    </div>
                    <p class="text-xs text-[#686b82] mb-1 truncate">${visit.buyer?.email || ''}</p>
                    <div class="flex items-center gap-2 text-sm text-[#121317] dark:text-white">
                        <span class="material-symbols-outlined text-base">event</span>
                        ${formatDate(visit.visitDate)} at ${visit.visitTime || 'TBD'}
                    </div>
                    ${visit.message ? `<p class="text-sm text-[#686b82] mt-2">${visit.message}</p>` : ''}
                `;
                visitsContainer.appendChild(visitEl);
            });
        } else {
            visitsContainer.innerHTML = '<p class="text-[#686b82] text-sm italic">No scheduled visits</p>';
        }
    });

    if (Object.keys(leadsByProperty).length === 0) {
        container.innerHTML = `
            <div class="text-center py-12">
                <span class="material-symbols-outlined text-6xl text-gray-300 mb-4">group</span>
                <h3 class="text-lg font-bold text-gray-600 mb-2">No Leads Yet</h3>
                <p class="text-gray-500 text-sm">Leads will appear here when buyers show interest in your properties</p>
            </div>
        `;
    }
}

function setupAddPropertyButton() {
    const addBtn = document.querySelector('button:has(.material-symbols-outlined:contains("add_circle"))') ||
        document.querySelector('.bg-primary.text-white.px-6.py-3');

    if (addBtn) {
        addBtn.onclick = function () {
            showAddPropertyModal();
        };
    }
}

function showAddPropertyModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 class="text-2xl font-bold mb-4 sticky top-0 bg-white dark:bg-gray-800 pb-2">Add New Property</h2>
            <form id="addPropertyForm" class="space-y-3" enctype="multipart/form-data">
                <div class="grid grid-cols-2 gap-3">
                    <div class="col-span-2">
                        <label class="block text-sm font-semibold mb-1">Property Title</label>
                        <input type="text" id="propTitle" required
                            class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-primary" 
                            placeholder="Modern Villa in Beverly Hills" />
                    </div>
                    
                    <div class="col-span-2">
                        <label class="block text-sm font-semibold mb-1">Description</label>
                        <textarea id="propDescription" rows="2" required
                            class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-primary"
                            placeholder="Describe your property..."></textarea>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-semibold mb-1">Price ($)</label>
                        <input type="number" id="propPrice" required min="0"
                            class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-primary" 
                            placeholder="1250000" />
                    </div>
                    
                    <div>
                        <label class="block text-sm font-semibold mb-1">Property Type</label>
                        <select id="propType" required
                            class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-primary">
                            <option value="house">House</option>
                            <option value="apartment">Apartment</option>
                            <option value="condo">Condo</option>
                            <option value="villa">Villa</option>
                            <option value="townhouse">Townhouse</option>
                        </select>
                    </div>
                    
                    <div class="col-span-2">
                        <label class="block text-sm font-semibold mb-1">Address</label>
                        <input type="text" id="propAddress" required
                            class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-primary" 
                            placeholder="123 Main Street" />
                    </div>
                    
                    <div>
                        <label class="block text-sm font-semibold mb-1">City</label>
                        <input type="text" id="propCity" required
                            class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-primary" 
                            placeholder="Los Angeles" />
                    </div>
                    
                    <div>
                        <label class="block text-sm font-semibold mb-1">State</label>
                        <input type="text" id="propState" required
                            class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-primary" 
                            placeholder="CA" />
                    </div>
                    
                    <div>
                        <label class="block text-sm font-semibold mb-1">Zip Code (Optional)</label>
                        <input type="text" id="propZip"
                            class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-primary" 
                            placeholder="90210" />
                    </div>
                    
                    <div>
                        <label class="block text-sm font-semibold mb-1">Bedrooms</label>
                        <input type="number" id="propBedrooms" required min="0"
                            class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-primary" 
                            placeholder="4" />
                    </div>
                    
                    <div>
                        <label class="block text-sm font-semibold mb-1">Bathrooms</label>
                        <input type="number" id="propBathrooms" required min="0" step="0.5"
                            class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-primary" 
                            placeholder="3.5" />
                    </div>
                    
                    <div>
                        <label class="block text-sm font-semibold mb-1">Square Feet</label>
                        <input type="number" id="propSqft" required min="0"
                            class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-primary" 
                            placeholder="2500" />
                    </div>
                    
                    <div>
                        <label class="block text-sm font-semibold mb-1">Year Built (Optional)</label>
                        <input type="number" id="propYear" min="1800" max="2025"
                            class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-primary" 
                            placeholder="2023" />
                    </div>
                    
                    <div class="col-span-2">
                        <label class="block text-sm font-semibold mb-1">Images (Optional)</label>
                        <input type="file" id="propImages" multiple accept="image/*"
                            class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-primary text-sm" />
                        <p class="text-xs text-gray-500 mt-1">You can select multiple images</p>
                    </div>
                </div>
                
                <div class="flex gap-3 pt-3 sticky bottom-0 bg-white dark:bg-gray-800 pb-2">
                    <button type="button" onclick="this.closest('.fixed').remove()"
                        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-bold hover:bg-gray-50">
                        Cancel
                    </button>
                    <button type="submit"
                        class="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:opacity-90">
                        Add Property
                    </button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('addPropertyForm').onsubmit = async function (e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', document.getElementById('propTitle').value);
        formData.append('description', document.getElementById('propDescription').value);
        formData.append('price', document.getElementById('propPrice').value);
        formData.append('propertyType', document.getElementById('propType').value);
        formData.append('location[address]', document.getElementById('propAddress').value);
        formData.append('location[city]', document.getElementById('propCity').value);
        formData.append('location[state]', document.getElementById('propState').value);
        formData.append('bedrooms', document.getElementById('propBedrooms').value);
        formData.append('bathrooms', document.getElementById('propBathrooms').value);
        formData.append('sqft', document.getElementById('propSqft').value);

        const zip = document.getElementById('propZip').value;
        if (zip) formData.append('location[zipCode]', zip);

        const year = document.getElementById('propYear').value;
        if (year) formData.append('yearBuilt', year);

        const images = document.getElementById('propImages').files;
        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }

        showLoader();

        try {
            await PropertyService.createProperty(formData);
            hideLoader();
            showToast('Property added successfully!', 'success');
            modal.remove();

            // Reload listings
            await loadMyListings();
        } catch (error) {
            hideLoader();
            showToast(error.message || 'Failed to add property', 'error');
        }
    };
}

async function editProperty(propertyId) {
    showToast('Edit functionality coming soon!', 'info');
}

function showPropertyMenu(propertyId) {
    const menu = document.createElement('div');
    menu.className = 'fixed inset-0 bg-black/20 flex items-center justify-center z-50';
    menu.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-xl">
            <button onclick="deleteProperty('${propertyId}')" 
                class="w-full px-6 py-3 text-red-600 hover:bg-red-50 rounded-lg font-bold text-left flex items-center gap-2">
                <span class="material-symbols-outlined">delete</span>
                Delete Property
            </button>
            <button onclick="this.closest('.fixed').remove()"
                class="w-full px-6 py-3 hover:bg-gray-50 rounded-lg font-bold text-left mt-2">
                Cancel
            </button>
        </div>
    `;

    document.body.appendChild(menu);
}

async function deleteProperty(propertyId) {
    if (!confirm('Are you sure you want to delete this property?')) {
        return;
    }

    try {
        await PropertyService.deleteProperty(propertyId);
        showToast('Property deleted successfully', 'success');

        // Close menu
        document.querySelectorAll('.fixed.inset-0').forEach(el => el.remove());

        // Reload listings
        await loadMyListings();
    } catch (error) {
        showToast(error.message || 'Failed to delete property', 'error');
    }
}
