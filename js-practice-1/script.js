// prompt() ile kullanıcıdan isim, yaş ve meslek almalı ve bir nesne
// (object) içinde saklamalı.

// let firstName = prompt("Lütfen isminizi giriniz");
// let age = prompt("Lütfen yaşınızı giriniz");
// let job = prompt("Lütfen mesleğinizi giriniz");

// let person = {
//   Name: firstName,
//   Age: age,
//   Job: job,
// };
// console.log(person);

// Bir dizi (array) kullanarak ürünleri sepete eklemeli ve listelemeli.
// (name, price)

let cart = [];
function addCart(name, price) {
  cart.push({ name: name, price: price });
}
function listCart() {
  const cartList = document.getElementById("cartList");
  const totalPriceSpan = document.getElementById("totalPrice");
  cartList.innerHTML = "";
  cart.forEach(function (item, i) {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ${item.price} TL`;
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "×";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = function () {
      removeFromCart(i);
    };
    li.appendChild(deleteBtn);
    cartList.appendChild(li);
  });
  const totalPrice = cart.reduce(function (total, item) {
    return total + item.price;
  }, 0);
  totalPriceSpan.textContent = totalPrice;
}
function removeFromCart(index) {
  cart.splice(index, 1);
  listCart();
}
function addProductFromInput() {
  let name = document.getElementById("productName").value.trim();
  let price = parseFloat(document.getElementById("productPrice").value);
  if (name && !isNaN(price) && price > 0) {
    addCart(name, price);
    listCart();
    document.getElementById("productName").value = "";
    document.getElementById("productPrice").value = "";
  } else {
    alert("Lütfen geçerli ürün adı ve fiyat giriniz.");
  }
}
document.getElementById("addButton").onclick = addProductFromInput;
listCart();