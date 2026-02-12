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

  var loggedIn = !!currentUser;
  var canEdit = loggedIn && ['admin', 'moderator'].includes(currentUser.role);
  var canDelete = loggedIn && currentUser.role === 'admin';
  var isPremium = loggedIn && currentUser.role === 'premium';
  var html    = '';

  for (var i = 0; i < list.length; i++) {
    var p = list[i];

    var actionBtns = '';
    if (canEdit) {
      actionBtns += '<button class="btn-edit" onclick="openModal(\'' + p._id + '\')">Edit</button>';
    }
    if (canDelete) {
      actionBtns += '<button class="btn-delete" onclick="deleteProduct(\'' + p._id + '\')">Delete</button>';
    }
    if (loggedIn) {
      actionBtns += '<button class="btn-save" onclick="placeOrder(\'' + p._id + '\')">Order</button>';
    }
    if (actionBtns) {
      actionBtns = '<div class="admin-btns">' + actionBtns + '</div>';
    }

    var priceHtml = '$' + Number(p.price).toFixed(2);
    if (isPremium) {
      var discounted = Number(p.price) * 0.9;
      priceHtml =
        '<span style="text-decoration:line-through;color:#888;">$' + Number(p.price).toFixed(2) + '</span> ' +
        '<span style="color:#2e7d32;font-weight:bold;">$' + discounted.toFixed(2) + ' (Premium -10%)</span>';
    }

    html +=
      '<div class="product-card">' +
        '<h3>' + p.name + '</h3>' +
        '<div class="category">' + p.category + '</div>' +
        '<div class="desc">' + p.description + '</div>' +
        '<div class="price">' + priceHtml + '</div>' +
        actionBtns +
      '</div>';
  }

  document.getElementById('productsGrid').innerHTML = html;
}

async function placeOrder(productId) {
  if (!token) {
    showToast('Please login to place orders');
    showPage('login');
    return;
  }

  try {
    var data = await apiFetch('/orders', 'POST', {
      items: [{ productId: productId, quantity: 1 }]
    });

    var order = data.order;
    var discountMsg = order.discountAmount > 0
      ? (' (Discount -$' + Number(order.discountAmount).toFixed(2) + ')')
      : '';
    showToast('Order placed! Total: $' + Number(order.total).toFixed(2) + discountMsg);
  } catch (err) {
    showToast('Order failed: ' + err.message);
  }
}
