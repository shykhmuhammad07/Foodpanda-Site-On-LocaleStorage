document.addEventListener("DOMContentLoaded", function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser || currentUser.userType !== "customer") {
    window.location.href = "login.html";
  } else {
    document.getElementById("users").innerHTML = `<i class="fas fa-user-circle"></i> ${currentUser.name.toUpperCase()}`;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const adminItems = JSON.parse(localStorage.getItem("products")) || [];
  const menuContainer = document.getElementById("menuContainer");

  adminItems.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${item.url}" alt="" class="card-img">
      <div class="card-body">
        <h5 class="card-title">${item.name}</h5>
        <p class="card-text">${item.desc}</p>
        <div class="price-tag">
          <div class="price">${item.price}</div>
        </div>
        <a href="#" class="btn add-to-cart" data-id="${9 + index}" data-name="${item.name}" data-price="${item.price}">
          <i class="fas fa-shopping-cart"></i> ADD TO CART
        </a>
      </div>`;
    menuContainer.appendChild(div);
  });

  const cartButton = document.getElementById("cartButton");
  const cartModal = document.getElementById("cartModal");
  const closeCart = document.getElementById("closeCart");
  const cartCount = document.getElementById("cartCount");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const toast = document.getElementById("toast");
  const orderConfirmation = document.getElementById("orderConfirmation");
  const orderItems = document.getElementById("orderItems");
  const orderTotal = document.getElementById("orderTotal");
  const closeConfirmation = document.getElementById("closeConfirmation");

  cartButton.addEventListener("click", () => (cartModal.style.display = "flex"));
  closeCart.addEventListener("click", () => (cartModal.style.display = "none"));

  window.addEventListener("click", function (event) {
    if (event.target === cartModal) cartModal.style.display = "none";
    if (event.target === orderConfirmation) orderConfirmation.style.display = "none";
  });

  document.body.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("add-to-cart") ||
      e.target.closest(".add-to-cart")
    ) {
      e.preventDefault();
      const button = e.target.closest(".add-to-cart");
      const id = button.dataset.id;
      const name = button.dataset.name;
      const price = parseInt(button.dataset.price);
      const image = button.closest(".card").querySelector(".card-img").src;

      const existingItem = cart.find((item) => item.id === id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ id, name, price, image, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartUI(cart);
      showToast(`${name} added to cart!`);

      button.innerHTML = '<i class="fas fa-check"></i> ADDED!';
      button.style.background = "linear-gradient(to right, #4CAF50, #2E7D32)";
      setTimeout(() => {
        button.innerHTML = '<i class="fas fa-shopping-cart"></i> ADD TO CART';
        button.style.background = "linear-gradient(to right, #ff2b85, #d70f64)";
      }, 1500);
    }
  });

  function updateCartUI(cartData) {
    const totalItems = cartData.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;

    if (cartData.length === 0) {
      cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
      cartTotal.textContent = "0";
      return;
    }

    cartItems.innerHTML = "";
    let totalPrice = 0;

    cartData.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;

      const cartItemElement = document.createElement("div");
      cartItemElement.className = "cart-item";
      cartItemElement.innerHTML = `
        <div class="item-info">
          <img src="${item.image}" alt="${item.name}">
          <div>
            <div class="item-name">${item.name}</div>
            <div class="item-price">Rs ${item.price}</div>
          </div>
        </div>
        <div class="item-quantity">
          <button class="quantity-btn decrease" data-id="${item.id}">-</button>
          <div class="quantity">${item.quantity}</div>
          <button class="quantity-btn increase" data-id="${item.id}">+</button>
        </div>
        <div class="item-total">Rs ${itemTotal}</div>`;
      cartItems.appendChild(cartItemElement);
    });

    document.querySelectorAll(".decrease").forEach((button) => {
      button.addEventListener("click", function () {
        const id = this.dataset.id;
        const index = cart.findIndex((item) => item.id === id);
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
        } else {
          cart.splice(index, 1);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartUI(cart);
      });
    });

    document.querySelectorAll(".increase").forEach((button) => {
      button.addEventListener("click", function () {
        const id = this.dataset.id;
        const item = cart.find((item) => item.id === id);
        item.quantity += 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartUI(cart);
      });
    });

    cartTotal.textContent = totalPrice;
  }

  checkoutBtn.addEventListener("click", function () {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push({
      id: Date.now(),
      date: new Date().toLocaleString(),
      items: cart,
      total: total,
    });
    localStorage.setItem("orders", JSON.stringify(orders));
    showOrderConfirmation(cart, total);

    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI(cart);
    cartModal.style.display = "none";
  });

  function showOrderConfirmation(items, total) {
    orderItems.innerHTML = "";
    items.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.className = "order-item";
      itemElement.innerHTML = `
        <span>${item.name} x ${item.quantity}</span>
        <span>Rs ${item.price * item.quantity}</span>`;
      orderItems.appendChild(itemElement);
    });

    orderTotal.textContent = total;
    orderConfirmation.style.display = "flex";
  }

  closeConfirmation.addEventListener("click", function () {
    orderConfirmation.style.display = "none";
  });

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  updateCartUI(cart);
});
