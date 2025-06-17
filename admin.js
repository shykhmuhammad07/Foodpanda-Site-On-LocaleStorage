const getName = document.querySelector("#getName");
const geturl = document.querySelector("#geturl");
const getdesc = document.querySelector("#getdesc");
const getprice = document.querySelector("#getprice");
const dov = document.querySelector("#dov");
const productForm = document.querySelector("#productForm");

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.userType !== "admin") {
  window.location.href = "login.html";
} else {
  document.getElementById("user").textContent = currentUser.name.toUpperCase();
}

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
});

productForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addProduct();
});

function addProduct() {
  const products = JSON.parse(localStorage.getItem("products")) || [];

  const data = {
    id: Date.now(), 
    name: getName.value,
    desc: getdesc.value,
    url: geturl.value,
    price: getprice.value,
  };

  products.push(data);
  localStorage.setItem("products", JSON.stringify(products));
  loadProducts();

  getName.value = "";
  geturl.value = "";
  getdesc.value = "";
  getprice.value = "";
}

function loadProducts() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  dov.innerHTML = "";

  products.forEach((product) => {
    dov.innerHTML += `
      <div class="card" data-id="${product.id}">
        <img src="${product.url}" class="card-img-top" alt="${product.name}">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-desc">${product.desc}</p>
          <p class="card-price">Rs. ${product.price}</p>
          <div class="card-buttons">
            <button onclick="deleteProduct(${product.id})" class="btn-delete">Delete</button>
            <button onclick="editProduct(${product.id})" class="btn-edit">Edit</button>
          </div>
        </div>
      </div>
    `;
  });
}

function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  let products = JSON.parse(localStorage.getItem("products")) || [];
  products = products.filter((product) => product.id !== id);
  localStorage.setItem("products", JSON.stringify(products));
  loadProducts();
}

function editProduct(id) {
  let products = JSON.parse(localStorage.getItem("products")) || [];
  let index = products.findIndex((product) => product.id === id);

  if (index !== -1) {
    const product = products[index];

    let newName = prompt("Enter new item name:", product.name);
    let newUrl = prompt("Enter new image URL:", product.url);
    let newDesc = prompt("Enter new description:", product.desc);
    let newPrice = prompt("Enter new price:", product.price);

    if (newName) product.name = newName;
    if (newUrl) product.url = newUrl;
    if (newDesc) product.desc = newDesc;
    if (newPrice) product.price = newPrice;

    products[index] = product;
    localStorage.setItem("products", JSON.stringify(products));
    loadProducts();
  } else {
    alert("Product not found!");
  }
}
