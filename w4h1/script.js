(function () {
    const container = document.querySelector('.ins-api-users');
    const API_URL = 'https://jsonplaceholder.typicode.com/users';
    const STORAGE_KEY = 'cachedUsers';
    const EXPIRY_KEY = 'usersExpiry';
    const DAY_IN_MS = 24 * 60 * 60 * 1000;

    const style = document.createElement('style');
    style.textContent = `
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', sans-serif;
        }
        body, html {
            background-color: #121212;
            color: #f1f1f1;
            min-height: 100vh;
        }
        .ins-api-users {
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

    const fetchButton = document.createElement('button');
    fetchButton.className = 'fetch-btn';
    fetchButton.textContent = 'Verileri Getir';

    const buttonWrapper = document.createElement('div');
    buttonWrapper.className = 'button-wrapper';
    buttonWrapper.appendChild(fetchButton);

    container.appendChild(buttonWrapper);

    fetchButton.addEventListener('click', async () => {
        const cached = loadFromStorage();
        if (cached && cached.length > 0) {
            renderUsers(cached);
        } else {
            await getUsers();
        }
    });

    function fetchUsersFromAPI() {
        return new Promise((resolve, reject) => {
            fetch(API_URL)
                .then(res => {
                    if (!res.ok) {
                        reject(new Error('API yanıtı başarısız'));
                    } else {
                        return res.json();
                    }
                })
                .then(data => resolve(data))
                .catch(err => reject(err));
        });
    }

    async function getUsers() {
        try {
            const data = await fetchUsersFromAPI();
            saveToStorage(data);
            renderUsers(data);
        } catch (err) {
            container.innerHTML = '';
            container.appendChild(buttonWrapper);
            container.innerHTML += `<p class="error">Veri alınamadı: ${err.message}</p>`;
        }
    }

    function saveToStorage(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        localStorage.setItem(EXPIRY_KEY, Date.now() + DAY_IN_MS);
    }

    function loadFromStorage() {
        const expiry = localStorage.getItem(EXPIRY_KEY);
        const now = Date.now();
        try {
            if (expiry && now < Number(expiry)) {
                const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
                if (Array.isArray(data)) return data;
                throw new Error('Geçersiz veri');
            }
        } catch {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(EXPIRY_KEY);
        }
        return null;
    }

    function renderUsers(users) {
        container.innerHTML = '';
        container.appendChild(buttonWrapper);

        if (!users || users.length === 0) {
            container.innerHTML += `<p class="empty-msg">Gösterilecek kullanıcı yok.</p>`;
            return;
        }

        users.forEach(user => {
            const card = document.createElement('div');
            card.className = 'user-card';
            const address = user.address;
            const fullAddress = `${address.street}, ${address.suite}, ${address.city} ${address.zipcode}`;

            card.innerHTML = `
                <h3>${user.name}</h3>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Address:</strong> ${fullAddress}</p>
            `;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Sil';
            deleteBtn.onclick = () => deleteUser(user.id);

            card.appendChild(deleteBtn);
            container.appendChild(card);
        });
    }

    function deleteUser(userId) {
        const stored = loadFromStorage();
        const updated = stored.filter(u => u.id !== userId);

        if (updated.length === 0) {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(EXPIRY_KEY);
        } else {
            saveToStorage(updated);
        }

        renderUsers(updated);
    }
})();
