document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.setAttribute('data-theme', 'light');
        icon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        if (body.hasAttribute('data-theme')) {
            body.removeAttribute('data-theme');
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'dark');
        } else {
            body.setAttribute('data-theme', 'light');
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'light');
        }
    });

    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-times');
        } else {
            icon.classList.replace('fa-times', 'fa-bars');
        }
    });

    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
        });
    });

    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    document.querySelectorAll('.service-card, .portfolio-item').forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.1}s`;
        el.classList.add('reveal');
        observer.observe(el);
    });

    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        submitBtn.disabled = true;
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
        formStatus.textContent = '';
        formStatus.className = 'form-status';

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        const FORMSPREE_ID = 'xzdywdqd'; 
        const API_URL = `https://formspree.io/f/${FORMSPREE_ID}`;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                formStatus.textContent = 'Message sent successfully! I will get back to you soon.';
                formStatus.classList.add('status-success');
                contactForm.reset();
            } else {
                const result = await response.json();
                formStatus.textContent = result.errors ? result.errors[0].message : 'Something went wrong. Please try again.';
                formStatus.classList.add('status-error');
            }
        } catch (error) {
            console.error('Error:', error);
            formStatus.textContent = 'Connection error. Make sure the backend server is running!';
            formStatus.classList.add('status-error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
});
