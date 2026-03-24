// ===== header.js =====

// Lấy thông tin user
let userRole = localStorage.getItem("userRole") || null;
let username = localStorage.getItem("username") || null;

// Render header
document.getElementById("header").innerHTML = `
  <header class="header">
    <div class="header-left">
      <a href="index.html">
        <img src="/logo.png" class="logo">
      </a>
      <input type="text" id="searchInput" placeholder="Tìm sản phẩm..." autocomplete="off" />
      <div id="searchResults" class="search-results"></div>
    </div>
    <div class="header-right">
      ${userRole === null ? `<button id="loginBtn">Login</button>` 
                          : `<button id="logoutBtn">Logout</button>`}
      <a href="cart.html" class="cart">🛒 Giỏ (<span id="cartCount">0</span>)</a>
    </div>
  </header>
`;

// ===== LOGIN / LOGOUT =====
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

if(loginBtn){
  loginBtn.addEventListener("click", () => {
    const popup = document.getElementById("authPopup");
    if(popup) popup.style.display = "block";
  });
}

if(logoutBtn){
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    alert("Đăng xuất thành công!");
    location.reload();
  });
}

// ===== CART COUNT =====
function updateCartCount(){
  const cartCountEl = document.querySelector("#cartCount");
  if(cartCountEl){
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = cart.reduce((t,p)=>t+p.qty,0);
    cartCountEl.innerText = total;
  }
}
updateCartCount();

// ===== SEARCH FUNCTION =====
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
let selectedIndex = -1;
let currentResults = [];
let timer;

// Vị trí dropdown
function positionSearchResults(){
  const rect = searchInput.getBoundingClientRect();
  searchResults.style.top = rect.bottom + window.scrollY + "px";
  searchResults.style.left = rect.left + window.scrollX + "px";
  searchResults.style.width = rect.width + "px";
}

window.addEventListener("resize", positionSearchResults);
window.addEventListener("scroll", positionSearchResults);
searchInput.addEventListener("focus", positionSearchResults);

// debounce + fetch
searchInput.addEventListener("input", ()=>{
  clearTimeout(timer);
  timer = setTimeout(()=> fetchSearchResults(searchInput.value.trim()), 300);
});

// Gọi API search
async function fetchSearchResults(query){
  if(!query){ searchResults.style.display="none"; return; }
  try{
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const products = await res.json();
    currentResults = products;
    renderResults(products);
  } catch(err){ console.error(err); }
}

// Render dropdown
function renderResults(products){
  searchResults.innerHTML="";
  selectedIndex=-1;

  if(products.length===0){
    searchResults.style.display="none";
    return;
  }

  products.forEach((p,i)=>{
    const div = document.createElement("div");
    div.innerHTML = `<strong>${p.name}</strong><br><small>${Number(p.price).toLocaleString()} VND</small>`;
    div.dataset.index = i;
    div.addEventListener("click", ()=> {
      window.location.href = `/search.html?q=${encodeURIComponent(p.name)}`;
    });
    searchResults.appendChild(div);
  });

  positionSearchResults();
  searchResults.style.display="block";
}

// Xử lý arrow & enter
searchInput.addEventListener("keydown", (e)=>{
  const items = searchResults.querySelectorAll("div");
  if(items.length === 0) return;

  if(e.key === "ArrowDown"){
    selectedIndex = (selectedIndex + 1) % items.length;
    updateHighlight(items);
    e.preventDefault();
  } else if(e.key === "ArrowUp"){
    selectedIndex = (selectedIndex - 1 + items.length) % items.length;
    updateHighlight(items);
    e.preventDefault();
  } else if(e.key === "Enter"){
    if(selectedIndex >= 0 && currentResults[selectedIndex]){
      window.location.href = `/search.html?q=${encodeURIComponent(currentResults[selectedIndex].name)}`;
    } else {
      const query = searchInput.value.trim();
      if(query) window.location.href = `/search.html?q=${encodeURIComponent(query)}`;
    }
    e.preventDefault();
  }
});

function updateHighlight(items){
  items.forEach((item,i)=>{
    if(i===selectedIndex) item.classList.add("active");
    else item.classList.remove("active");
  });
}

// Ẩn dropdown khi click ngoài
document.addEventListener("click", (e)=>{
  if(!searchResults.contains(e.target) && e.target!==searchInput){
    searchResults.style.display="none";
  }
});