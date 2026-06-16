document.addEventListener('DOMContentLoaded', () => {
    // 1. Loader
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1000); // Hide loader after 1 second

    // 2. Theme Toggle (Dark/Light Mode)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (document.body.getAttribute('data-theme') === 'dark') {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    });

    // 3. Hamburger Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // 4. Navbar Background on Scroll & Scroll-to-Top Button
    const navbar = document.getElementById('navbar');
    const scrollTopBtn = document.getElementById('scroll-top');

    window.addEventListener('scroll', () => {
        // Navbar
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }

        // Scroll Top Button
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 5. Typing Animation
    const typedTextSpan = document.getElementById('typed-text');
    const textArray = ["Java Developer", "Flutter Developer", "Mobile App Developer", "Problem Solver"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000; // Delay between current and next text
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }

    if (textArray.length) setTimeout(type, newTextDelay + 250);

    // 6. Active Nav Link on Scroll
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinksItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current) && current !== '') {
                item.classList.add('active');
            }
        });
    });

    // 7. Stats Counter Animation & Skills Progress Bar Animation
    const statsSection = document.querySelector('.stats-container');
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    const skillsSection = document.querySelector('.skills');
    const progressBars = document.querySelectorAll('.progress');
    let skillsAnimated = false;

    function animateStats() {
        statNumbers.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const duration = 2000; // ms
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    stat.innerText = Math.ceil(current) + '+';
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.innerText = target + '+';
                }
            };
            updateCounter();
        });
    }

    function animateSkills() {
        progressBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width;
        });
    }

    // Use Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.5
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                animateStats();
                statsAnimated = true;
            }
        });
    }, observerOptions);

    if (statsSection) statsObserver.observe(statsSection);

    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !skillsAnimated) {
                animateSkills();
                skillsAnimated = true;
            }
        });
    }, observerOptions);

    if (skillsSection) skillsObserver.observe(skillsSection);

    // 8. Contact Form (Web3Forms - no activation needed)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn = document.getElementById('submitBtn');
            const resultDiv = document.getElementById('form-result');
            const formData = new FormData(contactForm);

            // Add the subject from the custom field
            const subjectVal = document.getElementById('subject').value;
            formData.set('subject', 'Portfolio Contact: ' + subjectVal);

            // Button loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>';

            resultDiv.style.display = 'none';
            resultDiv.className = 'form-result';

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();

                if (data.success) {
                    resultDiv.textContent = '✅ Message sent successfully! I will get back to you soon.';
                    resultDiv.classList.add('form-success');
                    resultDiv.style.display = 'block';
                    contactForm.reset();
                } else {
                    resultDiv.textContent = '❌ Something went wrong. Please try again or email me directly.';
                    resultDiv.classList.add('form-error');
                    resultDiv.style.display = 'block';
                }
            } catch (error) {
                resultDiv.textContent = '❌ Network error. Please check your connection and try again.';
                resultDiv.classList.add('form-error');
                resultDiv.style.display = 'block';
            }

            // Restore button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>';
        });
    }

});
