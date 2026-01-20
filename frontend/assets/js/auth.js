// Authentication Service
const AuthService = {
    // Register new user
    async register(userData) {
        try {
            const response = await API.post('/auth/register', userData);
            if (response.success) {
                API.setToken(response.token);
                API.setUser(response.user);
                return response;
            }
        } catch (error) {
            throw error;
        }
    },

    // Login user
    async login(email, password) {
        try {
            const response = await API.post('/auth/login', { email, password });
            if (response.success) {
                API.setToken(response.token);
                API.setUser(response.user);
                return response;
            }
        } catch (error) {
            throw error;
        }
    },

    // Get current user
    async getCurrentUser() {
        try {
            const response = await API.get('/auth/me');
            if (response.success) {
                API.setUser(response.data);
                return response.data;
            }
        } catch (error) {
            this.logout();
            throw error;
        }
    },

    // Logout
    logout() {
        API.removeToken();
        window.location.href = '../pages/login.html';
    },

    // Check if user is authenticated
    isAuthenticated() {
        return API.isAuthenticated();
    },

    // Get current user from storage
    getUser() {
        return API.getUser();
    },

    // Redirect if not authenticated
    requireAuth(requiredRole = null) {
        if (!this.isAuthenticated()) {
            window.location.href = '../pages/login.html';
            return false;
        }

        const user = this.getUser();
        if (requiredRole && user.role !== requiredRole) {
            showToast('You do not have permission to access this page', 'error');
            window.location.href = '../pages/index.html';
            return false;
        }

        return true;
    },

    // Update navigation based on auth status
    updateNavigation() {
        const user = this.getUser();
        const signInBtn = document.querySelector('[data-auth="signin"]');
        const listPropertyBtn = document.querySelector('[data-auth="list-property"]');
        const userProfile = document.querySelector('[data-auth="user-profile"]');
        const logoutBtn = document.querySelector('[data-auth="logout"]');

        if (this.isAuthenticated() && user) {
            // Hide sign in button
            if (signInBtn) signInBtn.style.display = 'none';

            // Show user profile
            if (userProfile) {
                userProfile.style.display = 'flex';
                const userName = userProfile.querySelector('[data-user="name"]');
                if (userName) userName.textContent = user.name;

                // Create profile dropdown if not exists
                let dropdown = document.getElementById('profile-dropdown');
                if (!dropdown) {
                    dropdown = this.createProfileDropdown(user);
                    userProfile.appendChild(dropdown);
                }

                // Toggle dropdown on profile click
                userProfile.style.cursor = 'pointer';
                userProfile.onclick = (e) => {
                    e.stopPropagation();
                    dropdown.classList.toggle('hidden');
                };

                // Close dropdown when clicking outside
                document.addEventListener('click', () => {
                    if (dropdown) dropdown.classList.add('hidden');
                });
            }

            // Show/hide list property based on role
            if (listPropertyBtn) {
                listPropertyBtn.style.display = user.role === 'seller' || user.role === 'agent' ? 'block' : 'none';
            }

            // Add logout functionality
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
            }
        } else {
            // Show sign in button
            if (signInBtn) signInBtn.style.display = 'block';

            // Hide user profile
            if (userProfile) userProfile.style.display = 'none';

            // Hide list property button
            if (listPropertyBtn) listPropertyBtn.style.display = 'none';
        }
    },

    // Create profile dropdown menu
    createProfileDropdown(user) {
        const dropdown = document.createElement('div');
        dropdown.id = 'profile-dropdown';
        dropdown.className = 'hidden absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50';

        const dashboardUrl = user.role === 'buyer' ? 'buyer-dashboard.html' :
            user.role === 'seller' || user.role === 'agent' ? 'seller-dashboard.html' :
                'index.html';

        dropdown.innerHTML = `
            <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <p class="text-sm font-bold text-gray-900 dark:text-white">${user.name}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">${user.email}</p>
                <p class="text-xs text-primary font-semibold mt-1 capitalize">${user.role}</p>
            </div>
            <div class="py-2">
                <a href="${dashboardUrl}" class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <span class="material-symbols-outlined text-lg">dashboard</span>
                    Dashboard
                </a>
                <a href="properties.html" class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <span class="material-symbols-outlined text-lg">home_work</span>
                    Browse Properties
                </a>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700 py-2">
                <button id="dropdown-logout" class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <span class="material-symbols-outlined text-lg">logout</span>
                    Logout
                </button>
            </div>
        `;

        // Add logout handler
        dropdown.querySelector('#dropdown-logout').onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.logout();
        };

        return dropdown;
    }
};

window.AuthService = AuthService;
