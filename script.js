let businesses = [];

// Fetch businesses from JSON
fetch("businesses.json")
  .then((res) => res.json())
  .then((data) => {
    businesses = data;
    populateFilters();
    displayBusinesses();
  });

// Populate filters
function populateFilters() {
  const categories = [...new Set(businesses.map((b) => b.category))];
  const citys = [...new Set(businesses.map((b) => b.city))];

  const catSelect = document.getElementById("categoryFilter");
  categories.forEach((cat) => {
    let opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    catSelect.appendChild(opt);
  });

  const citySelect = document.getElementById("cityFilter");
  citys.forEach((city) => {
    let opt = document.createElement("option");
    opt.value = city;
    opt.textContent = city;
    citySelect.appendChild(opt);
  });

  // Event listeners
  catSelect.addEventListener("change", displayBusinesses);
  citySelect.addEventListener("change", displayBusinesses);
  document
    .getElementById("searchInput")
    .addEventListener("input", displayBusinesses);
  document
    .getElementById("topPriority")
    .addEventListener("change", displayBusinesses);
}

// Display businesses
function displayBusinesses() {
  const cat = document.getElementById("categoryFilter").value.toLowerCase();
  const city = document.getElementById("cityFilter").value.toLowerCase();
  const search = document.getElementById("searchInput").value.toLowerCase();
  const showTop = document.getElementById("topPriority").checked;
  const list = document.getElementById("businessList");
  list.innerHTML = "";

  let filtered = businesses.filter(
    (b) =>
      (cat === "" || b.category.toLowerCase() === cat) &&
      (city === "" || b.city.toLowerCase() === city) &&
      b.name.toLowerCase().includes(search)
  );

  if (showTop) {
    filtered = filtered.filter((b) => (b.priority || 0) >= 8);
  }

  filtered.sort((a, b) => (b.priority || 0) - (a.priority || 0));

  filtered.forEach((b) => {
    const card = createBusinessCard(b);
    list.appendChild(card);
  });
}

// Create business card
function createBusinessCard(b) {
  const card = document.createElement("div");
  card.className = "business-card";

  const stars = Math.min(Math.round((b.priority || 0) / 2), 5);
  let starHtml = "";
  for (let i = 0; i < 5; i++) {
    starHtml +=
      i < stars
        ? '<i class="fas fa-star star-filled"></i>'
        : '<i class="far fa-star star-empty"></i>';
  }

  card.innerHTML = `
    <img src="${b.image}" alt="${b.name}">
    <div class="card-content">
      <h2>${b.name}</h2>
      <div class="stars">${starHtml}</div>
      <p class="description">${b.description}</p>
    </div>
  `;

  card.addEventListener("click", () => showModal(b));
  return card;
}

// Show modal
function showModal(b) {
  const modal = document.getElementById("businessModal");
  const modalBody = document.getElementById("modalBody");

  const stars = Math.min(Math.round((b.priority || 0) / 2), 5);
  let starHtml = "";
  for (let i = 0; i < 5; i++) {
    starHtml +=
      i < stars
        ? '<i class="fas fa-star star-filled"></i>'
        : '<i class="far fa-star star-empty"></i>';
  }

  modalBody.innerHTML = `
    <img src="${b.image}" alt="${b.name}">
    <h2>${b.name}</h2>
    <div class="stars">${starHtml}</div>
    <p><strong>Category:</strong> ${b.category}</p>
    <p><strong>city:</strong> ${b.city}</p>
    <p><strong>Description:</strong> ${b.description}</p>
    <p><strong>Address:</strong> ${b.address}</p>
    <div class="buttons">
      <a href="tel:${
        b.contact
      }" class="btn"><i class="fas fa-phone"></i> Call</a>
      <a href="${
        b.whatsapp
      }" target="_blank" class="btn whatsapp"><i class="fab fa-whatsapp"></i> WhatsApp</a>
    </div>
    <div class="social-links">
      ${
        b.social.facebook
          ? `<a href="${b.social.facebook}" target="_blank"><i class="fab fa-facebook"></i></a>`
          : ""
      }
      ${
        b.social.instagram
          ? `<a href="${b.social.instagram}" target="_blank"><i class="fab fa-instagram"></i></a>`
          : ""
      }
    </div>
    <a href="${
      b.map
    }" target="_blank" class="directions"><i class="fas fa-directions"></i> Directions</a>
  `;

  modal.style.display = "flex";
}

// Close modal (only Cancel button + clicking outside)
const modal = document.getElementById("businessModal");
const closeBtn = document.querySelector(".close-btn");

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Scroll to top button
const goTopBtn = document.getElementById("goTopBtn");

window.addEventListener("scroll", () => {
  if (document.documentElement.scrollTop > 200) {
    goTopBtn.style.display = "block";
  } else {
    goTopBtn.style.display = "none";
  }
});

goTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
