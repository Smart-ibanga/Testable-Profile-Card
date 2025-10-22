class AboutPage {
    constructor() {
        this.sections = document.querySelectorAll('.about-section');
        this.init();
    }

    init() {
        this.setupSectionInteractions();
        this.setupPrintStyles();
        this.setupAccessibility();
    }

    setupSectionInteractions() {
        // Add subtle animations when sections come into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1
        });

        this.sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });
    }

    setupPrintStyles() {
        // Add print button
        const printButton = document.createElement('button');
        printButton.textContent = 'Print This Page';
        printButton.className = 'print-button';
        printButton.addEventListener('click', this.printPage.bind(this));
        
        const pageHeader = document.querySelector('.page-header');
        pageHeader.appendChild(printButton);
    }

    printPage() {
        window.print();
    }

    setupAccessibility() {
        // Add skip to content link if not already in main CSS
        this.ensureSkipLink();
        
        // Add section navigation for screen readers
        this.addSectionNavigation();
    }

    ensureSkipLink() {
        if (!document.getElementById('skip-link')) {
            const skipLink = document.createElement('a');
            skipLink.href = '#main-content';
            skipLink.textContent = 'Skip to main content';
            skipLink.id = 'skip-link';
            skipLink.className = 'skip-link';
            
            document.body.insertBefore(skipLink, document.body.firstChild);
            
            // Add ID to main content
            const mainContent = document.querySelector('main');
            if (mainContent && !mainContent.id) {
                mainContent.id = 'main-content';
            }
        }
    }

    addSectionNavigation() {
        // Add landmark navigation for screen readers
        const nav = document.createElement('nav');
        nav.setAttribute('aria-label', 'Page sections');
        nav.className = 'section-nav visually-hidden';
        
        const sectionList = document.createElement('ul');
        
        this.sections.forEach(section => {
            const heading = section.querySelector('h2');
            if (heading) {
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = `#${section.id || this.generateSectionId(section)}`;
                link.textContent = heading.textContent;
                sectionList.appendChild(listItem);
                listItem.appendChild(link);
            }
        });
        
        nav.appendChild(sectionList);
        
        const mainNav = document.querySelector('.main-nav');
        if (mainNav) {
            mainNav.parentNode.insertBefore(nav, mainNav.nextSibling);
        }
    }

    generateSectionId(section) {
        const heading = section.querySelector('h2');
        const id = heading.textContent.toLowerCase().replace(/\s+/g, '-');
        section.id = id;
        return id;
    }
}

// Initialize about page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AboutPage();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AboutPage;
}