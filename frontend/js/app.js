// ============================================
//  app.js - global state, routing, navbar, toast
// ============================================

// Global state - used by all other JS files
var token       = localStorage.getItem('token') || null;
var currentUser = JSON.parse(localStorage.getItem('user') || 'null');

// ── PAGE ROUTING ──────────────────────────────

function showPage(name) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(function(p) {
    p.classList.remove('active');
  });

  // Show the requested page
  document.getElementById('page-' + name).classList.add('active');

  // Run page-specific logic
  if (name === 'products') loadProducts();
  if (name === 'admin')    loadAdminProducts();
  if (name === 'profile')  fetchProfile();
}

// ── NAVBAR ────────────────────────────────────

function updateNavbar() {
  var loggedIn = !!token;

  document.getElementById('loginNavBtn').style.display    = loggedIn ? 'none' : '';
  document.getElementById('registerNavBtn').style.display = loggedIn ? 'none' : '';
  document.getElementById('logoutNavBtn').style.display   = loggedIn ? '' : 'none';
  document.getElementById('profileNavBtn').style.display  = loggedIn ? '' : 'none';

  var isAdmin = loggedIn && currentUser && currentUser.role === 'admin';
  document.getElementById('adminNavBtn').style.display = isAdmin ? '' : 'none';

  document.getElementById('userInfo').textContent = currentUser
    ? 'Hi, ' + currentUser.username + ' (' + currentUser.role + ')'
    : '';
}

// ── TOAST ─────────────────────────────────────

function showToast(message) {
  var el = document.getElementById('toast');
  el.textContent  = message;
  el.style.display = 'block';

  setTimeout(function() {
    el.style.display = 'none';
  }, 2500);
}

// ── INIT ──────────────────────────────────────

updateNavbar();
loadProducts();
if (currentUser) fillProfilePage();
