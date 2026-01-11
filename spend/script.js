const initialMoney = 100000000000;
let currentMoney = initialMoney;

const items = [
    { name: '巨无霸', price: 2, img: 'big-mac.jpg' },
    { name: '人字拖', price: 3, img: 'flip-flops.jpg' },
    { name: '可口可乐', price: 5, img: 'coca-cola-pack.jpg' },
    { name: '电影票', price: 12, img: 'movie-ticket.jpg' },
    { name: '书', price: 15, img: 'book.jpg' },
    { name: '龙虾大餐', price: 45, img: 'lobster-dinner.jpg' },
    { name: '电子游戏', price: 60, img: 'video-game.jpg' },
    { name: '亚马逊Echo', price: 99, img: 'amazon-echo.jpg' },
    { name: 'Netflix年费', price: 100, img: 'year-of-netflix.jpg' },
    { name: 'AJ球鞋', price: 125, img: 'air-jordans.jpg' },
    { name: 'Airpods', price: 199, img: 'airpods.jpg' },
    { name: '游戏机', price: 299, img: 'gaming-console.jpg' },
    { name: '无人机', price: 350, img: 'drone.jpg' },
    { name: '智能手机', price: 699, img: 'smartphone.jpg' },
    { name: '自行车', price: 800, img: 'bike.jpg' },
    { name: '小猫', price: 1500, img: 'kitten.jpg' },
    { name: '小狗', price: 1500, img: 'puppy.jpg' },
    { name: '嘟嘟车', price: 2300, img: 'auto-rickshaw.jpg' },
    { name: '马', price: 2500, img: 'horse.jpg' },
    { name: '一英亩农田', price: 3000, img: 'acre-of-farmland.jpg' },
    { name: '名牌包', price: 5500, img: 'designer-handbag.jpg' },
    { name: '热水浴缸', price: 6000, img: 'hot-tub.jpg' },
    { name: '顶级红酒', price: 7000, img: 'luxury-wine.jpg' },
    { name: '钻戒', price: 10000, img: 'diamond-ring.jpg' },
    { name: '摩托艇', price: 12000, img: 'jet-ski.jpg' },
    { name: '劳力士', price: 15000, img: 'rolex.jpg' },
    { name: '福特 F-150', price: 30000, img: 'ford-f-150.jpg' },
    { name: '特斯拉', price: 75000, img: 'tesla.jpg' },
    { name: '怪物卡车', price: 150000, img: 'monster-truck.jpg' },
    { name: '法拉利', price: 250000, img: 'ferrari.jpg' },
    { name: '独栋别墅', price: 300000, img: 'single-family-home.jpg' },
    { name: '金条', price: 700000, img: 'gold-bar.jpg' },
    { name: '麦当劳特许经营权', price: 1500000, img: 'mcdonalds-franchise.jpg' },
    { name: '超级碗广告', price: 5250000, img: 'superbowl-ad.jpg' },
    { name: '游艇', price: 7500000, img: 'yacht.jpg' },
    { name: 'M1主战坦克', price: 8000000, img: 'm1-abrams.jpg' },
    { name: 'F1赛车', price: 15000000, img: 'formula-1-car.jpg' },
    { name: '阿帕奇直升机', price: 31000000, img: 'apache-helicopter.jpg' },
    { name: '豪宅', price: 45000000, img: 'mansion.jpg' },
    { name: '拍一部电影', price: 100000000, img: 'make-a-movie.jpg' },
    { name: '波音747', price: 148000000, img: 'boeing-747.jpg' },
    { name: '蒙娜丽莎', price: 780000000, img: 'mona-lisa.jpg', unique: true },
    { name: '摩天大楼', price: 850000000, img: 'skyscraper.jpg' },
    { name: '豪华游轮', price: 930000000, img: 'cruise-ship.jpg' },
    { name: 'NBA球队', price: 2120000000, img: 'nba-team.jpg' }
];

// Add quantity property to keep track of purchases
items.forEach(item => {
    item.quantity = 0;
});

const balanceContainer = document.querySelector('.balance-container');
const itemsGrid = document.getElementById('items-grid');
const receiptContainer = document.getElementById('receipt-container');
const receiptList = document.getElementById('receipt-list');
const receiptTotal = document.getElementById('receipt-total');

// Helper to format currency
function formatMoney(amount) {
    return '$' + amount.toLocaleString('en-US');
}

// Create the grid elements once
function initGrid() {
    itemsGrid.innerHTML = '';
    items.forEach((item, index) => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        // Disable input for unique items if already bought (handled in updateUI, but structure needs strictly number input.
        // For unique items, maybe we shouldn't even show input? Or just keep it clamped to 0/1.
        // Let's keep input but it will be clamped.)
        itemCard.innerHTML = `
            <img src="images/${item.img}" alt="${item.name}">
            <div class="item-name">${item.name}</div>
            <div class="item-price">${formatMoney(item.price)}</div>
            <div class="controls">
                <button class="btn btn-sell" id="sell-${index}">卖出</button>
                <input type="number" class="item-quantity" id="input-${index}" value="${item.quantity}">
                <button class="btn btn-buy" id="buy-${index}">买入</button>
            </div>
        `;
        itemsGrid.appendChild(itemCard);

        // Add event listeners
        document.getElementById(`sell-${index}`).addEventListener('click', () => sellItem(index));
        document.getElementById(`buy-${index}`).addEventListener('click', () => buyItem(index));

        const input = document.getElementById(`input-${index}`);
        input.addEventListener('input', (e) => handleInput(index, e.target.value));
        input.addEventListener('change', (e) => handleInput(index, e.target.value)); // Ensure final validation
    });
}

function handleInput(index, value) {
    // Parse input
    let newQuantity = parseInt(value);
    if (isNaN(newQuantity) || newQuantity < 0) {
        newQuantity = 0;
    }

    const item = items[index];

    // Check unique constraint
    if (item.unique && newQuantity > 1) {
        newQuantity = 1;
    }

    // Calculate max affordable quantity
    // Current Money + (Money currently tied up in this item)
    const availableMoneyForThisItem = currentMoney + (item.quantity * item.price);
    const maxQuantity = Math.floor(availableMoneyForThisItem / item.price);

    if (newQuantity > maxQuantity) {
        newQuantity = maxQuantity;
    }

    // Update state
    const oldQuantity = item.quantity;
    item.quantity = newQuantity;

    // Update global money
    const costDiff = (newQuantity - oldQuantity) * item.price;
    currentMoney -= costDiff;

    updateUI();
}

function updateUI() {
    // Update Balance
    balanceContainer.innerText = formatMoney(currentMoney);

    // Update Items UI (Disable buttons, sync inputs if not focused)
    items.forEach((item, index) => {
        const buyBtn = document.getElementById(`buy-${index}`);
        const sellBtn = document.getElementById(`sell-${index}`);
        const input = document.getElementById(`input-${index}`);

        let canBuy = currentMoney >= item.price;
        const canSell = item.quantity > 0;

        // Unique item logic
        if (item.unique && item.quantity >= 1) {
            canBuy = false;
        }

        // Update Button States
        if (canBuy) {
            buyBtn.classList.add('active');
            buyBtn.disabled = false;
        } else {
            buyBtn.classList.remove('active');
            buyBtn.disabled = true;
        }

        if (canSell) {
            sellBtn.classList.add('active');
            sellBtn.disabled = false;
        } else {
            sellBtn.classList.remove('active');
            sellBtn.disabled = true;
        }

        // Update Input value only if it's not the active element (to prevent typing glitches)
        if (document.activeElement !== input) {
            input.value = item.quantity;
        }

        // If we clamped the value inside handleInput and we are currently editing it,
        // we might want to forcefully update it to show the clamp effect immediately
        // BUT doing so interrupts typing if done on every input event.
        // A compromise: check if the value in DOM matches state. If not, and it implies a clamp, update it.
        // For now, simpler is better: let the user type, but if they exceed, `handleInput` clamps state.
        // If we want to reflect clamp immediately in the input box:
        if (document.activeElement === input && parseInt(input.value) !== item.quantity) {
            input.value = item.quantity;
        }
    });

    updateReceipt();
}

function updateReceipt() {
    const purchasedItems = items.filter(item => item.quantity > 0);

    if (purchasedItems.length === 0) {
        receiptContainer.classList.add('hidden');
        return;
    }

    receiptContainer.classList.remove('hidden');
    receiptList.innerHTML = '';

    let totalSpent = 0;

    purchasedItems.forEach(item => {
        const cost = item.price * item.quantity;
        totalSpent += cost;

        const row = document.createElement('div');
        row.className = 'receipt-item';
        row.innerHTML = `
            <div>${item.name} x${item.quantity}</div>
            <div>${formatMoney(cost)}</div>
        `;
        receiptList.appendChild(row);
    });

    receiptTotal.innerText = formatMoney(totalSpent);
}

function buyItem(index) {
    const item = items[index];
    // Check unique
    if (item.unique && item.quantity >= 1) return;

    if (currentMoney >= item.price) {
        currentMoney -= item.price;
        item.quantity++;
        updateUI();
    }
}

function sellItem(index) {
    const item = items[index];
    if (item.quantity > 0) {
        currentMoney += item.price;
        item.quantity--;
        updateUI();
    }
}

// Initial Render
initGrid();
updateUI();
