<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<title>Sản phẩm</title>
<link rel="stylesheet" href="style.css">
</head>
<body>

<!-- HEADER -->
<header class="header">
  <div class="header-left">
    <a href="index.html">
      <img src="/logo.png" class="logo">
    </a>
    <input type="text" id="searchInput" placeholder="Tìm sản phẩm..." />
    <div id="searchResults"></div>
  </div>
  <div class="header-right">
    <a href="cart.html" class="cart">🛒 Giỏ (<span id="cartCount">0</span>)</a>
  </div>
</header>

<!-- NAVBAR -->
<nav>
  <a href="import.html">Trái cây nhập khẩu</a>
  <a href="local.html">Trái cây nội địa</a>
  <a href="cut.html">Trái cây cắt gọt</a>
  <a href="food.html">Thực phẩm công nghệ</a>
  <a href="gift.html">Giỏ quà tặng</a>
  <a href="box.html">Hộp quà tặng</a>
</nav>

<!-- SẢN PHẨM -->
<h2 style="text-align:center; margin-top:20px;">Sản phẩm</h2>
<div id="highlight" class="grid"></div>

<script>
// ===== GIỎ HÀNG =====
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || []
}

function updateCartCount() {
  const cart = getCart()
  let total = 0
  cart.forEach(p => total += Number(p.qty) || 0)
  const el = document.getElementById("cartCount")
  if(el) el.innerText = total
}

function addToCart(id,name,price,image){
  let cart = getCart()
  const exist = cart.find(p => p.id === id)
  if(exist){
    exist.qty = Number(exist.qty) + 1
  } else {
    cart.push({id,name,price:Number(price),image,qty:1})
  }
  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()
  alert("Đã thêm vào giỏ 🛒")
}

// ===== LOAD SẢN PHẨM (MẪU CARD) =====
async function loadProducts(category="all"){
  try{
    const res = await fetch("/api/fruits")
    const products = await res.json()
    const grid = document.getElementById("highlight")
    grid.innerHTML = ""
    products.filter(p => category==="all" || p.category===category).forEach(p => {
      const card = document.createElement("div")
      card.className = "card"
      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <div class="card-content">
          <h3>${p.name}</h3>
          <p>${Number(p.price).toLocaleString()} VND / ${p.unit}</p>
          <button onclick="addToCart('${p._id}','${p.name}',${p.price},'${p.image}')">🛒 Thêm vào giỏ</button>
        </div>
      `
      grid.appendChild(card)
    })
  } catch(err){
    console.error(err)
  }
}

// ===== SEARCH POPUP HEADER =====
const searchInput = document.getElementById("searchInput")
const searchResults = document.getElementById("searchResults")
let timer, currentResults = []
searchInput.addEventListener("input", ()=>{
  clearTimeout(timer)
  timer = setTimeout(()=> fetchSearch(searchInput.value.trim()),300)
})

async function fetchSearch(query){
  if(!query){ searchResults.style.display="none"; return; }
  try{
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
    const products = await res.json()
    currentResults = products
    renderResults(products)
  } catch(err){ console.error(err) }
}

function renderResults(products){
  searchResults.innerHTML = ""
  if(products.length === 0){ searchResults.style.display = "none"; return; }
  products.forEach((p,i)=>{
    const div = document.createElement("div")
    div.innerHTML = `<strong>${p.name}</strong><br><small>${Number(p.price).toLocaleString()} VND</small>`
    div.dataset.index = i
    div.addEventListener("click",()=> window.location.href=`/search.html?q=${encodeURIComponent(p.name)}`)
    searchResults.appendChild(div)
  })
  const rect = searchInput.getBoundingClientRect()
  searchResults.style.top = rect.bottom + window.scrollY + "px"
  searchResults.style.left = rect.left + window.scrollX + "px"
  searchResults.style.width = rect.width + "px"
  searchResults.style.display = "block"
}
document.addEventListener("click",(e)=>{
  if(!searchResults.contains(e.target) && e.target!==searchInput) searchResults.style.display="none"
})

// ===== KHỞI TẠO =====
updateCartCount()
loadProducts()
</script>

</body>
</html>