// DOM Elements
const contactForm = document.getElementById('contactForm');

// Function to handle form submission
function handleSubmit(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        date: new Date().toISOString()
    };

    // Get existing messages or initialize empty array
    const existingMessages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    
    // Add new message
    existingMessages.push(contactData);
    
    // Save to localStorage
    localStorage.setItem('contactMessages', JSON.stringify(existingMessages));

    // Show success message
    alert('Thank you for your message! We will get back to you soon.');
    
    // Reset form
    contactForm.reset();
    
    return false;
} 