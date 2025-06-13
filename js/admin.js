// Check admin login
function checkAdminLogin() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (!isLoggedIn) {
        window.location.href = 'login.html';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
}

// DOM Elements
const applicationsList = document.getElementById('applicationsList');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const courseFilter = document.getElementById('courseFilter');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const closeModal = document.querySelector('.close');

// Sample courses data (same as in other files)
const courses = [
    { id: 1, name: "Computer Science", duration: "4 Years", fees: "$12,000/year" },
    { id: 2, name: "Business Administration", duration: "3 Years", fees: "$10,000/year" },
    { id: 3, name: "Electrical Engineering", duration: "4 Years", fees: "$13,000/year" },
    { id: 4, name: "Psychology", duration: "3 Years", fees: "$9,000/year" },
    { id: 5, name: "Data Science", duration: "2 Years", fees: "$15,000/year" },
    { id: 6, name: "Marketing", duration: "2 Years", fees: "$11,000/year" }
];

// Populate course filter dropdown
function populateCourseFilter() {
    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.id;
        option.textContent = course.name;
        courseFilter.appendChild(option);
    });
}

// Function to get course name by ID
function getCourseName(courseId) {
    const course = courses.find(c => c.id === parseInt(courseId));
    return course ? course.name : 'Unknown Course';
}

// Function to format date
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

// Function to render applications
function renderApplications(filteredApplications = []) {
    applicationsList.innerHTML = '';
    
    const applications = filteredApplications.length > 0 ? 
        filteredApplications : 
        JSON.parse(localStorage.getItem('applications')) || [];

    applications.forEach((application, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${application.fullName}</td>
            <td>${application.email}</td>
            <td>${getCourseName(application.courseId)}</td>
            <td>${formatDate(application.applicationDate)}</td>
            <td>${application.status}</td>
            <td>
                <button class="btn btn-primary" onclick="editApplication(${index})">Edit</button>
                <button class="btn btn-danger" onclick="deleteApplication(${index})">Delete</button>
            </td>
        `;
        applicationsList.appendChild(row);
    });
}

// Function to filter applications
function filterApplications() {
    const searchTerm = searchInput.value.toLowerCase();
    const statusValue = statusFilter.value;
    const courseValue = courseFilter.value;
    
    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    
    const filteredApplications = applications.filter(application => {
        const matchesSearch = 
            application.fullName.toLowerCase().includes(searchTerm) ||
            application.email.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusValue || application.status === statusValue;
        const matchesCourse = !courseValue || application.courseId === courseValue;
        
        return matchesSearch && matchesStatus && matchesCourse;
    });
    
    renderApplications(filteredApplications);
}

// Function to edit application
function editApplication(index) {
    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    const application = applications[index];
    
    document.getElementById('editIndex').value = index;
    document.getElementById('editStatus').value = application.status;
    document.getElementById('editNotes').value = application.notes || '';
    
    editModal.style.display = 'block';
}

// Function to delete application
function deleteApplication(index) {
    if (confirm('Are you sure you want to delete this application?')) {
        const applications = JSON.parse(localStorage.getItem('applications')) || [];
        applications.splice(index, 1);
        localStorage.setItem('applications', JSON.stringify(applications));
        renderApplications();
    }
}

// Handle edit form submission
editForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const index = document.getElementById('editIndex').value;
    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    
    applications[index].status = document.getElementById('editStatus').value;
    applications[index].notes = document.getElementById('editNotes').value;
    
    localStorage.setItem('applications', JSON.stringify(applications));
    
    editModal.style.display = 'none';
    renderApplications();
});

// Close modal when clicking the X
closeModal.addEventListener('click', function() {
    editModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === editModal) {
        editModal.style.display = 'none';
    }
});

// Event Listeners
searchInput.addEventListener('input', filterApplications);
statusFilter.addEventListener('change', filterApplications);
courseFilter.addEventListener('change', filterApplications);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAdminLogin();
    populateCourseFilter();
    renderApplications();
}); 