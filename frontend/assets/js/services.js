// Property Service
const PropertyService = {
    // Get all properties with filters
    async getProperties(filters = {}) {
        try {
            const queryParams = new URLSearchParams();

            Object.keys(filters).forEach(key => {
                if (filters[key]) {
                    queryParams.append(key, filters[key]);
                }
            });

            const queryString = queryParams.toString();
            const endpoint = `/properties${queryString ? '?' + queryString : ''}`;

            const response = await API.get(endpoint);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Get featured properties
    async getFeaturedProperties() {
        try {
            const response = await API.get('/properties/featured');
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Get single property
    async getProperty(id) {
        try {
            const response = await API.get(`/properties/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Create property (seller only)
    async createProperty(formData) {
        try {
            const response = await API.post('/properties', formData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Update property
    async updateProperty(id, formData) {
        try {
            const response = await API.put(`/properties/${id}`, formData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Delete property
    async deleteProperty(id) {
        try {
            const response = await API.delete(`/properties/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    }
};

// Buyer Service
const BuyerService = {
    // Add to favorites
    async addFavorite(propertyId) {
        try {
            const response = await API.post('/buyers/favorites', { propertyId });
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Get favorites
    async getFavorites() {
        try {
            const response = await API.get('/buyers/favorites');
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Remove from favorites
    async removeFavorite(propertyId) {
        try {
            const response = await API.delete(`/buyers/favorites/${propertyId}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Submit inquiry
    async submitInquiry(propertyId, message) {
        try {
            const response = await API.post('/buyers/inquiries', { propertyId, message });
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Get inquiries
    async getInquiries() {
        try {
            const response = await API.get('/buyers/inquiries');
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Schedule visit
    async scheduleVisit(propertyId, visitDate, visitTime, notes) {
        try {
            const response = await API.post('/buyers/visits', {
                propertyId,
                visitDate,
                visitTime,
                notes: notes || ''
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Get visits
    async getVisits() {
        try {
            const response = await API.get('/buyers/visits');
            return response;
        } catch (error) {
            throw error;
        }
    }
};

// Seller Service
const SellerService = {
    // Get dashboard stats
    async getDashboardStats() {
        try {
            const response = await API.get('/sellers/dashboard');
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Get leads
    async getLeads() {
        try {
            const response = await API.get('/sellers/leads');
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Update lead status
    async updateLeadStatus(leadId, status) {
        try {
            const response = await API.put(`/sellers/leads/${leadId}`, { status });
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Get analytics
    async getAnalytics() {
        try {
            const response = await API.get('/sellers/analytics');
            return response;
        } catch (error) {
            throw error;
        }
    }
};

window.PropertyService = PropertyService;
window.BuyerService = BuyerService;
window.SellerService = SellerService;
