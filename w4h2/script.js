(function () {
  const appendLocation = "#container";
  const parent = document.querySelector(appendLocation);
  if (!parent) {
    return;
  }

  const container = document.createElement("div");
  container.className = "ins-api-users-root";
  parent.appendChild(container);

  const API_URL = "https://jsonplaceholder.typicode.com/users";
  const STORAGE_KEY = "cachedUsers";
  const DAY_IN_MS = 24 * 60 * 60 * 1000;

  const style = document.createElement("style");
  style.textContent = `
    .ins-api-users-root {
      max-width: 700px;
      margin: 40px auto;
      padding: 30px 20px;
      background-color: #1e1e1e;
      border-radius: 16px;
      box-shadow: 0 0 20px rgba(0,0,0,0.5);
      text-align: center;
    }
    .button-wrapper {
      display: flex;
      justify-content: center;
      margin-bottom: 30px;
    }
    .fetch-btn {
      padding: 12px 24px;
      background-color: #333;
      color: #fff;
      border: 1px solid #444;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.3s ease;
    }
    .fetch-btn:hover {
      background-color: #555;
      transform: scale(1.03);
    }
    .user-card {
      background-color: #2a2a2a;
      border: 1px solid #3a3a3a;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
      box-shadow: 0 4px 10px rgba(0,0,0,0.4);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .user-card:hover {
      transform: scale(1.01);
      box-shadow: 0 6px 16px rgba(0,0,0,0.6);
    }
    .user-card h3 {
      font-size: 20px;
      margin-bottom: 10px;
      color: #ffffff;
    }
    .user-card p {
      font-size: 14px;
      color: #cccccc;
      margin: 6px 0;
    }
    .delete-btn {
      margin-top: 15px;
      padding: 8px 18px;
      background-color: #b00020;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s ease, transform 0.2s ease;
    }
    .delete-btn:hover {
      background-color: #cf0a2c;
      transform: scale(1.05);
    }
    .error, .empty-msg {
      margin-top: 30px;
      font-style: italic;
      color: #aaa;
      font-size: 16px;
      text-align: center;
    }
  `;
  document.head.appendChild(style);

  const cached = loadFromStorage();
  if (cached && cached.length > 0) {
    renderUsers(cached);
  } else {
    getUsers();
  }

  async function fetchUsersFromAPI() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("API yanıtı başarısız");
    return res.json();
  }

  async function getUsers() {
    try {
      const data = await fetchUsersFromAPI();
      saveToStorage(data);
      renderUsers(data);
    } catch (err) {
      clearAndAddButton();
      addError(err.message);
    }
  }

  function saveToStorage(users) {
    const data = {
      expiry: Date.now() + DAY_IN_MS,
      users,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      const now = Date.now();

      if (parsed.expiry && parsed.expiry > now && Array.isArray(parsed.users)) {
        return parsed.users;
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    return null;
  }

  function renderUsers(users) {
    container.innerHTML = "";

    if (!users || users.length === 0) {
      container.innerHTML += `<p class="empty-msg">Gösterilecek kullanıcı yok.</p>`;
      return;
    }

    users.forEach((user) => {
      const card = document.createElement("div");
      card.className = "user-card";
      const address = user.address;
      const fullAddress = `${address.street}, ${address.suite}, ${address.city} ${address.zipcode}`;

      card.innerHTML = `
        <h3>${user.name}</h3>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Address:</strong> ${fullAddress}</p>
      `;

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "Sil";
      deleteBtn.onclick = () => deleteUser(user.id);

      card.appendChild(deleteBtn);
      container.appendChild(card);
    });
  }

  function deleteUser(userId) {
    const storedRaw = localStorage.getItem(STORAGE_KEY);
    if (!storedRaw) {
      return;
    }

    try {
      const parsed = JSON.parse(storedRaw);
      if (!Array.isArray(parsed.users)) return;

      const updatedUsers = parsed.users.filter((u) => u.id !== userId);

      if (updatedUsers.length === 0) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        saveToStorage(updatedUsers);
      }

      renderUsers(updatedUsers);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function clearAndAddButton() {
    container.innerHTML = "";
    addFetchButton();
  }

  function addError(msg) {
    const err = document.createElement("p");
    err.className = "error";
    err.textContent = "Veri alınamadı: " + msg;
    container.appendChild(err);
  }

  function addFetchButton() {
    if (container.querySelector(".fetch-btn")) {
      return;
    }

    const fetchButton = document.createElement("button");
    fetchButton.className = "fetch-btn";
    fetchButton.textContent = "Verileri Getir";

    const buttonWrapper = document.createElement("div");
    buttonWrapper.className = "button-wrapper";
    buttonWrapper.appendChild(fetchButton);

    fetchButton.addEventListener("click", async () => {
      const cached = loadFromStorage();
      if (cached && cached.length > 0) {
        renderUsers(cached);
      } else {
        await getUsers();
      }
    });

    container.appendChild(buttonWrapper);
  }

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (
        mutation.type === "childList" &&
        container.querySelectorAll(".user-card").length === 0 &&
        container.querySelectorAll(".fetch-btn").length === 0 &&
        !sessionStorage.getItem("isUserDeletedOneTime")
      ) {
        addFetchButton();
        sessionStorage.setItem("isUserDeletedOneTime", true);
      }
    }
  });

  observer.observe(container, {
    childList: true,
    subtree: true,
  });
})();
