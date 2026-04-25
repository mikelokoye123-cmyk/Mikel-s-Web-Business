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

    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeChatbot = document.getElementById('close-chatbot');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');
    const chatInput = document.getElementById('chat-input');
    const sendChat = document.getElementById('send-chat');

    const responses = {
        "Who is Mikel?": "Mikel is an 18 year old, professional web developer and designer specializing in high-performance websites for businesses.",
        "Is Mikel qualified?": "Mikel has extensive experience building custom platforms, dashboards, and landing pages with a focus on modern UX and clean code. He spent 2 years learning basic programming languages and 1 year learning advanced programming languages",
        "Can you create both Frontend and Backend?": "Yes! Mikel provides full-stack services, meaning he can handle everything from the visual design (Frontend) to the server logic and databases (Backend)."
    };

    chatbotButton.addEventListener('click', () => {
        chatbotWindow.classList.toggle('active');
    });

    closeChatbot.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
    });

    const handleChat = (message) => {
        if (!message) return;

        const userMsg = document.createElement('div');
        userMsg.className = 'message user';
        userMsg.textContent = message;
        chatbotMessages.appendChild(userMsg);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

        const lowerMsg = message.toLowerCase();
        let botResponse = "";

        if (responses[message]) {
            botResponse = responses[message];
        } else if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('how much') || lowerMsg.includes('charge')) {
            botResponse = "Pricing depends on the complexity of your project! To get an accurate quote, please DM Mikel on WhatsApp or fill out the contact form below.";
        } else if (lowerMsg.includes('how long') || lowerMsg.includes('duration') || lowerMsg.includes('days') || lowerMsg.includes('finish') || lowerMsg.includes('time')) {
            botResponse = "It depends on the scope of the project, but I typically deliver a high-quality site in a minimum of 2 days and a maximum of 6 days.";
        } else if (lowerMsg.includes('help') || lowerMsg.includes('services') || lowerMsg.includes('what can you do')) {
            botResponse = "Mikel can help you with modern web design, full-stack development (frontend & backend), and high-converting landing pages. What kind of project do you have in mind?";
        } else {
            botResponse = "That's a great question! For specific details like that, it's best to fill out Mikel's contact form below or send him a WhatsApp message. He'll get back to you personally!";
        }

        setTimeout(() => {
            const botMsg = document.createElement('div');
            botMsg.className = 'message bot';
            botMsg.textContent = botResponse;
            chatbotMessages.appendChild(botMsg);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }, 600);
    };

    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            handleChat(btn.getAttribute('data-question'));
        });
    });

    sendChat.addEventListener('click', () => {
        const message = chatInput.value.trim();
        handleChat(message);
        chatInput.value = '';
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const message = chatInput.value.trim();
            handleChat(message);
            chatInput.value = '';
        }
    });
});
