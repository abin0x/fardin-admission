// DOM Elements
const applicationForm = document.getElementById('applicationForm');
const courseSelect = document.getElementById('course');

// Sample courses data (same as in other files)
const courses = [
    { id: 1, name: "Computer Science", duration: "4 Years", fees: "$12,000/year" },
    { id: 2, name: "Business Administration", duration: "3 Years", fees: "$10,000/year" },
    { id: 3, name: "Electrical Engineering", duration: "4 Years", fees: "$13,000/year" },
    { id: 4, name: "Psychology", duration: "3 Years", fees: "$9,000/year" },
    { id: 5, name: "Data Science", duration: "2 Years", fees: "$15,000/year" },
    { id: 6, name: "Marketing", duration: "2 Years", fees: "$11,000/year" }
];

// Populate course dropdown
function populateCourses() {
    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.id;
        option.textContent = `${course.name} (${course.duration})`;
        courseSelect.appendChild(option);
    });

    // Check if there's a pre-selected course from the courses page
    const selectedCourse = JSON.parse(localStorage.getItem('selectedCourse'));
    if (selectedCourse) {
        courseSelect.value = selectedCourse.id;
        localStorage.removeItem('selectedCourse'); // Clear the stored course
    }
}

// Function to convert file to base64
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Function to generate application receipt HTML
function generateReceiptHTML(application) {
    const course = courses.find(c => c.id === parseInt(application.courseId));
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Application Receipt - ${application.fullName}</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    padding: 20px;
                    background: linear-gradient(135deg, #4a90e2, #2c3e50);
                    color: white;
                    border-radius: 10px;
                }
                .content {
                    background: white;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                .section {
                    margin-bottom: 20px;
                }
                .section h2 {
                    color: #2c3e50;
                    border-bottom: 2px solid #4a90e2;
                    padding-bottom: 5px;
                }
                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                .info-item {
                    margin-bottom: 10px;
                }
                .info-label {
                    font-weight: bold;
                    color: #666;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Application Receipt</h1>
                <p>College Admission Management System</p>
            </div>
            <div class="content">
                <div class="section">
                    <h2>Personal Information</h2>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Full Name:</span>
                            <span>${application.fullName}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Date of Birth:</span>
                            <span>${application.dob}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Email:</span>
                            <span>${application.email}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Phone:</span>
                            <span>${application.phone}</span>
                        </div>
                    </div>
                </div>
                <div class="section">
                    <h2>Course Information</h2>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Selected Course:</span>
                            <span>${course ? course.name : 'Unknown'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Duration:</span>
                            <span>${course ? course.duration : 'Unknown'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Fees:</span>
                            <span>${course ? course.fees : 'Unknown'}</span>
                        </div>
                    </div>
                </div>
                <div class="section">
                    <h2>Application Details</h2>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Application Date:</span>
                            <span>${new Date(application.applicationDate).toLocaleDateString()}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Status:</span>
                            <span>${application.status}</span>
                        </div>
                    </div>
                </div>
                ${application.message ? `
                <div class="section">
                    <h2>Additional Information</h2>
                    <p>${application.message}</p>
                </div>
                ` : ''}
            </div>
            <div class="footer">
                <p>This is a computer-generated receipt and does not require a signature.</p>
                <p>Thank you for choosing our institution!</p>
            </div>
        </body>
        </html>
    `;
}

// Function to download receipt
function downloadReceipt(application) {
    const receiptHTML = generateReceiptHTML(application);
    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `application_receipt_${application.fullName.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// Function to handle form submission
async function handleSubmit(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(applicationForm);
    const application = {
        fullName: formData.get('fullName'),
        dob: formData.get('dob'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        courseId: formData.get('course'),
        message: formData.get('message'),
        applicationDate: new Date().toISOString(),
        status: 'Pending'
    };

    // Handle photo upload
    const photoFile = formData.get('photo');
    if (photoFile) {
        try {
            application.photo = await getBase64(photoFile);
        } catch (error) {
            console.error('Error converting photo:', error);
            alert('Error uploading photo. Please try again.');
            return false;
        }
    }

    // Handle document uploads
    const documentFiles = formData.getAll('documents');
    if (documentFiles.length > 0) {
        try {
            application.documents = await Promise.all(
                documentFiles.map(file => getBase64(file))
            );
        } catch (error) {
            console.error('Error converting documents:', error);
            alert('Error uploading documents. Please try again.');
            return false;
        }
    }

    // Get existing applications or initialize empty array
    const existingApplications = JSON.parse(localStorage.getItem('applications')) || [];
    
    // Add new application
    existingApplications.push(application);
    
    // Save to localStorage
    localStorage.setItem('applications', JSON.stringify(existingApplications));

    // Show success message
    alert('Application submitted successfully!');
    
    // Download receipt
    downloadReceipt(application);
    
    // Reset form
    applicationForm.reset();
    
    return false;
}

// Initialize form
document.addEventListener('DOMContentLoaded', () => {
    populateCourses();
}); 