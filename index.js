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
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("show");
      });
    }, { threshold: 0.18 });

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
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) startCounters();
      });
    }, { threshold: 0.35 });

    if (statsSection) statsObserver.observe(statsSection);

    // Feature tabs
    const tabs = document.querySelectorAll(".feature-tab");
    const panels = document.querySelectorAll(".feature-panel");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        panels.forEach((p) => p.classList.remove("active"));

        tab.classList.add("active");
        document.getElementById(tab.dataset.target).classList.add("active");
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
      question.addEventListener("click", () => {
        const isActive = item.classList.contains("active");
        faqItems.forEach((faq) => faq.classList.remove("active"));
        if (!isActive) item.classList.add("active");
      });
    });

    // Simulated location interaction
    const detectLocationBtn = document.getElementById("detectLocationBtn");
    const locationStatus = document.getElementById("locationStatus");
    const statusPanel = document.getElementById("statusPanel");

    detectLocationBtn.addEventListener("click", () => {
      detectLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Detecting...';

      setTimeout(() => {
        locationStatus.textContent =
          "Location detected successfully. Demo coordinates: 25.3176, 82.9739. The dashboard can now be centered around this region.";
        detectLocationBtn.innerHTML = '<i class="fas fa-check-circle"></i> Location Detected';

        statusPanel.innerHTML = `
          <span class="status-pill pill-ok">GPS Active</span>
          <span class="status-pill pill-info">Lat: 25.3176</span>
          <span class="status-pill pill-info">Lng: 82.9739</span>
          <span class="status-pill pill-warn">Dashboard Ready</span>
        `;
      }, 1200);
    });

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