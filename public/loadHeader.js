// Lấy role hiện tại
let userRole = localStorage.getItem("role") || "guest";

// Gán HTML cho header
document.getElementById("header").innerHTML = `
  <header class="header" style="display:flex; justify-content:space-between; align-items:center; padding:10px; background:linear-gradient(135deg,#2e7d32,#66bb6a); color:white;">
    
    <div class="header-left" style="display:flex; align-items:center; gap:15px;">
      <a href="/index.html">
        <img src="/logo.png" alt="Logo" class="logo" style="height:50px;">
      </a>
      <input type="text" id="searchInput" placeholder="Tìm sản phẩm..." style="padding:5px; border-radius:5px; border:none;">
    </div>
    
    <div class="header-right" style="display:flex; align-items:center; gap:10px;">
      ${userRole === "admin" ? '<a href="#adminPanel" style="color:white; text-decoration:none;">Admin Panel</a>' : ''}
      <button id="headerLoginBtn" style="padding:5px 10px; border:none; border-radius:5px; cursor:pointer;">
        ${userRole === "guest" ? "Login" : "Logout"}
      </button>
      <a href="/cart.html" style="color:white; text-decoration:none; font-size:20px;">🛒</a>
    </div>
    
  </header>
`;

// Xử lý nút login/logout
document.getElementById("headerLoginBtn").onclick = function() {
  if(userRole === "guest") {
    document.getElementById("authPopup").style.display = "block";
  } else {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    alert("Đăng xuất thành công!");
    location.reload();
  }
};

// Xử lý search (nếu muốn)
document.getElementById("searchInput").addEventListener("input", function(e){
  const query = e.target.value.toLowerCase();
  const cards = document.querySelectorAll("#product-grid .card");
  cards.forEach(card => {
    const name = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = name.includes(query) ? "block" : "none";
  });
});