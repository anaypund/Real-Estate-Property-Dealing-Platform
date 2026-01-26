// Global Search Utility
// This utility can be used on any page to enable search functionality

function setupGlobalSearch(searchInputSelector = 'input[placeholder*="Search"]', searchButtonSelector = 'button[data-action="search"]') {
    const searchInput = document.querySelector(searchInputSelector);
    const searchBtn = document.querySelector(searchButtonSelector);

    if (searchInput && searchBtn) {
        const handleSearch = () => {
            const searchQuery = searchInput.value.trim();
            if (searchQuery) {
                // Redirect to properties page with search query
                window.location.href = `/pages/properties.html?search=${encodeURIComponent(searchQuery)}`;
            } else {
                // If empty, just go to properties page
                window.location.href = '/pages/properties.html';
            }
        };

        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });

        return true;
    }

    return false;
}

// Export for use in other scripts
window.setupGlobalSearch = setupGlobalSearch;
