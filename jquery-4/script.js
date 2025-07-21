(async function () {
  // === Adding Library ===
  const addScript = (src) =>
    new Promise((res) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = res;
      document.head.appendChild(s);
    });
  const addCSS = (href) => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    document.head.appendChild(l);
  };

  if (!window.jQuery)
    await addScript("https://code.jquery.com/jquery-3.6.0.min.js");
  await addScript(
    "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"
  );
  await addScript(
    "https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.3/js/lightbox.min.js"
  );
  await addScript("https://code.jquery.com/ui/1.13.2/jquery-ui.min.js");

  addCSS("https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css");
  addCSS(
    "https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.3/css/lightbox.min.css"
  );
  addCSS("https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css");

  // === CSS ===
  const style = document.createElement("style");
  style.textContent = `
    body {
      background: #f0f2f5;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #222;
      margin: 0;
      padding: 20px;
    }
    #product-list, #cart {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      justify-content: center;
    }
    .product, .cart-item {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);
      padding: 16px;
      width: 220px;
      color: #222;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .product:hover, .cart-item:hover {
      transform: translateY(-6px);
      box-shadow: 0 10px 20px rgb(0 0 0 / 0.15);
    }
    img {
      max-width: 100%;
      height: 160px;
      object-fit: contain;
      border-radius: 8px;
      margin-bottom: 12px;
    }
    .btn-group {
      display: flex;
      gap: 12px;
      margin-top: auto;
      width: 100%;
      justify-content: center;
    }
    .btn-group button {
      flex: 1;
      margin: 0;
      padding: 10px 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      box-shadow: 0 4px 8px rgb(102 126 234 / 0.5);
      cursor: pointer;
      transition: background 0.3s ease;
    }
    .btn-group button:hover {
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    }
    #cart-section {
      margin-top: 50px;
      max-width: 1000px;
      margin-left: auto;
      margin-right: auto;
    }
    #clear-cart {
      background: #e55353 !important;
      box-shadow: 0 4px 8px rgb(229 83 83 / 0.5) !important;
      margin-bottom: 16px;
      width: 150px;
      padding: 10px;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.3s ease;
      border: none;
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
    #clear-cart:hover {
      background: #bf3f3f !important;
    }
    .swiper {
      width: 100%;
      margin-bottom: 40px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 20px rgb(0 0 0 / 0.1);
    }
    .swiper-slide {
      background: white;
      border-radius: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    #modal img {
      border-radius: 12px;
      margin-bottom: 16px;
    }
    h2 {
      text-align: center;
      margin-bottom: 24px;
      font-weight: 700;
      color: #444;
}
  `;
  document.head.appendChild(style);

  // === HTML ===
  const container = document.querySelector("#container");
  if (!container) return alert("#container bulunamadı.");

  container.innerHTML = `
    <div class="swiper mySwiper"><div class="swiper-wrapper" id="swiper-slides"></div></div>
    <h2>Ürünler</h2>
    <div id="product-list"></div>
    <div id="cart-section">
      <h2>Sepet</h2>
      <button id="clear-cart">Sepeti Temizle</button>
      <div id="cart"></div>
    </div>
    <div id="modal" title="Ürün Detayı" style="display:none;">
      <img id="modal-img" style="width:100%; max-height:300px; object-fit:contain;" />
      <h3 id="modal-title"></h3>
      <p id="modal-desc"></p>
      <p><strong id="modal-price"></strong></p>
    </div>
  `;

  // === Functions ===
  function getCart() {
    return JSON.parse(localStorage.getItem("sepet")) || [];
  }
  function saveCart(cart) {
    localStorage.setItem("sepet", JSON.stringify(cart));
  }
  function clearCart() {
    localStorage.removeItem("sepet");
    $("#cart").empty().hide().fadeIn();
  }
  function renderCartItem(product) {
    const $item = $(`
      <div class="cart-item">
        <img src="${product.image}" />
        <div><strong>${product.title}</strong></div>
        <div>$${product.price}</div>
      </div>
    `)
      .hide()
      .fadeIn();
    $("#cart").append($item);
  }
  function openProductModal(product) {
    $("#modal-img").attr("src", product.image);
    $("#modal-title").text(product.title);
    $("#modal-desc").text(product.description);
    $("#modal-price").text(`Fiyat: $${product.price}`);
    $("#modal").dialog({ width: 400 });
  }
  function addToCart(product) {
    const cart = getCart();
    if (cart.find((p) => p.id === product.id))
      return alert("Bu ürün sepette zaten var.");
    cart.push(product);
    saveCart(cart);
    renderCartItem(product);
  }

  // === Get products ===
  const products = await $.get("https://fakestoreapi.com/products");

  // Swiper for Top
  products.slice(0, 5).forEach((p) => {
    $("#swiper-slides").append(`
      <div class="swiper-slide">
        <img src="${p.image}" alt="${p.title}" style="height: 200px; object-fit: contain;" />
      </div>
    `);
  });
  new Swiper(".mySwiper", {
    loop: true,
    autoplay: { delay: 2500 },
    slidesPerView: 3,
    spaceBetween: 20,
  });

  // Product Cards
  products.forEach((p) => {
    const $card = $(`
      <div class="product">
        <a href="${p.image}" data-lightbox="product" data-title="${p.title}">
          <img src="${p.image}" />
        </a>
        <h4>${p.title}</h4>
        <p>$${p.price}</p>
      </div>
    `);
    // Buttons
    const $btnGroup = $('<div class="btn-group"></div>');
    const $addBtn = $("<button>Sepete Ekle</button>").on("click", () =>
      addToCart(p)
    );
    const $detailBtn = $("<button>Detay</button>").on("click", () =>
      openProductModal(p)
    );
    $btnGroup.append($addBtn, $detailBtn);
    $card.append($btnGroup);
    $("#product-list").append($card);
  });

  // Clear Cart
  $("#clear-cart").on("click", clearCart);
  getCart().forEach(renderCartItem);
})();
