// Sample company data (in a real application, this would come from an API)
const companies = [
    {
        id: 1,
        name: "Tech Corp Ghana",
        industry: "technology",
        location: "East Legon, Accra",
        size: "201-500",
        description: "Leading technology company specializing in software development and digital transformation solutions for businesses across Africa.",
        openPositions: 15,
        employees: 350,
        rating: 4.5,
        logo: "building",
        featured: true
    },
    {
        id: 2,
        name: "GH Finance Solutions",
        industry: "finance",
        location: "Airport City, Accra",
        size: "51-200",
        description: "Innovative financial technology company providing modern banking solutions and digital payment systems for the Ghanaian market.",
        openPositions: 8,
        employees: 180,
        rating: 4.2,
        logo: "landmark",
        featured: true
    },
    {
        id: 3,
        name: "HealthCare Plus",
        industry: "healthcare",
        location: "Kumasi",
        size: "501+",
        description: "Leading healthcare provider with state-of-the-art facilities and expert medical professionals serving communities across Ghana.",
        openPositions: 25,
        employees: 750,
        rating: 4.7,
        logo: "hospital",
        featured: false
    },
    {
        id: 4,
        name: "EduTech Ghana",
        industry: "education",
        location: "Tema",
        size: "51-200",
        description: "Educational technology company revolutionizing learning through innovative digital solutions and platforms.",
        openPositions: 12,
        employees: 150,
        rating: 4.3,
        logo: "graduation-cap",
        featured: false
    },
    {
        id: 5,
        name: "Retail Masters",
        industry: "retail",
        location: "Accra Mall, Accra",
        size: "201-500",
        description: "Leading retail chain with multiple locations across Ghana, offering quality products and excellent customer service.",
        openPositions: 20,
        employees: 450,
        rating: 4.1,
        logo: "shopping-cart",
        featured: true
    }
];

// State management
let currentCompanies = [...companies];
let currentPage = 1;
const companiesPerPage = 5;

// DOM Elements
const companiesContainer = document.getElementById('companiesContainer');
const companyCount = document.getElementById('companyCount');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const currentPageSpan = document.getElementById('currentPage');
const applyFiltersBtn = document.getElementById('applyFilters');
const resetFiltersBtn = document.getElementById('resetFilters');
const sortSelect = document.getElementById('sortCompanies');
const searchInput = document.getElementById('companySearch');

// Initialize the page
function init() {
    updateCompaniesList();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    applyFiltersBtn.addEventListener('click', applyFilters);
    resetFiltersBtn.addEventListener('click', resetFilters);
    prevPageBtn.addEventListener('click', () => changePage(-1));
    nextPageBtn.addEventListener('click', () => changePage(1));
    sortSelect.addEventListener('change', sortCompanies);
    searchInput.addEventListener('input', debounce(applyFilters, 300));
}

// Create company card HTML
function createCompanyCard(company) {
    return `
        <div class="company-card">
            <div class="company-header">
                <div class="company-logo">
                    <i class="fas fa-${company.logo}"></i>
                </div>
                <div class="company-info">
                    <h3>${company.name}</h3>
                    <div class="company-meta">
                        <span class="company-meta-item">
                            <i class="fas fa-industry"></i>
                            ${company.industry}
                        </span>
                        <span class="company-meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            ${company.location}
                        </span>
                        <span class="company-meta-item">
                            <i class="fas fa-users"></i>
                            ${company.size} employees
                        </span>
                    </div>
                </div>
            </div>
            <p class="company-description">${company.description}</p>
            <div class="company-stats">
                <div class="stat-item">
                    <div class="stat-value">${company.openPositions}</div>
                    <div class="stat-label">Open Positions</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${company.employees}</div>
                    <div class="stat-label">Employees</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${company.rating}</div>
                    <div class="stat-label">Rating</div>
                </div>
            </div>
            <div class="company-actions">
                <button class="view-jobs-btn" onclick="window.location.href='jobs.html?company=${company.id}'">
                    View Jobs (${company.openPositions})
                </button>
                <button class="follow-btn" data-company-id="${company.id}">
                    <i class="far fa-heart"></i> Follow
                </button>
            </div>
        </div>
    `;
}

// Update companies list
function updateCompaniesList() {
    const startIndex = (currentPage - 1) * companiesPerPage;
    const endIndex = startIndex + companiesPerPage;
    const paginatedCompanies = currentCompanies.slice(startIndex, endIndex);

    companiesContainer.innerHTML = paginatedCompanies.map(company => createCompanyCard(company)).join('');
    companyCount.textContent = currentCompanies.length;
    currentPageSpan.textContent = `Page ${currentPage}`;
    
    // Update pagination buttons
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = endIndex >= currentCompanies.length;
}

// Change page
function changePage(delta) {
    currentPage += delta;
    updateCompaniesList();
}

// Apply filters
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const locationFilter = document.getElementById('locationFilter').value;
    const selectedIndustries = Array.from(document.querySelectorAll('input[type="checkbox"][value^="technology"]:checked, input[type="checkbox"][value^="finance"]:checked, input[type="checkbox"][value^="healthcare"]:checked, input[type="checkbox"][value^="education"]:checked, input[type="checkbox"][value^="retail"]:checked')).map(cb => cb.value);
    const selectedSizes = Array.from(document.querySelectorAll('input[type="checkbox"][value^="1-50"]:checked, input[type="checkbox"][value^="51-200"]:checked, input[type="checkbox"][value^="201-500"]:checked, input[type="checkbox"][value^="501+"]:checked')).map(cb => cb.value);

    currentCompanies = companies.filter(company => {
        const matchesSearch = !searchTerm || 
            company.name.toLowerCase().includes(searchTerm) || 
            company.description.toLowerCase().includes(searchTerm);
        
        const matchesLocation = !locationFilter || company.location.toLowerCase().includes(locationFilter.toLowerCase());
        const matchesIndustry = selectedIndustries.length === 0 || selectedIndustries.includes(company.industry);
        const matchesSize = selectedSizes.length === 0 || selectedSizes.includes(company.size);
        
        return matchesSearch && matchesLocation && matchesIndustry && matchesSize;
    });

    currentPage = 1;
    updateCompaniesList();
}

// Reset filters
function resetFilters() {
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.getElementById('locationFilter').value = '';
    searchInput.value = '';
    sortSelect.value = 'featured';
    
    currentCompanies = [...companies];
    currentPage = 1;
    updateCompaniesList();
}

// Sort companies
function sortCompanies() {
    const sortBy = sortSelect.value;
    
    currentCompanies.sort((a, b) => {
        switch(sortBy) {
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'jobs':
                return b.openPositions - a.openPositions;
            case 'featured':
            default:
                if (a.featured === b.featured) {
                    return b.rating - a.rating;
                }
                return b.featured - a.featured;
        }
    });

    updateCompaniesList();
}

// Debounce helper function
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

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 