// ============================================
//  auth.js - login, register, logout
// ============================================

async function doLogin(e) {
  e.preventDefault();
  document.getElementById('loginError').textContent = '';

  var email    = document.getElementById('loginEmail').value;
  var password = document.getElementById('loginPassword').value;

  try {
    var data = await apiFetch('/auth/login', 'POST', { email: email, password: password });

    token       = data.token;
    currentUser = data.user;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(currentUser));

    updateNavbar();
    showToast('Logged in as ' + currentUser.username);
    showPage('products');
  } catch (err) {
    document.getElementById('loginError').textContent = err.message;
  }
}

async function doRegister(e) {
  e.preventDefault();
  document.getElementById('registerError').textContent = '';

  var username = document.getElementById('regUsername').value;
  var email    = document.getElementById('regEmail').value;
  var password = document.getElementById('regPassword').value;

  try {
    var data = await apiFetch('/auth/register', 'POST', { username: username, email: email, password: password });

    token       = data.token;
    currentUser = data.user;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(currentUser));

    updateNavbar();
    showToast('Account created!');
    showPage('products');
  } catch (err) {
    document.getElementById('registerError').textContent = err.message;
  }
}

function logout() {
  token       = null;
  currentUser = null;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  updateNavbar();
  showToast('Logged out');
  showPage('products');
}

// Fill login form from test accounts section
function fillLogin(email, pass) {
  document.getElementById('loginEmail').value    = email;
  document.getElementById('loginPassword').value = pass;
}
