// Sample course data
const courses = [
    { id: 1, name: "Computer Science", duration: "4 Years", fees: "$12,000/year" },
    { id: 2, name: "Business Administration", duration: "3 Years", fees: "$10,000/year" },
    { id: 3, name: "Electrical Engineering", duration: "4 Years", fees: "$13,000/year" },
    { id: 4, name: "Psychology", duration: "3 Years", fees: "$9,000/year" },
    { id: 5, name: "Data Science", duration: "2 Years", fees: "$15,000/year" },
    { id: 6, name: "Marketing", duration: "2 Years", fees: "$11,000/year" }
];

// DOM Elements
const coursesList = document.getElementById('coursesList');
const searchInput = document.getElementById('searchInput');
const durationFilter = document.getElementById('durationFilter');

// Function to render courses
function renderCourses(filteredCourses = courses) {
    coursesList.innerHTML = '';
    
    filteredCourses.forEach(course => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${course.name}</td>
            <td>${course.duration}</td>
            <td>${course.fees}</td>
            <td>
                <button class="btn btn-primary" onclick="applyForCourse(${course.id})">Apply Now</button>
            </td>
        `;
        coursesList.appendChild(row);
    });
}

// Function to filter courses
function filterCourses() {
    const searchTerm = searchInput.value.toLowerCase();
    const durationValue = durationFilter.value;
    
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.name.toLowerCase().includes(searchTerm);
        const matchesDuration = !durationValue || course.duration.includes(durationValue);
        return matchesSearch && matchesDuration;
    });
    
    renderCourses(filteredCourses);
}

// Function to handle course application
function applyForCourse(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (course) {
        // Store selected course in localStorage
        localStorage.setItem('selectedCourse', JSON.stringify(course));
        // Redirect to application form
        window.location.href = 'apply.html';
    }
}

// Event Listeners
searchInput.addEventListener('input', filterCourses);
durationFilter.addEventListener('change', filterCourses);

// Initial render
renderCourses(); 