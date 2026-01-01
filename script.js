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

        // Start the content reveal sequence
        setTimeout(() => {
            const sections = document.querySelectorAll('.section');
            sections.forEach((section, index) => {
                setTimeout(() => {
                    section.classList.add('section-visible');
                }, index * 200); // Stagger each section by 200ms
            });
        }, 700); // Start while logo is still transitioning
    }, 3000);

    // Scroll-based active section highlighting
    const sections = document.querySelectorAll('.section');
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

        let currentSection = null;

        // If at bottom of page, always select the last section (Contact)
        if (isAtBottom) {
            currentSection = sections[sections.length - 1];
        }
        // If we're at the very top of the page, select Home
        else if (scrollPosition <= 10) {
            currentSection = document.getElementById('home');
        }
        // Otherwise find which section we're currently in
        else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;

                if (triggerPoint >= sectionTop && triggerPoint < sectionBottom) {
                    currentSection = section;
                }
            });
        }

        // Update active class on nav links
        if (currentSection) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`.nav-links a[href="#${currentSection.id}"]`);
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

    // Form submission handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add your form submission logic here
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
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
});
