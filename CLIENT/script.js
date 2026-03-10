// Load order from localStorage on page load
let order = JSON.parse(localStorage.getItem('restaurantOrder')) || [];
let total = parseFloat(localStorage.getItem('restaurantTotal')) || 0;
let isAddingOrder = false; // Flag to prevent duplicate order clicks

// Save to localStorage
function saveOrder() {
    localStorage.setItem('restaurantOrder', JSON.stringify(order));
    localStorage.setItem('restaurantTotal', total.toString());
}

// Save table number to localStorage
function saveTable() {
    const tableInput = document.getElementById("tableNumber");
    const table = tableInput.value;
    const displayElement = document.getElementById("selectedTableDisplay");

    if (!table) {
        alert("Please enter your table number");
        return;
    }

    localStorage.setItem("tableNumber", table);
    
    if (displayElement) {
        displayElement.textContent = "Table " + table + " selected";
    }
    alert("Table " + table + " selected");
}

// Display saved table on page load
function displaySavedTable() {
    const savedTable = localStorage.getItem("tableNumber");
    const displayElement = document.getElementById("selectedTableDisplay");
    const tableInput = document.getElementById("tableNumber");
    
    if (savedTable && displayElement) {
        displayElement.textContent = "Table " + savedTable + " selected";
    }
    if (savedTable && tableInput) {
        tableInput.value = savedTable;
    }
}

function addToOrder(name, price) {
    const table = localStorage.getItem("tableNumber");
    
    if (!table) {
        alert("Please enter your table number first");
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    
    order.push({ name, price });
    total += price;
    saveOrder();
    renderOrder();
}

function renderOrder() {
    const orderList = document.getElementById("orderList");
    const totalElement = document.getElementById("total");

    if (!orderList) return;

    // Reload order from localStorage to ensure we have latest data
    order = JSON.parse(localStorage.getItem('restaurantOrder')) || [];
    total = parseFloat(localStorage.getItem('restaurantTotal')) || 0;

    // Check if cart is empty
    if (order.length === 0) {
        orderList.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-basket"></i>
                <p>Your cart is empty</p>
                <span>Add some delicious items from our menu!</span>
            </div>
        `;
        if (totalElement) totalElement.textContent = "0";
        updateCartCount();
        return;
    }

    orderList.innerHTML = "";

    order.forEach((item, index) => {
        const li = document.createElement("li");
        
        const itemInfo = document.createElement("div");
        itemInfo.className = "order-item-info";
        
        const itemName = document.createElement("span");
        itemName.className = "order-item-name";
        itemName.textContent = item.name;
        
        const itemPrice = document.createElement("span");
        itemPrice.className = "order-item-price";
        itemPrice.textContent = "$" + item.price;
        
        itemInfo.appendChild(itemName);
        itemInfo.appendChild(itemPrice);
        
        const removeBtn = document.createElement("button");
        removeBtn.className = "remove-btn";
        removeBtn.textContent = "Remove";
        removeBtn.onclick = () => removeItem(index);
        
        li.appendChild(itemInfo);
        li.appendChild(removeBtn);
        orderList.appendChild(li);
    });

    if (totalElement) totalElement.textContent = total;
    updateCartCount();
}

function removeItem(index) {
    total -= order[index].price;
    order.splice(index, 1);
    saveOrder();
    renderOrder();
}

// Get server URL - works for both desktop and mobile
function getServerUrl() {
    // Check if we're on mobile (different origin)
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        // On mobile, try to connect to the server via the current host
        return window.location.protocol + '//' + window.location.hostname + ':5000';
    }
    return "http://localhost:5000";
}

// Global flag to prevent duplicate order submissions
let isSubmitting = false;

async function submitOrder() {
    if (order.length === 0) {
        alert("Your cart is empty! Please add items first.");
        return;
    }

    // Prevent duplicate submissions
    if (isSubmitting) {
        return;
    }
    isSubmitting = true;

    // Disable checkout button visually
    const checkoutBtn = document.querySelector('.btn-checkout');
    if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = 'Processing...';
    }

    const table = localStorage.getItem("tableNumber");

    try {
        const serverUrl = getServerUrl();
        const response = await fetch(serverUrl + "/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                tableNumber: table,
                items: order, 
                total 
            })
        });

        if (response.ok) {
            // Clear the order and update UI
            order = [];
            total = 0;
            saveOrder();
            renderOrder();
            
            // Show success message
            alert("Order submitted successfully! Thank you for your order.");
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            alert("Failed to submit order. Please try again.");
        }
    } catch (error) {
        console.error("Order submission error:", error);
        alert("Unable to connect to server. Please make sure you're connected to the same network as the server.");
    } finally {
        // Re-enable the button
        isSubmitting = false;
        if (checkoutBtn) {
            checkoutBtn.disabled = false;
            checkoutBtn.innerHTML = '<i class="fas fa-credit-card"></i> Checkout';
        }
    }
}

function updateCartCount() {
    const cartCountEl = document.getElementById("cartCount");
    if (cartCountEl) {
        cartCountEl.textContent = order.length;
    }
}

// Initialize on page load
function initCart() {
    renderOrder();
}

// Handle page show event (for back-forward cache)
window.addEventListener('pageshow', function(event) {
    // Force reload from localStorage when page is shown
    renderOrder();
});

// Handle storage changes (when localStorage is updated in another tab/page)
window.addEventListener('storage', function(e) {
    if (e.key === 'restaurantOrder' || e.key === 'restaurantTotal') {
        renderOrder();
    }
});

// Also check for visibility changes (when user returns to tab)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        renderOrder();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initCart();
    displaySavedTable();
});
