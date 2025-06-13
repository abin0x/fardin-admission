// Slider functionality
document.addEventListener('DOMContentLoaded', function() {
    // --- HERO SLIDER ---
    const slides = document.querySelectorAll('.hero-slide');
    const dotsContainer = document.querySelector('.hero-slider-dots');
    const prevBtn = document.querySelector('.hero-slider-arrow.prev');
    const nextBtn = document.querySelector('.hero-slider-arrow.next');
    let current = 0;
    let interval;

    // Create dots
    if (dotsContainer && slides.length > 1) {
        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        });
    }
    function updateSlider() {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === current);
        });
        if (dotsContainer) {
            dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === current);
            });
        }
    }
    function goTo(idx) {
        current = (idx + slides.length) % slides.length;
        updateSlider();
    }
    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }
    if (nextBtn) nextBtn.onclick = next;
    if (prevBtn) prevBtn.onclick = prev;
    function startAuto() { interval = setInterval(next, 6000); }
    function stopAuto() { clearInterval(interval); }
    if (slides.length > 1) {
        startAuto();
        document.querySelector('.hero-slider').addEventListener('mouseenter', stopAuto);
        document.querySelector('.hero-slider').addEventListener('mouseleave', startAuto);
    }
    // --- END HERO SLIDER ---

    // Mobile menu toggle (fix: only if exists)
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }

    // Smooth scroll for nav links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // Course search and filter
    const searchInput = document.querySelector('.courses-search');
    const filterSelect = document.querySelector('.courses-filter');
    const courseCards = document.querySelectorAll('.course-card');

    function filterCourses() {
        const search = searchInput ? searchInput.value.toLowerCase() : '';
        const filter = filterSelect ? filterSelect.value : 'all';
        courseCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const category = card.querySelector('.course-category').textContent.toLowerCase();
            const matchesSearch = title.includes(search);
            const matchesFilter = filter === 'all' || category === filter;
            card.style.display = (matchesSearch && matchesFilter) ? '' : 'none';
        });
    }
    if (searchInput && filterSelect) {
        searchInput.addEventListener('input', filterCourses);
        filterSelect.addEventListener('change', filterCourses);
    }

    // Application form logic
    const applyForm = document.querySelector('.apply-form');
    if (applyForm) {
        applyForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(applyForm);
            const application = {
                fullName: formData.get('fullName'),
                dob: formData.get('dob'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                course: formData.get('course'),
                applicationDate: new Date().toISOString(),
            };
            // Handle photo upload
            const photoFile = formData.get('photo');
            if (photoFile && photoFile.size > 0) {
                application.photo = await fileToBase64(photoFile);
            }
            // Handle document uploads
            const documentFiles = formData.getAll('documents');
            if (documentFiles && documentFiles.length > 0 && documentFiles[0].size > 0) {
                application.documents = await Promise.all(documentFiles.map(fileToBase64));
            }
            // Save to localStorage
            const existing = JSON.parse(localStorage.getItem('applications') || '[]');
            existing.push(application);
            localStorage.setItem('applications', JSON.stringify(existing));
            // Generate and download receipt
            const html = `<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Application Receipt</title><style>body{font-family:Inter,Arial,sans-serif;background:#f6f8fb;color:#222;padding:2rem;}h2{color:#1a237e;}table{width:100%;border-collapse:collapse;margin-top:1.5rem;}td{padding:0.7rem 1rem;border-bottom:1px solid #e3e7ef;}tr:last-child td{border-bottom:none;}th{text-align:left;padding:0.7rem 1rem;background:#f0f4fa;}@media(max-width:600px){body{padding:0.5rem;}table,td,th{font-size:0.98rem;}}</style></head><body><h2>Application Receipt</h2><table>` + Object.entries(application).filter(([k,v])=>k!=='photo'&&k!=='documents').map(([k,v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('') + `</table><p style='margin-top:2rem;color:#448aff;'>Thank you for applying to Excellence University!</p></body></html>`;
            const blob = new Blob([html], {type:'text/html'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Application_Receipt.html';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
            // Reset form
            applyForm.reset();
            alert('Application submitted successfully!');
        });
    }
    // Helper to convert file to base64
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .course-card, .stat-item');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.classList.add('animate');
            }
        });
    };
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
}); 