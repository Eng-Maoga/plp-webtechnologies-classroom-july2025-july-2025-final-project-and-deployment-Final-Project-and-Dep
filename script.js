// SPA Navigation
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav ul li a");

function showSection(id) {
  sections.forEach(sec => {
    sec.classList.remove("active");
    if (sec.id === id) sec.classList.add("active");
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${id}`) {
      link.classList.add("active");
    }
  });
}

navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href").substring(1);
    showSection(targetId);
    history.pushState(null, "", `#${targetId}`);
  });
});

window.addEventListener("load", () => {
  const hash = window.location.hash.substring(1) || "home";
  showSection(hash);
});

window.addEventListener("popstate", () => {
  const hash = window.location.hash.substring(1) || "home";
  showSection(hash);
});

// Waste Tracker Logic
const wasteForm = document.getElementById("wasteForm");
const wasteList = document.getElementById("wasteList");
const totalWaste = document.getElementById("totalWaste");
const mostWasted = document.getElementById("mostWasted");
let wasteData = [];

const ctx = document.getElementById("wasteChart");
let wasteChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [],
    datasets: [{
      label: "Food Waste (kg)",
      data: [],
      backgroundColor: "#2d6a4f"
    }]
  }
});

if (wasteForm) {
  wasteForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const item = document.getElementById("item").value;
    const quantity = parseFloat(document.getElementById("quantity").value);
    const category = document.getElementById("category").value;

    if (item && quantity) {
      // Add to log
      const li = document.createElement("li");
      li.textContent = `${quantity} kg of ${item} wasted (${category})`;
      wasteList.appendChild(li);

      // Update data
      wasteData.push({ item, quantity });
      updateSummary();

      wasteForm.reset();
    }
  });
}

function updateSummary() {
  // Total waste
  const total = wasteData.reduce((sum, w) => sum + w.quantity, 0);
  totalWaste.textContent = `Total Waste: ${total} kg`;

  // Most wasted
  const counts = {};
  wasteData.forEach(w => {
    counts[w.item] = (counts[w.item] || 0) + w.quantity;
  });
  const maxItem = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, "None");
  mostWasted.textContent = `Most Wasted Item: ${maxItem}`;

  // Update chart
  wasteChart.data.labels = Object.keys(counts);
  wasteChart.data.datasets[0].data = Object.values(counts);
  wasteChart.update();
}

// Contact Form
const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    contactStatus.textContent = "✅ Thank you for your message! We’ll reply soon.";
    contactForm.reset();
  });
}

// Mobile menu toggle (optional)
function toggleMenu() {
  document.getElementById("nav").classList.toggle("open");
}
document.getElementById("menuToggle").addEventListener("click", toggleMenu);