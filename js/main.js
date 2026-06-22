/**
 * Shireen Al-Sabea - Portfolio JavaScript
 * Interactive components: Theme Switcher, Mobile Navigation, Scroll Reveals, Tools Matrix, and Contact Form.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize core elements
    initTheme();
    initNavbar();
    initScrollAnimations();
    initToolsFilter();
    initContactForm();
});

/**
 * Theme Toggle (Light / Dark Mode)
 */
function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        let newTheme = 'light';
        
        if (currentTheme === 'light') {
            newTheme = 'dark';
        }
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

/**
 * Mobile Menu and Shrinking Navbar on Scroll
 */
function initNavbar() {
    const header = document.querySelector('.header');
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            document.body.classList.toggle('nav-active');
            
            // Toggle hamburger icon (simple transition)
            if (document.body.classList.contains('nav-active')) {
                menuBtn.innerHTML = '✕';
            } else {
                menuBtn.innerHTML = '☰';
            }
        });
    }
}

/**
 * Scroll triggered animations using IntersectionObserver
 */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-child');
    
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    
                    // Specific behavior: Animate proficiency bars in tool cards when scrolled into view
                    if (entry.target.classList.contains('active')) {
                        const bars = entry.target.querySelectorAll('.tool-proficiency-fill');
                        bars.forEach(bar => {
                            const value = bar.getAttribute('data-value');
                            bar.style.width = value + '%';
                        });
                    }
                    
                    observer.unobserve(entry.target); // Trigger only once
                }
            });
        }, observerOptions);

        revealElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => {
            el.classList.add('active');
            const bars = el.querySelectorAll('.tool-proficiency-fill');
            bars.forEach(bar => {
                const value = bar.getAttribute('data-value');
                bar.style.width = value + '%';
            });
        });
    }
}

/**
 * Tools page filter functionality
 */
function initToolsFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const toolCards = document.querySelectorAll('.tool-card');
    
    if (filterButtons.length === 0 || toolCards.length === 0) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from other buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            toolCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Reset animation state
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';

                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'flex';
                        // Trigger reflow
                        card.offsetHeight; 
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                        
                        // Animate proficiency bar inside active filtered cards
                        const bar = card.querySelector('.tool-proficiency-fill');
                        if (bar) {
                            const val = bar.getAttribute('data-value');
                            bar.style.width = val + '%';
                        }
                    } else {
                        card.style.display = 'none';
                    }
                }, 200);
            });
        });
    });
}

/**
 * Interactive Contact Form
 */
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Perform basic validation
        const nameInput = form.querySelector('#name');
        const emailInput = form.querySelector('#email');
        const msgInput = form.querySelector('#message');

        if (!nameInput.value || !emailInput.value || !msgInput.value) {
            showToast('Please fill out all fields.', 'error');
            return;
        }

        // Simulating form submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const origText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending Message...';

        setTimeout(() => {
            showToast('Thank you, Shireen will get back to you shortly!', 'success');
            form.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = origText;
            
            // Reset floating labels
            const inputs = form.querySelectorAll('.form-input');
            inputs.forEach(input => {
                input.dispatchEvent(new Event('input'));
            });
        }, 1500);
    });
}

/**
 * Utility toast notification system
 */
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Style the toast dynamically (avoiding separate CSS definitions if simple)
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.right = '30px';
    toast.style.padding = '1rem 2rem';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '9999';
    toast.style.fontWeight = '600';
    toast.style.fontFamily = "'Plus Jakarta Sans', sans-serif";
    toast.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
    toast.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    
    if (type === 'success') {
        toast.style.backgroundColor = '#10B981';
        toast.style.color = '#ffffff';
    } else {
        toast.style.backgroundColor = '#EF4444';
        toast.style.color = '#ffffff';
    }
    
    toast.innerHTML = message;
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    }, 50);

    // Remove toast
    setTimeout(() => {
        toast.style.transform = 'translateY(100px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}
