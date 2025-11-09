 // Initialize AOS
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });

        // Navbar scroll effect
        window.addEventListener('scroll', function() {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Animate numbers in stats section
        function animateValue(element, start, end, duration) {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                element.innerHTML = Math.floor(progress * (end - start) + start) + (element.dataset.suffix || '');
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }

        // Trigger animation when stats section is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumbers = document.querySelectorAll('.stat-number');
                    statNumbers.forEach(stat => {
                        const text = stat.textContent.trim();
                        // Only animate when the content is a plain number or number with a trailing + (e.g. "20+")
                        const numericMatch = text.match(/^(\d+)(\+)?$/);
                        if (numericMatch) {
                            const finalValue = parseInt(numericMatch[1], 10);
                            stat.dataset.suffix = numericMatch[2] ? '+' : '';
                            animateValue(stat, 0, finalValue, 2000);
                        } else {
                            // For non-numeric values (like "1-10", "Govt.", "Quality"), leave them as-is
                            stat.innerHTML = text;
                        }
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            observer.observe(statsSection);
        }

        // Smooth scroll for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Gallery Lightbox Functionality
        const galleryImages = document.querySelectorAll('.gallery-item img');
        const lightbox = document.querySelector('.lightbox');
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.close');
        const prevBtn = lightbox.querySelector('.prev');
        const nextBtn = lightbox.querySelector('.next');

        let currentIndex = 0;

        function showImage(index) {
            if (index >= 0 && index < galleryImages.length) {
                currentIndex = index;
                lightboxImg.src = galleryImages[currentIndex].src;
                lightboxImg.alt = galleryImages[currentIndex].alt;
                lightbox.style.display = 'flex';
            }
        }

        galleryImages.forEach((img, index) => {
            img.addEventListener('click', function() {
                showImage(index);
            });
        });

        closeBtn.addEventListener('click', function() {
            lightbox.style.display = 'none';
        });

        prevBtn.addEventListener('click', function() {
            showImage(currentIndex - 1);
        });

        nextBtn.addEventListener('click', function() {
            showImage(currentIndex + 1);
        });

        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (lightbox.style.display === 'flex') {
                if (e.key === 'ArrowLeft') {
                    showImage(currentIndex - 1);
                } else if (e.key === 'ArrowRight') {
                    showImage(currentIndex + 1);
                } else if (e.key === 'Escape') {
                    lightbox.style.display = 'none';
                }
            }
        });
