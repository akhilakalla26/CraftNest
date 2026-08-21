// Get cart from localStorage
let cart = JSON.parse(localStorage.getItem("craftNestCart")) || [];

const cartItems = document.getElementById("cart-items");
const totalPrice = document.getElementById("total-price");
const cartCount = document.getElementById("cart-count");


// Update cart count on page load
updateCartCount();


// Add to Cart buttons
const buttons = document.querySelectorAll(".add-cart");

buttons.forEach(function(button) {

    button.addEventListener("click", function() {

        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        // Add item
        cart.push({
            name: name,
            price: price
        });

        // Save cart
        saveCart();

        // Update everything
        updateCartCount();
        displayCart();

    });

});


// Save cart in browser
function saveCart() {

    localStorage.setItem(
        "craftNestCart",
        JSON.stringify(cart)
    );

}


// Update cart number
function updateCartCount() {

    if (cartCount) {
        cartCount.textContent = cart.length;
    }

}


// Display cart
function displayCart() {

    if (!cartItems || !totalPrice) {
        return;
    }

    cartItems.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {

        cartItems.innerHTML = "<p>Your cart is empty.</p>";

    } else {

        cart.forEach(function(item, index) {

            total = total + item.price;

            const itemDiv = document.createElement("div");

            itemDiv.classList.add("cart-item");

            itemDiv.innerHTML = `
                <span>
                    ${item.name} - ₹${item.price}
                </span>

                <button 
                    class="remove-btn"
                    onclick="removeItem(${index})">
                    <i class="fa-solid fa-trash"></i> Remove
                </button>
            `;

            cartItems.appendChild(itemDiv);

        });

    }

    totalPrice.textContent = total;

}


// Remove item
function removeItem(index) {

    cart.splice(index, 1);

    saveCart();

    updateCartCount();
    displayCart();

}


// Display cart when page loads
displayCart();