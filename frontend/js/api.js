// ============================================
//  api.js - API base URL and fetch helper
// ============================================

const API = 'http://localhost:3000/api';

// Makes a fetch request to the API
// Automatically adds the Authorization header if a token exists
async function apiFetch(path, method, body) {
  var options = {
    method: method || 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // Add token if logged in
  if (token) {
    options.headers['Authorization'] = 'Bearer ' + token;
  }

  // Add body for POST/PUT requests
  if (body) {
    options.body = JSON.stringify(body);
  }

  var res  = await fetch(API + path, options);
  var data = await res.json();

  if (!res.ok) {
    var msg = (data.errors && data.errors.join(', ')) || data.message || 'Something went wrong';
    throw new Error(msg);
  }

  return data;
}
