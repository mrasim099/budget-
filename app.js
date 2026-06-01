 let budget = 0;
  let expenses = [];
  let editIndex = null;

  function setBudget() {
    const val = parseFloat(document.getElementById('budgetInput').value);
    if (isNaN(val) || val < 0) { showToast('Enter a valid budget amount'); return; }
    budget = val;
    document.getElementById('budgetInput').value = '';
    updateSummary();
    showToast('Budget set to ' + budget);
  }

  function addExpense() {
    const title = document.getElementById('expTitle').value.trim();
    const cost  = parseFloat(document.getElementById('expCost').value);
    if (!title)           { showToast('Please enter a product title'); return; }
    if (isNaN(cost) || cost <= 0) { showToast('Please enter a valid cost'); return; }
    expenses.push({ title, cost });
    document.getElementById('expTitle').value = '';
    document.getElementById('expCost').value  = '';
    renderList();
    updateSummary();
    showToast('"' + title + '" added');
  }

  function deleteExpense(i) {
    expenses.splice(i, 1);
    renderList();
    updateSummary();
    showToast('Expense removed');
  }

  function openEdit(i) {
    editIndex = i;
    document.getElementById('editTitle').value = expenses[i].title;
    document.getElementById('editCost').value  = expenses[i].cost;
    document.getElementById('editModal').classList.add('active');
  }

  function closeModal() {
    document.getElementById('editModal').classList.remove('active');
    editIndex = null;
  }

  function saveEdit() {
    const title = document.getElementById('editTitle').value.trim();
    const cost  = parseFloat(document.getElementById('editCost').value);
    if (!title)           { showToast('Title cannot be empty'); return; }
    if (isNaN(cost) || cost <= 0) { showToast('Enter a valid cost'); return; }
    expenses[editIndex] = { title, cost };
    closeModal();
    renderList();
    updateSummary();
    showToast('Expense updated');
  }

  function updateSummary() {
    const total = expenses.reduce((s, e) => s + e.cost, 0);
    const bal   = budget - total;
    document.getElementById('totalBudget').textContent   = budget.toLocaleString();
    document.getElementById('totalExpenses').textContent = total.toLocaleString();
    const balEl = document.getElementById('balance');
    balEl.textContent = bal.toLocaleString();
    balEl.className = bal < 0 ? 'negative' : '';
  }

  function renderList() {
    const list = document.getElementById('expenseList');
    if (expenses.length === 0) {
      list.innerHTML = '<p class="empty-msg">No expenses added yet.</p>';
      return;
    }
    list.innerHTML = expenses.map((e, i) => `
      <div class="expense-item">
        <div class="item-bar"></div>
        <div class="item-name">${escHtml(e.title)}</div>
        <div class="item-cost">${e.cost.toLocaleString()}</div>
        <div class="item-actions">
          <button class="btn-icon edit" title="Edit" onclick="openEdit(${i})">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="btn-icon delete" title="Delete" onclick="deleteExpense(${i})">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>
      </div>
    `).join('');
  }

  function escHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  let toastTimer;
  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
  }

  // Close modal on overlay click
  document.getElementById('editModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });