
// Pre-defined Admin Credentials (In real application, this would be in a secure database)
const adminCredentials = {
  'admin': 'admin123',           // Main Admin
  'sports_head': 'zest2026',     // Sports Head
  'coordinator_cs': 'cs@2026',   // CS Coordinator
  'coordinator_ec': 'ec@2026',   // EC Coordinator
  'scorekeeper': 'score@123'     // Score Keeper
};

// Google Apps Script Web App URL for saving form details to Google Sheets
// TODO: Replace the placeholder below with your actual deployed Web App URL.
// Example: const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx.../exec';
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzTAqPfBFWzCABmuUTCtZVf-2oRpaW17Buh4tTaV9mxhiuTkxe4A2uc_Fmw_evgK77OsA/exec';

// Check if user is already logged in as admin
let isAdminLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
let adminUsername = sessionStorage.getItem('adminUsername') || '';

// Letter-by-letter animation function
function animateText(elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const text = element.textContent;
  const letters = text.split('');
  element.textContent = '';
  
  letters.forEach((letter, index) => {
    const span = document.createElement('span');
    if (letter === ' ') {
      span.className = 'space';
      span.textContent = '\u00A0'; // Non-breaking space
    } else {
      span.textContent = letter;
    }
    span.style.animationDelay = `${index * 0.1}s`;
    element.appendChild(span);
  });
}

// Initialize admin state on page load
document.addEventListener('DOMContentLoaded', function() {
  // Animate the ZEST 2026 title and tagline on ZEST page
  animateText('animated-tagline-year');
  animateText('animated-tagline');
  
  if (isAdminLoggedIn) {
    showAdminAccess(adminUsername);
  }
  
  // Hamburger Menu
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('show');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('show');
      }
    });
  }
  
  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  // Partner section toggle for doubles in Student Portal
  initPartnerSectionToggle();
});

// Admin Login Function
function adminLogin(event) {
  event.preventDefault();
  const username = document.getElementById('adminUser').value;
  const password = document.getElementById('adminPass').value;
  const msgDiv = document.getElementById('adminLoginMsg');
  
  // Check credentials
  if (adminCredentials[username] && adminCredentials[username] === password) {
    msgDiv.className = 'message success';
    msgDiv.innerHTML = ` Admin access granted! Welcome ${username}.<br>Loading dashboard...`;
    
    // Store login state
    sessionStorage.setItem('adminLoggedIn', 'true');
    sessionStorage.setItem('adminUsername', username);
    isAdminLoggedIn = true;
    adminUsername = username;
    
    setTimeout(() => {
      showAdminAccess(username);
      document.getElementById('adminLoginForm').reset();
      msgDiv.innerHTML = '';
    }, 1500);
  } else {
    msgDiv.className = 'message error';
    msgDiv.innerHTML = ' Invalid credentials. Access denied.<br>Only pre-registered admins can access this panel.';
  }
  
  return false;
}

// Show admin access
function showAdminAccess(username) {
  // Show admin nav link
  const adminNavLink = document.getElementById('adminNavLink');
  const adminBadge = document.getElementById('adminBadge');
  const logoutBtn = document.getElementById('logoutBtn');
  
  if (adminNavLink) adminNavLink.classList.add('visible');
  if (adminBadge) adminBadge.classList.add('visible');
  if (logoutBtn) logoutBtn.classList.add('visible');
  
  // Show admin dashboard
  const adminLoginView = document.getElementById('adminLoginView');
  const adminDashboard = document.getElementById('adminDashboard');
  
  if (adminLoginView) adminLoginView.style.display = 'none';
  if (adminDashboard) adminDashboard.classList.add('visible');
}

// Logout function
function logout() {
  sessionStorage.removeItem('adminLoggedIn');
  sessionStorage.removeItem('adminUsername');
  isAdminLoggedIn = false;
  adminUsername = '';
  
  // Hide admin elements
  const adminNavLink = document.getElementById('adminNavLink');
  const adminBadge = document.getElementById('adminBadge');
  const logoutBtn = document.getElementById('logoutBtn');
  
  if (adminNavLink) adminNavLink.classList.remove('visible');
  if (adminBadge) adminBadge.classList.remove('visible');
  if (logoutBtn) logoutBtn.classList.remove('visible');
  
  // Hide admin dashboard, show login
  const adminLoginView = document.getElementById('adminLoginView');
  const adminDashboard = document.getElementById('adminDashboard');
  
  if (adminLoginView) adminLoginView.style.display = 'block';
  if (adminDashboard) adminDashboard.classList.remove('visible');
  
  // Go to home section (ZEST intro)
  navLinks.forEach(l => l.classList.remove('active'));
  sections.forEach(sec => sec.classList.remove('active'));
  const homeSection = document.getElementById('home');
  if (homeSection) homeSection.classList.add('active');

  alert(' You have been logged out successfully.');
}

// Navigation
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    // If link goes to another page (e.g. nsec-sports.html), allow default navigation
    const href = this.getAttribute('href');
    if (href && href !== 'javascript:void(0)' && !this.getAttribute('data-section')) {
      return; // browser will follow the link
    }
    e.preventDefault();

    // Check if trying to access admin without login
    if (this.getAttribute('data-section') === 'admin' && !isAdminLoggedIn) {
      alert('Admin access required. Please login with admin credentials.');
      return;
    }
    
    navLinks.forEach(l => l.classList.remove('active'));
    sections.forEach(sec => sec.classList.remove('active'));
    
    this.classList.add('active');
    
    const sectionId = this.getAttribute('data-section');
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Close mobile menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    if (hamburger && navMenu) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('show');
    }
  });
});

// Previous Years Gallery
function showYear(year) {
  document.querySelectorAll('.gallery-content').forEach(g => g.style.display = 'none');
  document.querySelectorAll('.year-btn').forEach(btn => btn.classList.remove('active-year'));
  
  const gallery = document.getElementById('gallery' + year);
  if (gallery) {
    gallery.style.display = 'block';
  }
  
  event.target.classList.add('active-year');
}

// Toggle between Login and Signup
function showLogin() {
  document.getElementById('loginForm').classList.add('active-form');
  document.getElementById('signupForm').classList.remove('active-form');
  document.querySelectorAll('.auth-toggle button')[0].classList.add('active-tab');
  document.querySelectorAll('.auth-toggle button')[1].classList.remove('active-tab');
}

function showSignup() {
  document.getElementById('signupForm').classList.add('active-form');
  document.getElementById('loginForm').classList.remove('active-form');
  document.querySelectorAll('.auth-toggle button')[1].classList.add('active-tab');
  document.querySelectorAll('.auth-toggle button')[0].classList.remove('active-tab');
}

// Student Login
function loginStudent(event) {
  event.preventDefault();
  const id = document.getElementById('loginId').value;
  const password = document.getElementById('loginPassword').value;
  const msgDiv = document.getElementById('loginMsg');
  
  // Check if this is an admin credential
  if (adminCredentials[id]) {
    if (adminCredentials[id] === password) {
      msgDiv.className = 'message success';
      msgDiv.innerHTML = ' Admin credentials detected! Redirecting to admin panel...';
      
      // Store admin session
      sessionStorage.setItem('adminLoggedIn', 'true');
      sessionStorage.setItem('adminUsername', id);
      isAdminLoggedIn = true;
      adminUsername = id;
      
      setTimeout(() => {
        showAdminAccess(id);
        // Switch to admin panel
        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(sec => sec.classList.remove('active'));
        document.querySelector('[data-section="admin"]').classList.add('active');
        document.getElementById('admin').classList.add('active');
        event.target.reset();
        msgDiv.innerHTML = '';
      }, 1500);
    } else {
      msgDiv.className = 'message error';
      msgDiv.innerHTML = ' Invalid admin password.';
    }
    return false;
  }
  
  // Regular student login
  if (id.length < 6) {
    msgDiv.className = 'message error';
    msgDiv.innerHTML = ' Invalid ID. Please enter a valid ZEST ID or College ID.';
    return false;
  }
  
  if (password.length < 6) {
    msgDiv.className = 'message error';
    msgDiv.innerHTML = ' Password must be at least 6 characters long.';
    return false;
  }
  
  msgDiv.className = 'message success';
  msgDiv.innerHTML = ` Login successful! Welcome back, ${id}.<br>Loading your ZEST dashboard...`;
  
  setTimeout(() => {
    event.target.reset();
    msgDiv.innerHTML = '';
  }, 3000);
  
  return false;
}

// Toggle partner section and build per-event partner fields when doubles sports are selected
function initPartnerSectionToggle() {
  const partnerSection = document.getElementById('partnerSection');
  const partnerFieldsContainer = document.getElementById('partnerFieldsContainer');
  const sportCheckboxes = document.querySelectorAll('input[name="sport"][data-doubles="1"]');

  if (!partnerSection || !partnerFieldsContainer || !sportCheckboxes.length) return;

  function updatePartnerSection() {
    const checkedDoubles = Array.from(sportCheckboxes).filter(cb => cb.checked);
    const anyDoublesChecked = checkedDoubles.length > 0;
    partnerSection.style.display = anyDoublesChecked ? 'block' : 'none';

    partnerFieldsContainer.innerHTML = '';
    checkedDoubles.forEach(function (cb) {
      const sportValue = cb.value;
      const block = document.createElement('div');
      block.className = 'form-group partner-event-block';
      block.style.marginBottom = '16px';
      block.setAttribute('data-sport', sportValue);
      block.innerHTML =
        '<label style="display:block; margin-bottom:6px; font-weight:600;">' + escapeHtml(sportValue) + '</label>' +
        '<input type="text" class="partner-name-input" data-sport="' + escapeHtml(sportValue) + '" placeholder="Partner name" style="width:100%; margin-bottom:6px; padding:8px; box-sizing:border-box;">' +
        '<input type="tel" class="partner-phone-input" data-sport="' + escapeHtml(sportValue) + '" placeholder="Partner phone (10 digits)" maxlength="10" pattern="[0-9]{10}" style="width:100%; padding:8px; box-sizing:border-box;">';
      partnerFieldsContainer.appendChild(block);
    });
  }

  sportCheckboxes.forEach(cb => cb.addEventListener('change', updatePartnerSection));
  updatePartnerSection();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Single combined Student Portal submit
function submitStudentPortal(event) {
  event.preventDefault();

  const msgDiv = document.getElementById('portalMsg');
  const fullName = document.getElementById('fullName').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const department = document.getElementById('department').value;
  const year = document.getElementById('year').value;

  if (!fullName) {
    msgDiv.className = 'message error';
    msgDiv.innerHTML = ' Please enter your full name.';
    return false;
  }

  if (phone.length !== 10) {
    msgDiv.className = 'message error';
    msgDiv.innerHTML = ' Please enter a valid 10-digit phone number.';
    return false;
  }

  const checkedSports = Array.from(document.querySelectorAll('input[name="sport"]:checked')).map(cb => cb.value);
  if (checkedSports.length === 0) {
    msgDiv.className = 'message error';
    msgDiv.innerHTML = ' Please select at least one sport.';
    return false;
  }

  const hasDoubles = checkedSports.some(s => s.indexOf('Doubles') !== -1);
  const doublesSports = checkedSports.filter(s => s.indexOf('Doubles') !== -1);
  let partnerDetailsList = [];

  if (hasDoubles) {
    const nameInputs = document.querySelectorAll('.partner-name-input');
    const phoneInputs = document.querySelectorAll('.partner-phone-input');
    for (let i = 0; i < doublesSports.length; i++) {
      const sport = doublesSports[i];
      const nameInput = Array.from(nameInputs).find(el => el.getAttribute('data-sport') === sport);
      const phoneInput = Array.from(phoneInputs).find(el => el.getAttribute('data-sport') === sport);
      const partnerName = nameInput ? nameInput.value.trim() : '';
      const partnerPhone = phoneInput ? phoneInput.value.trim() : '';
      if (!partnerName || !partnerPhone) {
        msgDiv.className = 'message error';
        msgDiv.innerHTML = ' Please fill in partner name and phone for: ' + sport + '.';
        return false;
      }
      if (partnerPhone.length !== 10) {
        msgDiv.className = 'message error';
        msgDiv.innerHTML = ' Please enter a valid 10-digit partner phone for: ' + sport + '.';
        return false;
      }
      partnerDetailsList.push({ sport, partnerName, partnerPhone });
    }
  }

  const payload = {
    fullName,
    phone,
    department,
    year,
    sports: checkedSports.join(', ')
  };
  if (hasDoubles) {
    // Your Google Apps Script (doPost) and spreadsheet columns expect:
    // partnerName (Column G), partnerDepartment (Column H), partnerPhone (Column I).
    // Frontend collects partnerName + partnerPhone per doubles sport, so we
    // aggregate them into single string values for those 3 columns.
    payload.partnerDepartment = department; // partner department is not separately collected in the form
    payload.partnerName = partnerDetailsList.map(p => p.partnerName).join(', ');
    payload.partnerPhone = partnerDetailsList.map(p => p.partnerPhone).join(', ');

    // Keep detailed info as well (useful for debugging / future enhancements).
    payload.partnerDetails = JSON.stringify(partnerDetailsList);
  }

  if (typeof GOOGLE_SCRIPT_URL === 'string' && GOOGLE_SCRIPT_URL.startsWith('http')) {
    try {
      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => console.error('Error sending to Google Sheets:', err));
    } catch (err) {
      console.error('Error initializing request:', err);
    }
  } else {
    console.warn('GOOGLE_SCRIPT_URL is not configured.');
  }

  msgDiv.className = 'message success';
  msgDiv.innerHTML = ' Registration submitted successfully! Your details have been saved.';

  setTimeout(() => {
    event.target.reset();
    document.getElementById('partnerSection').style.display = 'none';
    msgDiv.innerHTML = '';
    initPartnerSectionToggle();
  }, 4000);

  return false;
}

// Handle window resize
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    if (hamburger && navMenu) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('show');
    }
  }
});
