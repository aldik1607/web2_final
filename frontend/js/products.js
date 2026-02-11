// ============================================
//  products.js - menu page: load, filter, render
// ============================================

var allProducts   = [];
var currentFilter = 'all';

async function loadProducts() {
  document.getElementById('productsGrid').innerHTML = '<p>Loading...</p>';

  try {
    var data    = await apiFetch('/products');
    allProducts = data.products || [];
    renderProducts();
  } catch (err) {
    document.getElementById('productsGrid').innerHTML =
      '<p style="color:red">Could not load products. Is the server running?</p>';
  }
}

function filterBy(cat, btn) {
  currentFilter = cat;

  // update active button
  document.querySelectorAll('.filter-buttons button').forEach(function(b) {
    b.classList.remove('active');
  });
  btn.classList.add('active');

  renderProducts();
}

function renderProducts() {
  var list = currentFilter === 'all'
    ? allProducts
    : allProducts.filter(function(p) { return p.category === currentFilter; });

  if (!list.length) {
    document.getElementById('productsGrid').innerHTML = '<p>No products found.</p>';
    return;
  }

  var isAdmin = currentUser && currentUser.role === 'admin';
  var html    = '';

  for (var i = 0; i < list.length; i++) {
    var p = list[i];

    var adminBtns = '';
    if (isAdmin) {
      adminBtns =
        '<div class="admin-btns">' +
          '<button class="btn-edit" onclick="openModal(\'' + p._id + '\')">Edit</button>' +
          '<button class="btn-delete" onclick="deleteProduct(\'' + p._id + '\')">Delete</button>' +
        '</div>';
    }

    html +=
      '<div class="product-card">' +
        '<h3>' + p.name + '</h3>' +
        '<div class="category">' + p.category + '</div>' +
        '<div class="desc">' + p.description + '</div>' +
        '<div class="price">$' + Number(p.price).toFixed(2) + '</div>' +
        adminBtns +
      '</div>';
  }

  document.getElementById('productsGrid').innerHTML = html;
}
