// Global state
let groceries = [];
let currentFilter = 'all';

// API Base URL
const API_URL = '/api/groceries';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadGroceries();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Add grocery form
    document.getElementById('groceryForm').addEventListener('submit', addGrocery);
    
    // Edit grocery form
    document.getElementById('editForm').addEventListener('submit', updateGrocery);
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderGroceries();
        });
    });
    
    // Modal close button
    document.querySelector('.close').addEventListener('click', closeEditModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('editModal');
        if (e.target === modal) {
            closeEditModal();
        }
    });
}

// Load all groceries from API
async function loadGroceries() {
    try {
        const response = await fetch(API_URL);
        groceries = await response.json();
        renderGroceries();
    } catch (error) {
        console.error('Error loading groceries:', error);
        alert('Failed to load groceries');
    }
}

// Add new grocery
async function addGrocery(e) {
    e.preventDefault();
    
    const name = document.getElementById('itemName').value.trim();
    const quantity = parseInt(document.getElementById('itemQuantity').value);
    const category = document.getElementById('itemCategory').value;
    
    if (!name) {
        alert('Please enter an item name');
        return;
    }
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                quantity,
                category,
                purchased: false
            })
        });
        
        if (response.ok) {
            const newGrocery = await response.json();
            groceries.push(newGrocery);
            renderGroceries();
            
            // Reset form
            document.getElementById('groceryForm').reset();
            document.getElementById('itemQuantity').value = 1;
        } else {
            throw new Error('Failed to add grocery');
        }
    } catch (error) {
        console.error('Error adding grocery:', error);
        alert('Failed to add grocery item');
    }
}

// Toggle purchased status
async function togglePurchased(id) {
    const grocery = groceries.find(g => g.id === id);
    if (!grocery) return;
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...grocery,
                purchased: !grocery.purchased
            })
        });
        
        if (response.ok) {
            const updated = await response.json();
            const index = groceries.findIndex(g => g.id === id);
            groceries[index] = updated;
            renderGroceries();
        }
    } catch (error) {
        console.error('Error toggling purchased status:', error);
        alert('Failed to update item');
    }
}

// Open edit modal
function openEditModal(id) {
    const grocery = groceries.find(g => g.id === id);
    if (!grocery) return;
    
    document.getElementById('editId').value = grocery.id;
    document.getElementById('editName').value = grocery.name;
    document.getElementById('editQuantity').value = grocery.quantity;
    document.getElementById('editCategory').value = grocery.category;
    
    document.getElementById('editModal').classList.add('show');
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').classList.remove('show');
    document.getElementById('editForm').reset();
}

// Update grocery
async function updateGrocery(e) {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('editId').value);
    const name = document.getElementById('editName').value.trim();
    const quantity = parseInt(document.getElementById('editQuantity').value);
    const category = document.getElementById('editCategory').value;
    
    const grocery = groceries.find(g => g.id === id);
    if (!grocery) return;
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                quantity,
                category,
                purchased: grocery.purchased
            })
        });
        
        if (response.ok) {
            const updated = await response.json();
            const index = groceries.findIndex(g => g.id === id);
            groceries[index] = updated;
            renderGroceries();
            closeEditModal();
        }
    } catch (error) {
        console.error('Error updating grocery:', error);
        alert('Failed to update item');
    }
}

// Delete grocery
async function deleteGrocery(id) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            groceries = groceries.filter(g => g.id !== id);
            renderGroceries();
        }
    } catch (error) {
        console.error('Error deleting grocery:', error);
        alert('Failed to delete item');
    }
}

// Render groceries based on current filter
function renderGroceries() {
    const container = document.getElementById('groceryItems');
    const emptyState = document.getElementById('emptyState');
    
    let filteredGroceries = groceries;
    
    if (currentFilter === 'active') {
        filteredGroceries = groceries.filter(g => !g.purchased);
    } else if (currentFilter === 'purchased') {
        filteredGroceries = groceries.filter(g => g.purchased);
    }
    
    if (filteredGroceries.length === 0) {
        container.innerHTML = '';
        emptyState.classList.add('show');
        return;
    }
    
    emptyState.classList.remove('show');
    
    container.innerHTML = filteredGroceries.map(grocery => `
        <div class="grocery-item ${grocery.purchased ? 'purchased' : ''}">
            <div class="item-left">
                <input 
                    type="checkbox" 
                    class="checkbox" 
                    ${grocery.purchased ? 'checked' : ''}
                    onchange="togglePurchased(${grocery.id})"
                >
                <div class="item-info">
                    <h3>${escapeHtml(grocery.name)}</h3>
                    <div class="item-details">
                        <span>Qty: ${grocery.quantity}</span>
                        <span class="category-badge">${escapeHtml(grocery.category)}</span>
                    </div>
                </div>
            </div>
            <div class="item-actions">
                <button class="btn btn-edit" onclick="openEditModal(${grocery.id})">Edit</button>
                <button class="btn btn-delete" onclick="deleteGrocery(${grocery.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
