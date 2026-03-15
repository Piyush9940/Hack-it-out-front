const API_BASE = "https://hack-it-out-s7yt.onrender.com/api/weather";

// Progress bar
const progressBar = document.getElementById("progressBar");
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = progress + "%";
});

// Reveal on scroll
const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  },
  { threshold: 0.18 }
);

revealElements.forEach((el) => revealObserver.observe(el));

// Counters
const counters = document.querySelectorAll(".counter");
let countersStarted = false;

function startCounters() {
  if (countersStarted) return;
  countersStarted = true;

  counters.forEach((counter) => {
    const target = Number(counter.dataset.target);
    let value = 0;
    const step = Math.max(1, Math.ceil(target / 50));

    function update() {
      value += step;
      if (value >= target) {
        counter.textContent = target;
      } else {
        counter.textContent = value;
        requestAnimationFrame(update);
      }
    }

    update();
  });
}

const statsSection = document.querySelector(".stats-grid");
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) startCounters();
    });
  },
  { threshold: 0.35 }
);

if (statsSection) statsObserver.observe(statsSection);

// Feature tabs
const tabs = document.querySelectorAll(".feature-tab");
const panels = document.querySelectorAll(".feature-panel");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    panels.forEach((p) => p.classList.remove("active"));

    tab.classList.add("active");
    const targetPanel = document.getElementById(tab.dataset.target);
    if (targetPanel) targetPanel.classList.add("active");
  });
});

// Workflow active state
const workflowCards = document.querySelectorAll("#workflowGrid .step-card");
workflowCards.forEach((card) => {
  card.addEventListener("click", () => {
    workflowCards.forEach((c) => c.classList.remove("active"));
    card.classList.add("active");
  });
});

// FAQ
const faqItems = document.querySelectorAll(".faq-item");
faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");
  if (!question) return;

  question.addEventListener("click", () => {
    const isActive = item.classList.contains("active");
    faqItems.forEach((faq) => faq.classList.remove("active"));
    if (!isActive) item.classList.add("active");
  });
});

// Real location interaction
const detectLocationBtn = document.getElementById("detectLocationBtn");
const locationStatus = document.getElementById("locationStatus");
const statusPanel = document.getElementById("statusPanel");

async function testBackend(lat, lng) {
  try {
    const res = await fetch(
      `${API_BASE}/summary?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`
    );
    const data = await res.json();
    return data?.success === true;
  } catch {
    return false;
  }
}

if (detectLocationBtn) {
  detectLocationBtn.addEventListener("click", async () => {
    if (!navigator.geolocation) {
      locationStatus.textContent = "Geolocation is not supported by your browser.";
      return;
    }

    detectLocationBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Detecting...';
    detectLocationBtn.disabled = true;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        localStorage.setItem("lat", lat);
        localStorage.setItem("lng", lng);

        locationStatus.textContent = `Location detected successfully: ${lat.toFixed(
          4
        )}, ${lng.toFixed(4)}.`;

        const backendReady = await testBackend(lat, lng);

        detectLocationBtn.innerHTML =
          '<i class="fas fa-check-circle"></i> Location Detected';

        statusPanel.innerHTML = `
          <span class="status-pill pill-ok">GPS Active</span>
          <span class="status-pill pill-info">Lat: ${lat.toFixed(4)}</span>
          <span class="status-pill pill-info">Lng: ${lng.toFixed(4)}</span>
          <span class="status-pill ${backendReady ? "pill-ok" : "pill-warn"}">
            ${backendReady ? "Backend Connected" : "Backend Unavailable"}
          </span>
        `;

        detectLocationBtn.disabled = false;
      },
      (error) => {
        let message = "Unable to retrieve your location.";
        if (error.code === 1) message = "Location permission denied.";
        if (error.code === 2) message = "Location unavailable.";
        if (error.code === 3) message = "Location request timed out.";

        locationStatus.textContent = message;
        detectLocationBtn.innerHTML =
          '<i class="fas fa-location-crosshairs"></i> Detect My Location';
        detectLocationBtn.disabled = false;
      }
    );
  });
}

// Button loading effect
function attachLoadingEffect(buttonId, defaultHTML, loadingHTML) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  btn.addEventListener("click", function () {
    this.innerHTML = loadingHTML;
    setTimeout(() => {
      this.innerHTML = defaultHTML;
    }, 1200);
  });
}

attachLoadingEffect(
  "startBtn",
  '<i class="fas fa-play"></i> Open Dashboard',
  '<i class="fas fa-spinner fa-spin"></i> Opening...'
);

attachLoadingEffect(
  "ctaBtn",
  '<i class="fas fa-arrow-right"></i> Go to Dashboard',
  '<i class="fas fa-spinner fa-spin"></i> Loading...'
);

// Prevent dashboard open without GPS
function checkLocation() {
  const lat = localStorage.getItem("lat");
  const lng = localStorage.getItem("lng");

  if (!lat || !lng) {
    alert("Please detect your location first.");
    return false;
  }

  return true;
}

window.checkLocation = checkLocation;