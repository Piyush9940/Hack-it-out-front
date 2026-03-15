 (function () {
      const tempCtx = document.getElementById("tempChart")?.getContext("2d");
      if (tempCtx) {
        new Chart(tempCtx, {
          type: "line",
          data: {
            labels: ["15 Jul", "16 Jul", "17 Jul", "18 Jul", "19 Jul"],
            datasets: [{
              label: "Temperature °C",
              data: [31.2, 32.0, 33.1, 32.5, 31.8],
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
      }

      const rainCtx = document.getElementById("rainChart")?.getContext("2d");
      if (rainCtx) {
        new Chart(rainCtx, {
          type: "bar",
          data: {
            labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
            datasets: [{
              label: "Rainfall (mm)",
              data: [12, 18, 5, 22, 15],
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
      }

      const coordDisplay = document.getElementById("coordDisplay");
      const gpsSpan = document.getElementById("gps-indicator");

      function randomizeCoord() {
        const baseLat = 25.3176;
        const baseLon = 82.9739;
        const newLat = (baseLat + (Math.random() * 0.01 - 0.005)).toFixed(4);
        const newLon = (baseLon + (Math.random() * 0.01 - 0.005)).toFixed(4);

        if (coordDisplay) {
          coordDisplay.innerHTML = `Latitude: ${newLat}<br>Longitude: ${newLon}`;
        }

        if (gpsSpan) {
          gpsSpan.innerText = `${newLat}°N, ${newLon}°E`;
        }
      }

      setInterval(randomizeCoord, 7000);

      function evaluateClimateRisk(data) {
        const { temperature, rainfall, windSpeed, pressure, humidity } = data;

        let riskType = "Normal";
        let severity = "Low";
        let message = "Weather conditions are stable. No extreme climate risks detected in the current dataset.";
        let advice = "No action needed";
        let bg = "linear-gradient(145deg, #eef8fc, #e3f2f9)";
        let color = "#23485a";
        let insight = "Temperature levels have shown a gradual increase over the past few days, while rainfall levels remain moderate. These conditions indicate a stable weather pattern with no significant environmental risks at the moment.";
        let currentOutput = "Stable Pattern";
        let alertLevel = "Low Risk";
        let airCondition = "Clear & Stable";
        let confidence = "High";

        if (temperature >= 38 && rainfall >= 60 && windSpeed >= 10) {
          riskType = "Mixed Climate Risk";
          severity = "Critical";
          message = "Multiple environmental indicators are outside safe ranges. Combined heat, rainfall, and wind conditions may create severe local climate hazards.";
          advice = "Issue public alert and monitor continuously";
          bg = "linear-gradient(145deg, #ffe4e4, #ffd1d1)";
          color = "#9f1f1f";
          insight = "A mixed-risk climate situation has been identified. Simultaneous extreme heat, rainfall, and wind may create rapidly changing environmental hazards.";
          currentOutput = "Critical Multi-Factor Risk";
          alertLevel = "Critical";
          airCondition = "Highly Unstable";
          confidence = "Very High";
        } else if (temperature >= 40) {
          riskType = "Heatwave Warning";
          severity = "High";
          message = "Temperature levels have exceeded safe thresholds. High temperatures may cause heat stress and dehydration risks.";
          advice = "Avoid outdoor exposure and stay hydrated";
          bg = "linear-gradient(145deg, #ffe9e2, #ffd8cb)";
          color = "#a63f20";
          insight = "Extreme temperature conditions indicate rising heat stress risk. Outdoor activities should be minimized during peak daytime hours.";
          currentOutput = "Heat Stress Alert";
          alertLevel = "High Risk";
          airCondition = "Hot & Dry";
          confidence = "High";
        } else if (rainfall >= 80) {
          riskType = "Flood Risk Alert";
          severity = "High";
          message = "Rainfall levels are significantly above average. Flooding may occur in low-lying or poorly drained areas.";
          advice = "Monitor water levels and avoid flood-prone zones";
          bg = "linear-gradient(145deg, #e3f3ff, #cfe9ff)";
          color = "#1d6696";
          insight = "Persistent high rainfall indicates overflow potential in vulnerable zones. Surface water accumulation and drainage pressure may increase rapidly.";
          currentOutput = "Heavy Rainfall Risk";
          alertLevel = "High Risk";
          airCondition = "Wet & Unstable";
          confidence = "High";
        } else if (rainfall <= 5 && temperature >= 35) {
          riskType = "Drought Risk Detected";
          severity = "Medium";
          message = "Rainfall levels remain critically low while heat persists, indicating dry environmental conditions and possible drought development.";
          advice = "Conserve water and monitor agricultural impact";
          bg = "linear-gradient(145deg, #fff4df, #ffe8bf)";
          color = "#9b6a18";
          insight = "Low rainfall combined with sustained heat suggests prolonged dryness. Water resource pressure and agricultural stress may gradually rise.";
          currentOutput = "Dryness Risk Rising";
          alertLevel = "Medium Risk";
          airCondition = "Dry & Warm";
          confidence = "Moderate";
        } else if (windSpeed >= 14 || pressure <= 99000 || humidity >= 90) {
          riskType = "Storm Risk";
          severity = "High";
          message = "Strong wind movement or abnormal pressure patterns suggest unstable atmospheric conditions and possible storm activity.";
          advice = "Avoid travel and secure exposed objects";
          bg = "linear-gradient(145deg, #edeaff, #dcd5ff)";
          color = "#5e46a1";
          insight = "Atmospheric instability is increasing due to intense wind flow and pressure abnormalities. Sudden storm development is possible.";
          currentOutput = "Storm Probability Elevated";
          alertLevel = "High Risk";
          airCondition = "Windy & Unstable";
          confidence = "High";
        }

        return {
          riskType,
          severity,
          message,
          advice,
          bg,
          color,
          insight,
          currentOutput,
          alertLevel,
          airCondition,
          confidence
        };
      }

      function updateMetricCards(data) {
        document.getElementById("tempStat").textContent = `${data.temperature}°C`;
        document.getElementById("windStat").textContent = `${data.windSpeed} m/s`;
        document.getElementById("pressureStat").textContent = `${data.pressure}`;
        document.getElementById("rainStat").textContent = `${data.rainfall} mm`;

        document.getElementById("tempMetric").textContent = `${data.temperature}°C`;
        document.getElementById("windMetric").textContent = `${data.windSpeed} m/s`;
        document.getElementById("pressureMetric").textContent = `${data.pressure} Pa`;
        document.getElementById("rainMetric").textContent = `${data.rainfall} mm`;

        document.getElementById("heroTemp").textContent = `${data.temperature}°C`;
      }

      function updateClimateRiskUI(data) {
        updateMetricCards(data);

        const result = evaluateClimateRisk(data);

        const riskMsgDiv = document.getElementById("riskMessage");
        const primaryRisk = document.getElementById("primaryRisk");
        const riskSeverity = document.getElementById("riskSeverity");
        const riskAdvice = document.getElementById("riskAdvice");
        const insightText = document.getElementById("insightText");
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

        let icon = "✅";
        if (result.riskType.includes("Heatwave")) icon = "🔥";
        else if (result.riskType.includes("Flood")) icon = "🌊";
        else if (result.riskType.includes("Drought")) icon = "🏜️";
        else if (result.riskType.includes("Storm")) icon = "⛈️";
        else if (result.riskType.includes("Mixed")) icon = "🚨";

        riskMsgDiv.style.background = result.bg;
        riskMsgDiv.style.color = result.color;
        riskMsgDiv.innerHTML = `
          <span style="font-weight:800;">${icon} ${result.riskType}</span><br>
          ${result.message}
        `;

        primaryRisk.textContent = result.riskType;
        riskSeverity.textContent = result.severity;
        riskAdvice.textContent = result.advice;
        insightText.textContent = result.insight;
        currentOutput.textContent = result.currentOutput;
        alertLevelText.textContent = result.alertLevel;
        airConditionText.textContent = result.airCondition;
        confidenceText.textContent = result.confidence;
        heroSummary.textContent = `Current analysis shows ${result.airCondition.toLowerCase()} conditions with ${result.alertLevel.toLowerCase()} across the monitored region.`;

        if (result.riskType === "Normal") {
          statusBadge.style.background = "#d9f3e5";
          statusBadge.style.color = "#146a49";
          statusBadge.innerHTML = `<i class="fas fa-circle-check"></i> Status: Stable`;
          statusDescription.textContent = "Temperature variation is moderate and rainfall levels remain normal. No immediate climate risks detected.";
          trendStatus.textContent = "Moderately Rising";
          rainPattern.textContent = "Within Safe Range";
          riskOutlook.textContent = "Currently Minimal";
        } else {
          statusBadge.style.background = "#fff1dc";
          statusBadge.style.color = "#a7590f";
          statusBadge.innerHTML = `<i class="fas fa-triangle-exclamation"></i> Status: Warning`;
          statusDescription.textContent = result.message;
          trendStatus.textContent = data.temperature >= 38 ? "Rapid Temperature Rise" : "Pattern Shift Detected";
          rainPattern.textContent = data.rainfall >= 80 ? "Heavy Rainfall Spike" : data.rainfall <= 5 ? "Below Normal" : "Unstable";
          riskOutlook.textContent = result.severity;
        }
      }

      window.simulateScenario = function(type) {
        let scenario = {};

        switch (type) {
          case "heatwave":
            scenario = {
              temperature: 43,
              rainfall: 8,
              windSpeed: 3,
              pressure: 101500,
              humidity: 30
            };
            break;

          case "flood":
            scenario = {
              temperature: 29,
              rainfall: 95,
              windSpeed: 8,
              pressure: 100200,
              humidity: 88
            };
            break;

          case "drought":
            scenario = {
              temperature: 37,
              rainfall: 2,
              windSpeed: 4,
              pressure: 101300,
              humidity: 25
            };
            break;

          case "storm":
            scenario = {
              temperature: 30,
              rainfall: 40,
              windSpeed: 16,
              pressure: 98500,
              humidity: 92
            };
            break;

          case "mixed":
            scenario = {
              temperature: 39,
              rainfall: 85,
              windSpeed: 12,
              pressure: 98900,
              humidity: 90
            };
            break;

          default:
            scenario = {
              temperature: 32,
              rainfall: 12,
              windSpeed: 4.1,
              pressure: 101200,
              humidity: 58
            };
        }

        updateClimateRiskUI(scenario);
      };

      const toggleBtn = document.getElementById("toggleRiskBtn");
      let warningState = false;

      if (toggleBtn) {
        toggleBtn.addEventListener("click", function () {
          if (!warningState) {
            simulateScenario("heatwave");
            warningState = true;
          } else {
            simulateScenario("normal");
            warningState = false;
          }
        });
      }

      const refreshBtn = document.getElementById("refreshInsightBtn");
      const insightScenarios = ["normal", "heatwave", "flood", "drought", "storm", "mixed"];
      let insightIndex = 0;

      if (refreshBtn) {
        refreshBtn.addEventListener("click", function () {
          insightIndex = (insightIndex + 1) % insightScenarios.length;
          simulateScenario(insightScenarios[insightIndex]);
        });
      }

      simulateScenario("normal");
      console.log("Responsive dynamic professional dashboard ready");
    })();