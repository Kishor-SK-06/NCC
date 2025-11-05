// Initialize AOS animations
        AOS.init({
            duration: 1000,
            once: true
        });

        // Animate skill bars on scroll
        const skillBars = document.querySelectorAll('.skill-progress');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.style.width;
                    entry.target.style.width = '0';
                    setTimeout(() => {
                        entry.target.style.width = width;
                    }, 500);
                }
            });
        });

        skillBars.forEach(bar => observer.observe(bar));