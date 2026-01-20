// Utility Functions

// Show toast notification
function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.getElementById('toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 transform transition-all duration-300 translate-x-0`;

    // Set color based on type
    const colors = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-white',
        info: 'bg-blue-500 text-white'
    };

    toast.className += ` ${colors[type] || colors.info}`;

    // Add icon based on type
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    toast.innerHTML = `
    <span class="text-xl font-bold">${icons[type] || icons.info}</span>
    <span class="font-medium">${message}</span>
  `;

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.add('opacity-100'), 100);

    // Remove after 4 seconds
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Show loading spinner
function showLoader(target = 'body') {
    const loader = document.createElement('div');
    loader.id = 'global-loader';
    loader.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50';
    loader.innerHTML = `
    <div class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl">
      <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
    </div>
  `;
    document.body.appendChild(loader);
}

// Hide loading spinner
function hideLoader() {
    const loader = document.getElementById('global-loader');
    if (loader) {
        loader.remove();
    }
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(price);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
}

// Format relative time (e.g., "2 hours ago")
function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return formatDate(dateString);
}

// Get query parameters from URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) {
        result[key] = value;
    }
    return result;
}

// Set query parameters in URL
function setQueryParams(params) {
    const url = new URL(window.location.href);
    Object.keys(params).forEach(key => {
        if (params[key]) {
            url.searchParams.set(key, params[key]);
        } else {
            url.searchParams.delete(key);
        }
    });
    window.history.pushState({}, '', url);
}

// Get property ID from URL
function getPropertyIdFromUrl() {
    const params = getQueryParams();
    return params.id;
}

// Truncate text
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Validate email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Image URL helper (for backend uploaded images)
function getImageUrl(imagePath) {
    if (!imagePath) return 'https://via.placeholder.com/400x300?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;

    // Remove 'uploads/' prefix if it exists
    const cleanPath = imagePath.replace(/^uploads[\/\\]/, '');
    return `http://localhost:5000/uploads/properties/${cleanPath}`;
}

// Export functions to window
window.showToast = showToast;
window.showLoader = showLoader;
window.hideLoader = hideLoader;
window.formatPrice = formatPrice;
window.formatDate = formatDate;
window.formatRelativeTime = formatRelativeTime;
window.getQueryParams = getQueryParams;
window.setQueryParams = setQueryParams;
window.getPropertyIdFromUrl = getPropertyIdFromUrl;
window.truncateText = truncateText;
window.debounce = debounce;
window.isValidEmail = isValidEmail;
window.getImageUrl = getImageUrl;
