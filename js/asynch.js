const API_URL = "https://backend-for-students-production.up.railway.app/api";

let productsData = []; 
let cart = [];
let token = localStorage.getItem('jwt_token') || ""; 
let currentUser = JSON.parse(localStorage.getItem('current_user')) || null;

async function fetchProducts() {
    try {
        let response = await fetch(`${API_URL}/items`);
        let data = await response.json();
        
        let ourItems = data.filter(item => item.category === "math-portal");
        
        productsData = ourItems.map(item => ({
            id: item._id || item.id, 
            title: item.name,
            type: item.description || "course", 
            price: Number(item.price) || 0,
            sales: 0, 
            img: `https://via.placeholder.com/280x150/1976D2?text=${item.name}`
        }));
        
        updateProducts(); 
    } catch(err) {
        console.error("Помилка завантаження товарів:", err);
    }
}


const authModal = document.getElementById('authModal');
const authBtn = document.getElementById('authBtn');
const userInfo = document.getElementById('userInfo');

authBtn.onclick = () => {
    if(currentUser) { 
        currentUser = null; 
        token = "";
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('current_user');
        alert("Ви вийшли з акаунта."); 
        updateUI(); 
    } else { 
        authModal.style.display = 'block'; 
    }
};

document.getElementById('closeAuth').onclick = () => authModal.style.display = 'none';

document.getElementById('tabLogin').onclick = function() {
    this.classList.add('active'); document.getElementById('tabReg').classList.remove('active');
    document.getElementById('loginForm').style.display = 'flex';
    document.getElementById('regForm').style.display = 'none';
};
document.getElementById('tabReg').onclick = function() {
    this.classList.add('active'); document.getElementById('tabLogin').classList.remove('active');
    document.getElementById('regForm').style.display = 'flex';
    document.getElementById('loginForm').style.display = 'none';
};

window.register = async function() {
    const user = document.getElementById('regUser').value.trim();
    const pass1 = document.getElementById('regPass').value;
    const pass2 = document.getElementById('regPass2').value;
    const err = document.getElementById('regError');

    if(!user || !pass1 || !pass2) return err.innerText = "Помилка: Заповніть усі обов'язкові поля (*)";
    if(pass1.length < 6) return err.innerText = "Помилка: Пароль має містити мінімум 6 символів!";
    if(pass1 !== pass2) return err.innerText = "Помилка: Паролі не співпадають!";

    try {
        let res = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: user, password: pass1 })
        });
        
        let data = await res.json();
        
        if(res.ok) {
            err.style.color = "green"; err.innerText = "Успіх! Ви зареєстровані.";
            setTimeout(() => { document.getElementById('tabLogin').click(); err.innerText=""; }, 1500);
        } else {
            err.style.color = "red"; err.innerText = data.message || "Помилка реєстрації. Можливо логін зайнятий.";
        }
    } catch(e) { console.error(e); }
};

window.login = async function() {
    const user = document.getElementById('logUser').value.trim();
    const pass = document.getElementById('logPass').value;
    const err = document.getElementById('logError');

    try {
        let res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: user, password: pass })
        });

        if(res.ok) {
            let data = await res.json();
            token = data.token; 
            
            currentUser = { username: user, role: user === "admin" ? "admin" : "user" };
            
            localStorage.setItem('jwt_token', token);
            localStorage.setItem('current_user', JSON.stringify(currentUser));
            
            err.style.color = "green"; err.innerText = "Авторизація успішна!";
            setTimeout(() => { authModal.style.display = 'none'; err.innerText=""; updateUI(); }, 1000);
        } else {
            err.style.color = "red"; err.innerText = "Невірно введений логін або пароль."; 
        }
    } catch(e) { console.error(e); }
};

function updateUI() {
    if(currentUser) {
        userInfo.innerText = `👤 ${currentUser.username}`;
        authBtn.innerText = "Вийти";
        document.getElementById('adminPanel').style.display = (currentUser.role === 'admin') ? 'block' : 'none';
    } else {
        userInfo.innerText = "";
        authBtn.innerText = "🔑 Увійти";
        document.getElementById('adminPanel').style.display = 'none';
    }
    updateProducts(); 
}


window.createProduct = async function() {
    if(!currentUser || currentUser.role !== 'admin') return;
    
    const title = document.getElementById('newTitle').value;
    const price = document.getElementById('newPrice').value;
    const type = document.getElementById('newType').value;
    
    if(!title || price <= 0) return alert("Заповніть коректно назву та ціну!");
    
    try {
        await fetch(`${API_URL}/items`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({ name: title, description: type, price: price, category: "math-portal" })
        });
        
        document.getElementById('newTitle').value = ''; 
        document.getElementById('newPrice').value = '';
        fetchProducts(); 
    } catch(err) { console.error(err); }
};

window.deleteProduct = async function(id) {
    if(!currentUser || currentUser.role !== 'admin') return;
    if(!confirm("Видалити товар з бази сервера?")) return;

    try {
        let res = await fetch(`${API_URL}/items/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        if(res.ok) {
            fetchProducts(); 
        } else {
            alert("Помилка! Можливо бекенд не підтримує видалення.");
        }
    } catch(err) { console.error(err); }
};

window.editProduct = function(id) {
    alert("Функція редагування розробляється. API викладача поки що підтримує тільки додавання (POST) та видалення.");
};

const productsContainer = document.getElementById('productsContainer');
window.updateProducts = function() {
    productsContainer.innerHTML = "";
    
    if(productsData.length === 0) {
        productsContainer.innerHTML = "<p>Завантаження з сервера...</p>";
    }

    productsData.forEach(item => {
        let adminBtns = '';
        if(currentUser && currentUser.role === 'admin') {
            adminBtns = `<div style="margin-top: 10px; display:flex; justify-content:center;">
                <button style="background:red; color:white; border:none; padding:5px; border-radius:3px; cursor:pointer; width:100%" onclick="deleteProduct('${item.id}')">🗑 Видалити з БД</button>
            </div>`;
        }

        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <img src="${item.img}" style="width:100%; border-radius:5px;">
            <h3>${item.title}</h3>
            <div class="price">${item.price} грн</div>
            <button class="btn" style="width: 100%; background: #4CAF50;" onclick="addToCart('${item.id}')">В кошик</button>
            ${adminBtns}
        `;
        productsContainer.appendChild(div);
    });
    
    if(myChartInstance) buildChart('bar', productsData);
};

document.getElementById('cartBtn').onclick = () => {
    const p = document.getElementById('cartPanel'); p.style.display = p.style.display === 'block' ? 'none' : 'block';
};

window.addToCart = function(id) {
    const product = productsData.find(p => String(p.id) === String(id));
    const existing = cart.find(i => String(i.id) === String(id));
    if (existing) existing.qty++; else cart.push({ ...product, qty: 1 });
    updateCartUI();
};

function updateCartUI() {
    const panel = document.getElementById('cartContent');
    document.getElementById('cartCount').innerText = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cart.length === 0) { panel.innerHTML = '<p>Кошик порожній.</p>'; return; }

    let html = '<table style="width:100%; font-size:14px;">';
    let total = 0;
    cart.forEach(item => {
        let sum = item.price * item.qty; total += sum;
        html += `<tr><td>${item.title}</td><td>${item.qty}шт.</td><td>${sum}грн</td><td><button onclick="cart = cart.filter(i=>String(i.id)!=='${item.id}'); updateCartUI();" style="color:red; background:none; border:none; cursor:pointer;">✖</button></td></tr>`;
    });
    panel.innerHTML = html + `</table><h4 style="text-align:right;">Разом: ${total} грн</h4><button class="btn" style="width:100%; background:#2196F3;" onclick="checkout()">Відправити замовлення</button>`;
}

window.checkout = function() {
    if(!currentUser) {
        alert("Увага! Замовлення можуть відправляти лише зареєстровані користувачі.");
        document.getElementById('cartPanel').style.display = 'none';
        authModal.style.display = 'block'; 
        return;
    }
    if(cart.length === 0) return;
    
    cart.forEach(cartItem => {
        let p = productsData.find(prod => String(prod.id) === String(cartItem.id));
        if(p) p.sales += cartItem.qty;
    });
    
    alert(`Дякуємо за замовлення, ${currentUser.username}!`);
    cart = []; updateCartUI(); updateProducts(); 
};

let myChartInstance = null;
function buildChart(type, dataArray = productsData) {
    const ctx = document.getElementById('myChart').getContext('2d');
    if (myChartInstance) myChartInstance.destroy();
    myChartInstance = new Chart(ctx, {
        type: type,
        data: { 
            labels: dataArray.map(p => p.title), 
            datasets: [{ label: 'Популярність (Покупки)', data: dataArray.map(p => p.sales), backgroundColor: '#FF9800' }] 
        }
    });
}

fetchProducts(); 
updateUI();