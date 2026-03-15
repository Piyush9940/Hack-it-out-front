(() => {
  const API_BASE = "https://hack-it-out-s7yt.onrender.com/api/weather";

  let tempChartInstance = null;
  let rainChartInstance = null;

  const coordDisplay = document.getElementById("coordDisplay");
  const gpsSpan = document.getElementById("gps-indicator");

  const tempFooter = document.querySelector("#tempChart")?.closest(".card")?.querySelector(".chart-footer");
  const rainFooter = document.querySelector("#rainChart")?.closest(".card")?.querySelector(".chart-footer");

  function formatNumber(value, digits = 1) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return "N/A";
    return Number(value).toFixed(digits);
  }

  function formatDateLabel(dateValue) {
    if (!dateValue) return "N/A";
    const d = new Date(dateValue);
    if (Number.isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short"
    });
  }

  function formatWeekLabel(item, index) {
    if (item?.week_start) return formatDateLabel(item.week_start);
    return `Week ${index + 1}`;
  }

  function setLocation(lat, lng) {
    const latText = `${Number(lat).toFixed(4)}°N`;
    const lngText = `${Number(lng).toFixed(4)}°E`;

    if (coordDisplay) {
      coordDisplay.innerHTML = `Latitude: ${Number(lat).toFixed(4)}<br>Longitude: ${Number(lng).toFixed(4)}`;
    }

    if (gpsSpan) {
      gpsSpan.textContent = `${latText}, ${lngText}`;
    }
  }

  function updateMetricCards(temp, rain) {
    const temperature = temp?.temperature_c;
    const windSpeed = temp?.wind_speed_ms;
    const pressure = temp?.pressure_pa;
    const rainfall = rain?.precipitation_mm;

    const map = {
      tempStat: temperature != null ? `${formatNumber(temperature)}°C` : "N/A",
      windStat: windSpeed != null ? `${formatNumber(windSpeed)} m/s` : "N/A",
      pressureStat: pressure != null ? `${Math.round(Number(pressure))}` : "N/A",
      rainStat: rainfall != null ? `${formatNumber(rainfall)} mm` : "N/A",

      tempMetric: temperature != null ? `${formatNumber(temperature)}°C` : "N/A",
      windMetric: windSpeed != null ? `${formatNumber(windSpeed)} m/s` : "N/A",
      pressureMetric: pressure != null ? `${Math.round(Number(pressure))} Pa` : "N/A",
      rainMetric: rainfall != null ? `${formatNumber(rainfall)} mm` : "N/A",

      heroTemp: temperature != null ? `${formatNumber(temperature)}°C` : "N/A"
    };

    Object.entries(map).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    });
  }

  function getRiskMeta(risk) {
    const raw =
      risk?.status ||
      risk?.level ||
      risk?.riskLevel ||
      risk?.type ||
      "Normal";

    const riskText = String(raw).toLowerCase();

    if (riskText.includes("heat")) {
      return {
        icon: "🔥",
        title: "Heatwave Warning",
        severity: "High",
        badgeHtml: `<i class="fas fa-triangle-exclamation"></i> Status: Warning`
      };
    }

    if (riskText.includes("flood")) {
      return {
        icon: "🌊",
        title: "Flood Risk Alert",
        severity: "High",
        badgeHtml: `<i class="fas fa-triangle-exclamation"></i> Status: Warning`
      };
    }

    if (riskText.includes("drought")) {
      return {
        icon: "🏜️",
        title: "Drought Risk Detected",
        severity: "Medium",
        badgeHtml: `<i class="fas fa-triangle-exclamation"></i> Status: Warning`
      };
    }

    if (riskText.includes("storm")) {
      return {
        icon: "⛈️",
        title: "Storm Risk",
        severity: "High",
        badgeHtml: `<i class="fas fa-triangle-exclamation"></i> Status: Warning`
      };
    }

    if (riskText.includes("mixed") || riskText.includes("critical")) {
      return {
        icon: "🚨",
        title: "Mixed Climate Risk",
        severity: "Critical",
        badgeHtml: `<i class="fas fa-triangle-exclamation"></i> Status: Warning`
      };
    }

    return {
      icon: "✅",
      title: "Normal",
      severity: "Low",
      badgeHtml: `<i class="fas fa-circle-check"></i> Status: Stable`
    };
  }

  function updateRiskUI(risk, latestTemperature, latestRainfall) {
    const riskMessage = document.getElementById("riskMessage");
    const primaryRisk = document.getElementById("primaryRisk");
    const riskSeverity = document.getElementById("riskSeverity");
    const riskAdvice = document.getElementById("riskAdvice");
    const currentOutput = document.getElementById("currentOutput");
    const alertLevelText = document.getElementById("alertLevelText");
    const airConditionText = document.getElementById("airConditionText");
    const confidenceText = document.getElementById("confidenceText");
    const heroSummary = document.getElementById("heroSummary");
    const statusBadge = document.getElementById("statusBadge");
    const statusDescription = document.getElementById("statusDescription");
    const trendStatus = document.getElementById("trendStatus");
    const rainPattern = document.getElementById("rainPattern");
    const riskOutlook = document.getElementById("riskOutlook");

    const meta = getRiskMeta(risk);

    const message =
      risk?.message ||
      risk?.summary ||
      risk?.description ||
      "Weather conditions are stable. No extreme climate risks detected in the current dataset.";

    const recommendation =
      risk?.advice ||
      risk?.recommendation ||
      "Continue monitoring current environmental conditions.";

    const confidence =
      risk?.confidence ||
      "High";

    const tempValue = latestTemperature?.temperature_c;
    const rainValue = latestRainfall?.precipitation_mm;

    if (riskMessage) {
      riskMessage.innerHTML = `
        <span style="font-weight:800;">${meta.icon} ${meta.title}</span><br>
        ${message}
      `;
    }

    if (primaryRisk) primaryRisk.textContent = meta.title;
    if (riskSeverity) riskSeverity.textContent = meta.severity;
    if (riskAdvice) riskAdvice.textContent = recommendation;
    if (currentOutput) currentOutput.textContent = meta.title;
    if (alertLevelText) alertLevelText.textContent = meta.severity === "Low" ? "Low Risk" : `${meta.severity} Risk`;
    if (confidenceText) confidenceText.textContent = confidence;

    if (airConditionText) {
      if (meta.title.includes("Heat")) airConditionText.textContent = "Hot & Dry";
      else if (meta.title.includes("Flood")) airConditionText.textContent = "Wet & Unstable";
      else if (meta.title.includes("Storm")) airConditionText.textContent = "Windy & Unstable";
      else if (meta.title.includes("Drought")) airConditionText.textContent = "Dry & Warm";
      else if (meta.title.includes("Mixed")) airConditionText.textContent = "Highly Unstable";
      else airConditionText.textContent = "Clear & Stable";
    }

    if (heroSummary) {
      heroSummary.textContent =
        message.length > 140 ? `${message.slice(0, 140)}...` : message;
    }

    if (statusBadge) {
      if (meta.severity === "Low") {
        statusBadge.style.background = "#d9f3e5";
        statusBadge.style.color = "#146a49";
      } else {
        statusBadge.style.background = "#fff1dc";
        statusBadge.style.color = "#a7590f";
      }
      statusBadge.innerHTML = meta.badgeHtml;
    }

    if (statusDescription) statusDescription.textContent = message;
    if (trendStatus) trendStatus.textContent = tempValue >= 38 ? "Rapid Temperature Rise" : "Moderately Rising";
    if (rainPattern) {
      if (rainValue >= 80) rainPattern.textContent = "Heavy Rainfall Spike";
      else if (rainValue <= 5) rainPattern.textContent = "Below Normal";
      else rainPattern.textContent = "Within Safe Range";
    }
    if (riskOutlook) riskOutlook.textContent = meta.severity === "Low" ? "Currently Minimal" : meta.severity;
  }

  function updateInsightUI(insight) {
    const insightText = document.getElementById("insightText");

    let text = "No AI insight available right now.";

    if (typeof insight === "string") {
      text = insight;
    } else if (insight?.message) {
      text = insight.message;
    } else if (insight?.summary) {
      text = insight.summary;
    } else if (insight?.insight) {
      text = insight.insight;
    }

    if (insightText) insightText.textContent = text;
  }

  function renderTempFooter(trend) {
    if (!tempFooter) return;

    if (!trend?.length) {
      tempFooter.innerHTML = `<span class="data-chip">No temperature trend data available</span>`;
      return;
    }

    tempFooter.innerHTML = trend
      .slice(0, 5)
      .map(item => {
        const label = formatDateLabel(item.time || item.createdAt);
        const value = item.temperature_c != null ? `${formatNumber(item.temperature_c)}°C` : "N/A";
        return `<span class="data-chip">📅 ${label} → ${value}</span>`;
      })
      .join("");
  }

  function renderRainFooter(trend) {
    if (!rainFooter) return;

    if (!trend?.length) {
      rainFooter.innerHTML = `<span class="data-chip">No rainfall trend data available</span>`;
      return;
    }

    rainFooter.innerHTML = trend
      .slice(0, 5)
      .map((item, index) => {
        const label = formatWeekLabel(item, index);
        const value = item.precipitation_mm != null ? `${formatNumber(item.precipitation_mm)} mm` : "N/A";
        return `<span class="data-chip">${label} → ${value}</span>`;
      })
      .join("");
  }

  function renderTemperatureChart(trend) {
    const tempCanvas = document.getElementById("tempChart");
    if (!tempCanvas) return;

    const labels = trend?.length
      ? trend.map(item => formatDateLabel(item.time || item.createdAt))
      : ["No Data"];

    const values = trend?.length
      ? trend.map(item => Number(item.temperature_c) || 0)
      : [0];

    if (tempChartInstance) tempChartInstance.destroy();

    tempChartInstance = new Chart(tempCanvas.getContext("2d"), {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Temperature °C",
          data: values,
          borderColor: "#d96c2b",
          backgroundColor: "rgba(247,179,126,0.25)",
          tension: 0.35,
          fill: true,
          pointBackgroundColor: "#c05e20",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#163e51",
            padding: 12,
            cornerRadius: 12,
            displayColors: false
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#557386" }
          },
          y: {
            grid: { color: "rgba(20, 72, 95, 0.08)" },
            ticks: { color: "#557386" }
          }
        }
      }
    });

    renderTempFooter(trend);
  }

  function renderRainChart(trend) {
    const rainCanvas = document.getElementById("rainChart");
    if (!rainCanvas) return;

    const labels = trend?.length
      ? trend.map((item, index) => formatWeekLabel(item, index))
      : ["No Data"];

    const values = trend?.length
      ? trend.map(item => Number(item.precipitation_mm) || 0)
      : [0];

    if (rainChartInstance) rainChartInstance.destroy();

    rainChartInstance = new Chart(rainCanvas.getContext("2d"), {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Rainfall (mm)",
          data: values,
          backgroundColor: [
            "#4ea3cb",
            "#3b95c0",
            "#76bbdb",
            "#2d7ea7",
            "#5caed3"
          ],
          borderRadius: 14,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#163e51",
            padding: 12,
            cornerRadius: 12,
            displayColors: false
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#557386" }
          },
          y: {
            grid: { color: "rgba(20, 72, 95, 0.08)" },
            ticks: { color: "#557386" }
          }
        }
      }
    });

    renderRainFooter(trend);
  }

  async function fetchDashboard(lat, lng) {
    const res = await fetch(`${API_BASE}/dashboard?lat=${lat}&lng=${lng}`);
    const result = await res.json();

    if (!res.ok || !result.success) {
      throw new Error(result.error || result.message || "Failed to load dashboard data");
    }

    return result.data;
  }

  async function loadDashboard(lat, lng) {
    try {
      setLocation(lat, lng);

      const data = await fetchDashboard(lat, lng);

      updateMetricCards(data.latestTemperature, data.latestRainfall);
      updateRiskUI(data.risk, data.latestTemperature, data.latestRainfall);
      updateInsightUI(data.insight);
      renderTemperatureChart(data.temperatureTrend || data.next7DaysTemperatureTrend || []);
      renderRainChart(data.rainfallTrend || data.next7DaysRainfallTrend || []);

      window.__weatherDashboardData = data;
    } catch (error) {
      console.error("Dashboard load failed:", error);

      const insightText = document.getElementById("insightText");
      const riskMessage = document.getElementById("riskMessage");

      if (insightText) {
        insightText.textContent = "Backend data could not be loaded right now. Please try again.";
      }

      if (riskMessage) {
        riskMessage.innerHTML = `
          <span style="font-weight:800;">⚠️ Data Load Error</span><br>
          Unable to fetch live climate data from the backend.
        `;
      }
    }
  }

  function loadWithGeolocation() {
    if (!navigator.geolocation) {
      loadDashboard(25.3176, 82.9739);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        loadDashboard(lat, lng);
      },
      () => {
        loadDashboard(25.3176, 82.9739);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }

  window.simulateScenario = function(type) {
    const fakeMap = {
      normal: {
        status: "Normal",
        message: "Weather conditions are stable. No extreme climate risks detected in the current dataset.",
        recommendation: "No action needed",
        confidence: "High"
      },
      heatwave: {
        status: "Heatwave Warning",
        message: "Temperature levels have exceeded safe thresholds. High temperatures may cause heat stress and dehydration risks.",
        recommendation: "Avoid outdoor exposure and stay hydrated",
        confidence: "High"
      },
      flood: {
        status: "Flood Risk Alert",
        message: "Rainfall levels are significantly above average. Flooding may occur in low-lying or poorly drained areas.",
        recommendation: "Monitor water levels and avoid flood-prone zones",
        confidence: "High"
      },
      drought: {
        status: "Drought Risk Detected",
        message: "Rainfall levels remain critically low while heat persists, indicating dry environmental conditions and possible drought development.",
        recommendation: "Conserve water and monitor agricultural impact",
        confidence: "Moderate"
      },
      storm: {
        status: "Storm Risk",
        message: "Strong wind movement or abnormal pressure patterns suggest unstable atmospheric conditions and possible storm activity.",
        recommendation: "Avoid travel and secure exposed objects",
        confidence: "High"
      },
      mixed: {
        status: "Mixed Climate Risk",
        message: "Multiple environmental indicators are outside safe ranges. Combined heat, rainfall, and wind conditions may create severe local climate hazards.",
        recommendation: "Issue public alert and monitor continuously",
        confidence: "Very High"
      }
    };

    const baseTemp = window.__weatherDashboardData?.latestTemperature || {};
    const baseRain = window.__weatherDashboardData?.latestRainfall || {};

    updateRiskUI(fakeMap[type] || fakeMap.normal, baseTemp, baseRain);
    updateInsightUI((fakeMap[type] || fakeMap.normal).message);
  };

  const toggleBtn = document.getElementById("toggleRiskBtn");
  let warningState = false;

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      if (!warningState) {
        window.simulateScenario("heatwave");
        warningState = true;
      } else {
        window.simulateScenario("normal");
        warningState = false;
      }
    });
  }

  const refreshBtn = document.getElementById("refreshInsightBtn");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      loadWithGeolocation();
    });
  }

  loadWithGeolocation();
})();