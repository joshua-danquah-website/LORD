// Sample job data (in a real application, this would come from an API)
const jobs = [
    {
        id: 1,
        title: "Senior Software Engineer",
        company: "Tech Corp Ghana",
        location: "East Legon, Accra",
        type: "full-time",
        experience: "senior",
        salary: "GH₵ 15K - 20K /month",
        description: "We are looking for an experienced software engineer to lead our development team...",
        tags: ["JavaScript", "React", "Node.js", "MongoDB"],
        date: "2024-02-15",
        logo: "building"
    },
    {
        id: 2,
        title: "UX/UI Designer",
        company: "Creative Solutions GH",
        location: "Cantonments, Accra",
        type: "full-time",
        experience: "mid",
        salary: "GH₵ 10K - 15K /month",
        description: "Join our creative team to design beautiful and intuitive user interfaces...",
        tags: ["Figma", "Adobe XD", "UI Design", "UX Research"],
        date: "2024-02-14",
        logo: "laptop-code"
    },
    {
        id: 3,
        title: "Data Scientist",
        company: "Analytics Pro Ghana",
        location: "Airport City, Accra",
        type: "full-time",
        experience: "mid",
        salary: "GH₵ 12K - 18K /month",
        description: "Looking for a data scientist to help us derive insights from our large datasets...",
        tags: ["Python", "Machine Learning", "SQL", "Data Analysis"],
        date: "2024-02-13",
        logo: "chart-line"
    },
    // Add more job listings as needed
];

// State management
let currentJobs = [...jobs];
let currentPage = 1;
const jobsPerPage = 5;

// DOM Elements
const jobsContainer = document.getElementById('jobsContainer');
const jobCount = document.getElementById('jobCount');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const currentPageSpan = document.getElementById('currentPage');
const applyFiltersBtn = document.getElementById('applyFilters');
const resetFiltersBtn = document.getElementById('resetFilters');
const sortSelect = document.getElementById('sortJobs');
const searchInput = document.getElementById('jobSearch');

// Initialize the page
function init() {
    updateJobsList();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    applyFiltersBtn.addEventListener('click', applyFilters);
    resetFiltersBtn.addEventListener('click', resetFilters);
    prevPageBtn.addEventListener('click', () => changePage(-1));
    nextPageBtn.addEventListener('click', () => changePage(1));
    sortSelect.addEventListener('change', sortJobs);
    searchInput.addEventListener('input', debounce(applyFilters, 300));
}

// Create job card HTML
function createJobCard(job) {
    return `
        <div class="job-card">
            <div class="job-card-header">
                <div class="company-logo">
                    <i class="fas fa-${job.logo}"></i>
                </div>
                <div class="job-info">
                    <h3>${job.title}</h3>
                    <p class="company-name">${job.company}</p>
                </div>
            </div>
            <div class="job-details">
                <span class="job-detail">
                    <i class="fas fa-map-marker-alt"></i>
                    ${job.location}
                </span>
                <span class="job-detail">
                    <i class="fas fa-briefcase"></i>
                    ${job.type}
                </span>
                <span class="job-detail">
                    <i class="fas fa-money-bill-wave"></i>
                    ${job.salary}
                </span>
            </div>
            <p class="job-description">${job.description}</p>
            <div class="job-tags">
                ${job.tags.map(tag => `<span class="job-tag">${tag}</span>`).join('')}
            </div>
            <div class="job-actions">
                <button class="apply-btn">Apply Now</button>
                <button class="save-btn" data-job-id="${job.id}">
                    <i class="far fa-bookmark"></i>
                </button>
            </div>
        </div>
    `;
}

// Update jobs list
function updateJobsList() {
    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    const paginatedJobs = currentJobs.slice(startIndex, endIndex);

    jobsContainer.innerHTML = paginatedJobs.map(job => createJobCard(job)).join('');
    jobCount.textContent = currentJobs.length;
    currentPageSpan.textContent = `Page ${currentPage}`;
    
    // Update pagination buttons
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = endIndex >= currentJobs.length;
}

// Change page
function changePage(delta) {
    currentPage += delta;
    updateJobsList();
}

// Apply filters
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const locationFilter = document.getElementById('locationFilter').value;
    const salaryFilter = document.getElementById('salaryFilter').value;
    const selectedTypes = Array.from(document.querySelectorAll('input[type="checkbox"][value^="full-time"]:checked, input[type="checkbox"][value^="part-time"]:checked, input[type="checkbox"][value^="contract"]:checked, input[type="checkbox"][value^="remote"]:checked')).map(cb => cb.value);
    const selectedExperience = Array.from(document.querySelectorAll('input[type="checkbox"][value^="entry"]:checked, input[type="checkbox"][value^="mid"]:checked, input[type="checkbox"][value^="senior"]:checked')).map(cb => cb.value);

    currentJobs = jobs.filter(job => {
        const matchesSearch = !searchTerm || 
            job.title.toLowerCase().includes(searchTerm) || 
            job.company.toLowerCase().includes(searchTerm) ||
            job.description.toLowerCase().includes(searchTerm);
        
        const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
        const matchesType = selectedTypes.length === 0 || selectedTypes.includes(job.type);
        const matchesExperience = selectedExperience.length === 0 || selectedExperience.includes(job.experience);
        
        return matchesSearch && matchesLocation && matchesType && matchesExperience;
    });

    currentPage = 1;
    updateJobsList();
}

// Reset filters
function resetFilters() {
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.getElementById('locationFilter').value = '';
    document.getElementById('salaryFilter').value = '';
    searchInput.value = '';
    sortSelect.value = 'recent';
    
    currentJobs = [...jobs];
    currentPage = 1;
    updateJobsList();
}

// Sort jobs
function sortJobs() {
    const sortBy = sortSelect.value;
    
    currentJobs.sort((a, b) => {
        switch(sortBy) {
            case 'salary-high':
                return extractSalary(b.salary) - extractSalary(a.salary);
            case 'salary-low':
                return extractSalary(a.salary) - extractSalary(b.salary);
            case 'recent':
            default:
                return new Date(b.date) - new Date(a.date);
        }
    });

    updateJobsList();
}

// Helper function to extract salary for sorting
function extractSalary(salaryString) {
    const matches = salaryString.match(/\d+/g);
    if (matches && matches.length >= 2) {
        return (parseInt(matches[0]) + parseInt(matches[1])) / 2;
    }
    return 0;
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