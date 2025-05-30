function showPopup(section) {
  const text = {
    home: "Welcome to SkillBoost! This is your one-stop platform to explore high-quality mobile courses that empower your learning journey.",
    services: "At SkillBoost, we offer a wide range of learning services — from beginner to advanced — covering topics like Computer, Electrical, Mechanical...etc",
    contact: "Need help or have questions? Reach out to the SkillBoost team and we'll assist you in your learning adventure every step of the way!"
  };

  document.getElementById('popup-text').textContent = text[section];
  document.getElementById('popup').style.display = 'flex';
}

function closePopup() {
  document.getElementById('popup').style.display = 'none';
}

function learnmore(section) {
  const text = {
    learn: "this is my name"
  };
  document.getElementById('popup-text').textContent = text[section];
  document.getElementById('popup').style.display = 'flex';
}

//courses boxes
// const courses = [
//   { title: 'HTML & CSS Fundamentals' },
//   { title: 'JavaScript for Beginners' },
//   { title: 'Responsive Web Design' },
//   { title: 'React Basics' },
//   { title: 'Node.js Crash Course' },
// ];

// function displayCourses() {
//   const courseContainer = document.getElementById('courses');
//   courseContainer.innerHTML = '';
//   courses.forEach(course => {
//     const card = document.createElement('div');
//     card.className = 'course-card';
//     card.innerHTML = `
//       <h4>${course.title}</h4>
//       <button onclick="enroll('${course.title}')">Enroll</button>
//     `;
//     courseContainer.appendChild(card);
//   });
// }

function enroll(courseTitle) {
  const myCoursesBox = document.getElementById('myCourses');
  const existingText = myCoursesBox.querySelector('p');
  if (existingText) existingText.remove();

  const enrolled = document.createElement('p');
  enrolled.textContent = `✅ Enrolled in: ${courseTitle}`;
  myCoursesBox.appendChild(enrolled);
}

function searchCourses() {
  const query = document.getElementById('search').value.toLowerCase();
  const filtered = courses.filter(course => course.title.toLowerCase().includes(query));
  const courseContainer = document.getElementById('courses');
  courseContainer.innerHTML = '';

  if (filtered.length === 0) {
    courseContainer.innerHTML = '<p>No courses found.</p>';
  } else {
    filtered.forEach(course => {
      const card = document.createElement('div');
      card.className = 'course-card';
      card.innerHTML = `
        <h4>${course.title}</h4>
        <button onclick="enroll('${course.title}')">Enroll</button>
      `;
      courseContainer.appendChild(card);
    });
  }
}

// Toggle nav menu
function toggleMenu() {
  const menu = document.getElementById('navMenu');
  menu.classList.toggle('active');
}

displayCourses();

// Show modal on page load
window.onload = function () {
  document.getElementById("welcomeModal").style.display = "flex";
};

function continueAsGuest() {
  document.getElementById("welcomeModal").style.display = "none";
}

function redirectToSignIn() {
  window.location.href = "signin.html";
}

// =====================
// Helper: API Base URL
// =====================
const API_BASE = 'http://localhost:8080/api';

// =====================
// Helper: Auth Header
// =====================
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': 'Bearer ' + token } : {};
}

// =====================
// Sign In Logic
// =====================
const signinForm = document.getElementById('signin-form');
if (signinForm) {
  signinForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    if (!username || !password) {
      alert('Please fill in both fields.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) {
        const err = await res.text();
        alert('Login failed: ' + err);
        return;
      }
      const data = await res.json();
      localStorage.setItem('token', data.token);
      alert('Login successful!');
      window.location.href = 'dashboard.html';
    } catch (err) {
      alert('Network error.');
    }
  });
}

// =====================
// Sign Up Logic
// =====================
const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();
    if (!username || !email || !password || !confirmPassword) {
      alert('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      if (!res.ok) {
        const err = await res.text();
        alert('Sign up failed: ' + err);
        return;
      }
      alert('Registration successful! Please sign in.');
      window.location.href = 'signin.html';
    } catch (err) {
      alert('Network error.');
    }
  });
}

// =====================
// Password Reset Logic
// =====================
const resetForm = document.getElementById('reset-form');
if (resetForm) {
  resetForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();
    if (!email || !password || !confirmPassword) {
      alert('Please fill out all fields.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, confirmPassword })
      });
      if (!res.ok) {
        const err = await res.text();
        alert('Password reset failed: ' + err);
        return;
      }
      alert('Password reset successful! Please sign in.');
      window.location.href = 'signin.html';
    } catch (err) {
      alert('Network error.');
    }
  });
}

// =====================
// Dashboard Logic
// =====================
if (window.location.pathname.endsWith('dashboard.html')) {
  document.addEventListener('DOMContentLoaded', async function () {
    try {
      const res = await fetch(`${API_BASE}/dashboard`, {
        headers: { ...getAuthHeaders() }
      });
      if (!res.ok) {
        alert('Please log in to view your dashboard.');
        window.location.href = 'signin.html';
        return;
      }
      const data = await res.json();
      // Example: update dashboard stats (customize as needed)
      document.getElementById('studyTime').textContent = data.studyTime + ' hrs';
      document.getElementById('accuracyRate').textContent = data.accuracyRate + '%';
      document.getElementById('achievementPoints').textContent = data.achievementPoints;
      // Populate subject progress if you have a table or list
      // ...
    } catch (err) {
      alert('Network error.');
    }
  });
}

// =====================
// Profile Logic
// =====================
if (window.location.pathname.endsWith('profile.html')) {
  document.addEventListener('DOMContentLoaded', async function () {
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        headers: { ...getAuthHeaders() }
      });
      if (!res.ok) {
        alert('Please log in to view your profile.');
        window.location.href = 'signin.html';
        return;
      }
      const user = await res.json();
      document.getElementById('username').value = user.username;
      document.getElementById('email').value = user.email;
      document.getElementById('country').value = user.country || '';
      document.getElementById('region').value = user.region || '';
      document.getElementById('Language').value = user.defaultLanguage || '';
      document.getElementById('role').value = user.role || '';
      // Disable fields by default
      document.querySelectorAll('#profile-form input, #profile-form select').forEach(el => el.disabled = true);
    } catch (err) {
      alert('Network error.');
    }
  });

  // Enable editing
  const editBtn = document.querySelector('.edit-btn');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      document.querySelectorAll('#profile-form input, #profile-form select').forEach(el => el.disabled = false);
    });
  }

  // Handle profile update
  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const updates = {
        country: document.getElementById('country').value,
        region: document.getElementById('region').value,
        defaultLanguage: document.getElementById('Language').value,
        role: document.getElementById('role').value
      };
      try {
        const res = await fetch(`${API_BASE}/profile`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify(updates)
        });
        if (!res.ok) {
          alert('Profile update failed.');
          return;
        }
        alert('Profile updated!');
        window.location.reload();
      } catch (err) {
        alert('Network error.');
      }
    });
  }
}

// =====================
// Course Listing & Enrollment Logic
// =====================
if (window.location.pathname.endsWith('landingpage.html')) {
  document.addEventListener('DOMContentLoaded', async function () {
    try {
      const res = await fetch(`${API_BASE}/courses`, {
        headers: { ...getAuthHeaders() }
      });
      if (!res.ok) {
        alert('Could not load courses.');
        return;
      }
      const courses = await res.json();
      const courseContainer = document.querySelector('.courses');
      if (courseContainer) {
        courseContainer.innerHTML = '';
        courses.forEach(course => {
          const div = document.createElement('div');
          div.className = 'iterm1'; // or use a different class for each
          div.innerHTML = `
            <img src="asset/new1/${course.title.toLowerCase()}.png" alt="${course.title}" class="img1"><br>
            <h3>${course.title}</h3>
            <button class="btn2" onclick="enrollCourse(${course.id}, '${course.title}')">Enroll</button>
          `;
          courseContainer.appendChild(div);
        });
      }
    } catch (err) {
      alert('Network error.');
    }
  });
}

// Enroll in a course
window.enrollCourse = async function(courseId, courseTitle) {
  try {
    const res = await fetch(`${API_BASE}/enroll/${courseId}`, {
      method: 'POST',
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) {
      const err = await res.text();
      alert('Enrollment failed: ' + err);
      return;
    }
    alert(`Enrolled in: ${courseTitle}`);
    // Optionally update UI or redirect
  } catch (err) {
    alert('Network error.');
  }
};
