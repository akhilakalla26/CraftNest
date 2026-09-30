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

        
        cart.push({
            name: name,
            price: price
        });

        
        saveCart();

       
        updateCartCount();
        displayCart();

    });

});



function saveCart() {

    localStorage.setItem(
        "craftNestCart",
        JSON.stringify(cart)
    );

}



function updateCartCount() {

    if (cartCount) {
        cartCount.textContent = cart.length;
    }

}



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



function removeItem(index) {

    cart.splice(index, 1);

    saveCart();

    updateCartCount();
    displayCart();

}



displayCart();



function showPopup(title, message) {
    document.getElementById("popup-title").textContent = title;
    document.getElementById("popup-message").textContent = message;
    document.getElementById("custom-popup").style.display = "flex";
}

function closePopup() {
    document.getElementById("custom-popup").style.display = "none";
}

// Updated Function to send cart items to the MySQL database
function checkoutCart() {
    if (cart.length === 0) {
        showPopup("Cart Empty", "Your cart is empty! Please add items before checking out.");
        return;
    }

    // Send the cart data to our running Node.js server
    fetch('http://localhost:3000/api/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cart: cart })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
       
            showPopup(" Your order has been placed!");
          
            
            // Clear out the UI and localStorage cart once saved to database
            cart = [];
            saveCart();
            updateCartCount();
            displayCart();
        } else {
            showPopup("Error", data.error);
        }
    })
    .catch(error => {
        console.error('Connection Error:', error);
        showPopup("Connection Error", "Could not connect to the backend server. Make sure it is running.");
    });
}
