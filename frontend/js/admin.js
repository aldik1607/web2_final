// ============================================
//  admin.js - admin table, product modal, delete
// ============================================

async function loadAdminProducts() {
  document.getElementById('adminTableBody').innerHTML =
    '<tr><td colspan="4">Loading...</td></tr>';

  try {
    var data    = await apiFetch('/products');
    allProducts = data.products || [];
    renderAdminTable();
  } catch (err) {
    document.getElementById('adminTableBody').innerHTML =
      '<tr><td colspan="4" style="color:red">Failed to load products</td></tr>';
  }
}

function renderAdminTable() {
  if (!allProducts.length) {
    document.getElementById('adminTableBody').innerHTML =
      '<tr><td colspan="4">No products yet.</td></tr>';
    return;
  }

  var canDelete = currentUser && currentUser.role === 'admin';
  var html = '';
  for (var i = 0; i < allProducts.length; i++) {
    var p = allProducts[i];
    var deleteBtn = canDelete
      ? (' <button class="btn-delete" onclick="deleteProduct(\'' + p._id + '\')">Delete</button>')
      : '';
    html +=
      '<tr>' +
        '<td>' + p.name + '</td>' +
        '<td>' + p.category + '</td>' +
        '<td>$' + Number(p.price).toFixed(2) + '</td>' +
        '<td>' +
          '<button class="btn-edit" onclick="openModal(\'' + p._id + '\')">Edit</button>' +
          deleteBtn +
        '</td>' +
      '</tr>';
  }
  document.getElementById('adminTableBody').innerHTML = html;
}

// ── MODAL ─────────────────────────────────────

function openModal(id) {
  document.getElementById('modalError').textContent = '';

  if (id) {
    // Edit existing product
    var p = null;
    for (var i = 0; i < allProducts.length; i++) {
      if (allProducts[i]._id === id) { p = allProducts[i]; break; }
    }
    if (!p) return;

    document.getElementById('modalTitle').textContent = 'Edit Product';
    document.getElementById('editId').value    = p._id;
    document.getElementById('mName').value     = p.name;
    document.getElementById('mDesc').value     = p.description;
    document.getElementById('mPrice').value    = p.price;
    document.getElementById('mCategory').value = p.category;
  } else {
    // Add new product
    document.getElementById('modalTitle').textContent = 'Add Product';
    document.getElementById('editId').value    = '';
    document.getElementById('mName').value     = '';
    document.getElementById('mDesc').value     = '';
    document.getElementById('mPrice').value    = '';
    document.getElementById('mCategory').value = 'coffee';
  }

  document.getElementById('productModal').classList.add('open');
}

function closeModal() {
  document.getElementById('productModal').classList.remove('open');
}

async function saveProduct(e) {
  e.preventDefault();
  document.getElementById('modalError').textContent = '';

  var id = document.getElementById('editId').value;

  var body = {
    name:        document.getElementById('mName').value,
    description: document.getElementById('mDesc').value,
    price:       parseFloat(document.getElementById('mPrice').value),
    category:    document.getElementById('mCategory').value
  };

  try {
    if (id) {
      await apiFetch('/products/' + id, 'PUT', body);
      showToast('Product updated');
    } else {
      await apiFetch('/products', 'POST', body);
      showToast('Product created');
    }
    closeModal();
    loadAdminProducts();
  } catch (err) {
    document.getElementById('modalError').textContent = err.message;
  }
}

async function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;

  try {
    await apiFetch('/products/' + id, 'DELETE');
    showToast('Product deleted');
    // Refresh whichever view is currently visible
    if (document.getElementById('page-admin').classList.contains('active')) {
      loadAdminProducts();
    } else {
      loadProducts();
    }
  } catch (err) {
    showToast('Error: ' + err.message);
  }
}

// Close modal when clicking outside of it
document.getElementById('productModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
