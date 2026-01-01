document.addEventListener('DOMContentLoaded', () => {
    // Theme switch functionality
    const toggleSwitch = document.querySelector('#checkbox');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            toggleSwitch.checked = true;
        }
    }

    function switchTheme(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    }

    toggleSwitch.addEventListener('change', switchTheme, false);

    // Set copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();

    setTimeout(() => {
        const logoContainer = document.querySelector('.logo-container');
        logoContainer.classList.add('animation-complete');

        // Initialize scroll-based reveal animations after logo animation
        setTimeout(() => {
            initScrollAnimations();
        }, 500);
    }, 3000);

    // Scroll-triggered animations using Intersection Observer
    function initScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -80px 0px',
            threshold: 0.1
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');

                    // Animate child elements with stagger
                    const animatedChildren = entry.target.querySelectorAll('.animate-on-scroll');
                    animatedChildren.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animated');
                        }, index * 100);
                    });

                    // Unobserve after animation (one-time animation)
                    sectionObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all sections
        document.querySelectorAll('.section').forEach(section => {
            sectionObserver.observe(section);
        });

        // Separate observer for individual elements (cards, items, etc.)
        const elementObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('element-visible');
                    elementObserver.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        });

        // Observe service items, cards, and other elements
        document.querySelectorAll('.service-item, .column-card, .scope-card, .principle-item').forEach(el => {
            elementObserver.observe(el);
        });
    }

    // Scroll-based active section highlighting
    const sections = document.querySelectorAll('.section[data-nav]');
    const navLinks = document.querySelectorAll('.nav-links a');

    function updateActiveSection() {
        const scrollPosition = window.scrollY;

        // Get the offset for scroll-margin-top
        const scrollOffset = 170;

        // Calculate the trigger point (nav height + a small buffer)
        const triggerPoint = scrollPosition + scrollOffset + 50;

        // Check if we're at the bottom of the page
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const isAtBottom = (scrollPosition + windowHeight) >= (documentHeight - 50);

        let currentNavGroup = null;

        // If at bottom of page, always select Contact
        if (isAtBottom) {
            currentNavGroup = 'contact';
        }
        // If we're at the very top of the page, select Home
        else if (scrollPosition <= 10) {
            currentNavGroup = 'home';
        }
        // Otherwise find which section we're currently in
        else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;

                if (triggerPoint >= sectionTop && triggerPoint < sectionBottom) {
                    currentNavGroup = section.getAttribute('data-nav');
                }
            });
        }

        // Update active class on nav links based on data-nav group
        if (currentNavGroup) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`.nav-links a[href="#${currentNavGroup}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    }

    // Run on scroll with throttling for performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) return;
        scrollTimeout = setTimeout(() => {
            updateActiveSection();
            scrollTimeout = null;
        }, 10);
    });

    // Run on resize to handle mobile/desktop switch
    window.addEventListener('resize', updateActiveSection);

    // Initial call after animations complete
    setTimeout(updateActiveSection, 100);

    // Form submission via Formspree with AJAX (no redirect)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const originalFormHTML = contactForm.innerHTML;

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;

            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Show success message
                    contactForm.innerHTML = `
                        <div class="form-success">
                            <div class="success-icon">✓</div>
                            <h3>Message Sent</h3>
                            <p>Thank you for reaching out. We will get back to you shortly.</p>
                        </div>
                    `;

                    // Restore form after 4 seconds
                    setTimeout(() => {
                        contactForm.innerHTML = originalFormHTML;
                    }, 4000);
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                // Show error, restore button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                alert('There was an error sending your message. Please try again or email us directly.');
            }
        });
    }

    // Mouse movement effect for sections
    document.addEventListener('mousemove', (e) => {
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            section.style.setProperty('--mouse-x', `${x}%`);
            section.style.setProperty('--mouse-y', `${y}%`);
        });
    });

    // Scroll-to-top button functionality
    const scrollToTopButton = document.getElementById('scrollToTopButton');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopButton.classList.add('show');
        } else {
            scrollToTopButton.classList.remove('show');
        }
    });

    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        // Update active section after scroll completes
        setTimeout(updateActiveSection, 500);
    });

    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        nav.classList.toggle('open');
    });

    // Nav link smooth scroll with offset adjustment (for all screen sizes)
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElem = document.getElementById(targetId);

            // Close mobile menu if open
            if (nav.classList.contains('open')) {
                nav.classList.remove('open');
            }

            // Allow a small delay to ensure layout is updated in production.
            setTimeout(() => {
                // Calculate destination offset position
                const scrollOffset = 150;
                const targetY = targetElem.getBoundingClientRect().top + window.pageYOffset - scrollOffset;
                window.scrollTo({
                    top: Math.max(0, targetY),
                    behavior: 'smooth'
                });

                // Update active section after scroll completes
                setTimeout(updateActiveSection, 500);
            }, 50);
        });
    });

    // CTA button smooth scroll with offset adjustment
    document.querySelectorAll('.cta-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElem = document.getElementById(targetId);

            if (targetElem) {
                // Calculate destination offset position
                const scrollOffset = 150;
                const targetY = targetElem.getBoundingClientRect().top + window.pageYOffset - scrollOffset;
                window.scrollTo({
                    top: Math.max(0, targetY),
                    behavior: 'smooth'
                });

                // Update active section after scroll completes
                setTimeout(updateActiveSection, 500);
            }
        });
    });
});
