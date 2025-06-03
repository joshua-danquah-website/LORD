// DOM Elements
const searchToggle = document.querySelector('.search-toggle');
const searchOverlay = document.querySelector('.search-overlay');
const header = document.querySelector('header');

// Search Toggle Functionality
searchToggle.addEventListener('click', () => {
    searchOverlay.classList.toggle('active');
    if (searchOverlay.classList.contains('active')) {
        searchOverlay.querySelector('input').focus();
    }
});

// Close search overlay when clicking outside
document.addEventListener('click', (e) => {
    if (!searchOverlay.contains(e.target) && !searchToggle.contains(e.target)) {
        searchOverlay.classList.remove('active');
    }
});

// Header scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // Scrolling down
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // Scrolling up
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Job search functionality
const heroSearchForm = document.querySelector('.hero-search');
heroSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const jobTitle = heroSearchForm.querySelector('input[placeholder="Job title or keyword"]').value;
    const location = heroSearchForm.querySelector('input[placeholder="Location"]').value;
    
    // Here you would typically make an API call to search for jobs
    console.log('Searching for:', { jobTitle, location });
    // For demo purposes, we'll just show an alert
    alert(`Searching for ${jobTitle} jobs in ${location}`);
});

// Animate elements on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.job-card, .feature');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.classList.add('animate');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Mobile menu functionality (to be implemented)
const mobileMenuButton = document.createElement('button');
mobileMenuButton.classList.add('mobile-menu-button');
mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>';
header.insertBefore(mobileMenuButton, header.firstChild);

mobileMenuButton.addEventListener('click', () => {
    const nav = document.querySelector('nav');
    nav.classList.toggle('active');
    mobileMenuButton.classList.toggle('active');
}); 