//Лаба 2, 3
const productsData = [
    { id: 1, title: "Курс: Алгебра 7 ", type: "course", price: 1200, sales: 45, desc: "Повний курс з відео та тестами.", img: "https://via.placeholder.com/280x150/1976D2/FFFFFF?text=Алгебра" },
    { id: 2, title: "Довідник ЗНО", type: "book", price: 350, sales: 120, desc: "Усі формули в одній книзі.", img: "https://via.placeholder.com/280x150/FF9800/FFFFFF?text=ЗНО+Довідник" },
    { id: 3, title: "Курс: Геометрія", type: "course", price: 900, sales: 30, desc: "Розбираємо трикутники та кола.", img: "https://via.placeholder.com/280x150/4CAF50/FFFFFF?text=Геометрія" },
    { id: 4, title: "Збірник задач", type: "book", price: 200, sales: 85, desc: "Задачі підвищеної складності.", img: "https://via.placeholder.com/280x150/E91E63/FFFFFF?text=Задачі" }
];

const newsData = [
    { title: "Олімпіада 2026", text: "Реєстрація на весняний етап відкрита.", status: "very-important", date: "2026-05-01 10:00" },
    { title: "Оновлення платформи", text: "Додано графіки.", status: "important", date: "2026-05-05 14:30" },
    { title: "Технічні роботи", text: "Сайт може працювати з перебоями.", status: "normal", date: "2026-05-07 09:15" },
    { title: "Нові підручники", text: "Завезли нові зошити з геометрії.", status: "normal", date: "2026-04-20 11:00" }
];

//Лаба 2
const productsContainer = document.getElementById('productsContainer');

function renderProducts(dataArray) {
    productsContainer.innerHTML = ""; 
    dataArray.forEach(item => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <img src="${item.img}" alt="${item.title}" onclick="this.nextElementSibling.nextElementSibling.style.display = this.nextElementSibling.nextElementSibling.style.display === 'block' ? 'none' : 'block'" style="width:100%; cursor:pointer;">
            <h3>${item.title}</h3>
            <p class="card-desc" style="display:none; color:#666;">${item.desc}</p>
            <div class="price">${item.price} грн</div>
            <button class="btn" onclick="addToCart(${item.id})">В кошик</button>
        `;
        productsContainer.appendChild(div);
    });
}

function updateProducts() {
    let filtered = [...productsData]; 
    const cat = document.getElementById('filterCategory').value;
    const maxP = document.getElementById('maxPrice').value;
    const search = document.getElementById('searchInput').value.toLowerCase();
    const sort = document.getElementById('sortType').value;

    if (cat !== 'all') filtered = filtered.filter(p => p.type === cat);
    if (maxP) filtered = filtered.filter(p => p.price <= Number(maxP));
    if (search) filtered = filtered.filter(p => p.title.toLowerCase().includes(search));

    if (sort === 'nameAsc') filtered.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === 'priceAsc') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'priceDesc') filtered.sort((a, b) => b.price - a.price);

    renderProducts(filtered);
    if(myChartInstance) buildChart(myChartInstance.config.type, filtered);
}

document.getElementById('filterCategory').onchange = updateProducts;
document.getElementById('sortType').onchange = updateProducts;
document.getElementById('maxPrice').oninput = updateProducts;
document.getElementById('searchInput').oninput = updateProducts;
renderProducts(productsData);

const carouselText = document.getElementById('carouselText');
const offers = ["Знижка 50% на курс підготовки!", "Новий підручник вже у продажу!", "Безкоштовний вебінар!"];
let offerIndex = 0;
setInterval(() => {
    offerIndex = (offerIndex + 1) % offers.length;
    carouselText.innerHTML = `<h2>${offers[offerIndex]}</h2>`;
}, 3000);

//Лаба 3
let cart = [];
document.getElementById('cartBtn').onclick = () => {
    const p = document.getElementById('cartPanel');
    p.style.display = p.style.display === 'block' ? 'none' : 'block';
};

window.addToCart = function(id) {
    const product = productsData.find(p => p.id === id);
    const existing = cart.find(i => i.id === id);
    if (existing) existing.qty++; else cart.push({ ...product, qty: 1 });
    updateCartUI();
};

function updateCartUI() {
    const panel = document.getElementById('cartContent');
    document.getElementById('cartCount').innerText = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cart.length === 0) { panel.innerHTML = '<p>Кошик порожній.</p>'; return; }

    let html = '<table style="width:100%; text-align:left; font-size:14px;"><tr><th>Назва</th><th>Ціна</th><th>К-сть</th><th>Сума</th><th></th></tr>';
    let total = 0;
    cart.forEach(item => {
        let sum = item.price * item.qty;
        total += sum;
        html += `<tr><td>${item.title}</td><td>${item.price}</td><td><input type="number" value="${item.qty}" min="1" style="width:40px" onchange="cart.find(i=>i.id==${item.id}).qty=parseInt(this.value); updateCartUI();"></td><td>${sum}</td><td><button onclick="cart = cart.filter(i=>i.id!==${item.id}); updateCartUI();" style="color:red; background:none; border:none; cursor:pointer;">✖</button></td></tr>`;
    });
    panel.innerHTML = html + `</table><h3 style="text-align:right; color:#E91E63;">Разом: ${total} грн</h3><button class="btn" style="width:100%; background:#4CAF50;" onclick="alert('Замовлення відправлено!'); cart=[]; updateCartUI();">Відправити замовлення</button>`;
}

let newsLimit = 2;
newsData.sort((a, b) => new Date(b.date) - new Date(a.date));

function renderNewsSidebar() {
    document.getElementById('newsSidebar').innerHTML = newsData.slice(0, newsLimit).map((news, i) => `
        <div style="padding: 10px; border-bottom: 1px solid #ddd; cursor: pointer;" onclick="showNews(${i})">
            <small style="color: gray;">${news.date}</small><br>
            <span style="${news.status === 'very-important' ? 'font-weight:bold; color:red;' : ''}">${news.title}</span>
        </div>
    `).join('');
}

window.showNews = function(i) {
    document.getElementById('newsMainContent').innerHTML = `<h2 style="color: #1976D2; margin-top: 0;">${newsData[i].title}</h2><p><small>${newsData[i].date}</small></p><p style="font-size: 16px;">${newsData[i].text}</p>`;
};
document.getElementById('loadMoreNewsBtn').onclick = () => { newsLimit += 2; renderNewsSidebar(); };
renderNewsSidebar();

let myChartInstance = null;
window.buildChart = function(type, dataArray = productsData) {
    const ctx = document.getElementById('myChart').getContext('2d');
    if (myChartInstance) myChartInstance.destroy();
    myChartInstance = new Chart(ctx, {
        type: type,
        data: { labels: dataArray.map(p => p.title), datasets: [{ label: 'Популярність (Продажі)', data: dataArray.map(p => p.sales), backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50'], borderWidth: 1 }] },
        options: { scales: type === 'bar' || type === 'line' ? { y: { beginAtZero: true } } : {} }
    });
};
buildChart('bar');

document.getElementById('authBtn').onclick = () => document.getElementById('authModal').style.display = 'block';
document.getElementById('closeAuth').onclick = () => document.getElementById('authModal').style.display = 'none';

setTimeout(() => { if (localStorage.getItem('subscribed') !== 'true') document.getElementById('subscribePop').style.bottom = '0'; }, 2000);
document.getElementById('subAccept').onclick = () => { localStorage.setItem('subscribed', 'true'); document.getElementById('subscribePop').style.bottom = '-100px'; };
document.getElementById('subDecline').onclick = () => document.getElementById('subscribePop').style.bottom = '-100px';

let adShown = false;
window.addEventListener('scroll', () => {
    if (window.scrollY > 300 && !adShown) {
        adShown = true;
        document.getElementById('adModal').style.display = 'block';
        let timeLeft = 5;
        const countdown = setInterval(() => {
            timeLeft--;
            document.getElementById('adTimer').innerText = timeLeft;
            if (timeLeft <= 0) { clearInterval(countdown); document.getElementById('closeAdBtn').innerText = "Закрити"; document.getElementById('closeAdBtn').disabled = false; }
        }, 1000);
        document.getElementById('closeAdBtn').onclick = () => document.getElementById('adModal').style.display = 'none';
    }
    document.getElementById('scrollTopBtn').style.display = window.scrollY > window.innerHeight * 0.66 ? 'block' : 'none';
});
document.getElementById('scrollTopBtn').onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });