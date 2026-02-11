// ============================================
//  profile.js - view and edit user profile
// ============================================

async function fetchProfile() {
  if (!token) {
    showPage('login');
    return;
  }

  try {
    var data    = await apiFetch('/users/profile');
    currentUser = data.user;
    localStorage.setItem('user', JSON.stringify(currentUser));
    fillProfilePage();
  } catch (err) {
    showToast('Could not load profile');
  }
}

function fillProfilePage() {
  if (!currentUser) return;

  document.getElementById('pUsername').textContent = currentUser.username;
  document.getElementById('pEmail').textContent    = currentUser.email;
  document.getElementById('pRole').textContent     = currentUser.role;
  document.getElementById('editUsername').value    = currentUser.username;
  document.getElementById('editEmail').value       = currentUser.email;
}

async function updateProfile(e) {
  e.preventDefault();
  document.getElementById('profileMsg').textContent = '';

  var username = document.getElementById('editUsername').value;
  var email    = document.getElementById('editEmail').value;

  try {
    var data    = await apiFetch('/users/profile', 'PUT', { username: username, email: email });
    currentUser = data.user;
    localStorage.setItem('user', JSON.stringify(currentUser));

    updateNavbar();
    fillProfilePage();
    document.getElementById('profileMsg').textContent = 'Profile updated!';

    // Clear the message after 3 seconds
    setTimeout(function() {
      document.getElementById('profileMsg').textContent = '';
    }, 3000);
  } catch (err) {
    showToast('Error: ' + err.message);
  }
}
