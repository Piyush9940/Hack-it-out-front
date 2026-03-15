(function () {
    let map;
    let heatLayer;
    const API_BASE_URL = "https://avinashmaharoliya-hac-it.hf.space";

    async function updateHeatmapStream(lat, lng) {
        try {
            const response = await fetch(`${API_BASE_URL}//heatmap-data`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ latitude: lat, longitude: lng }),
            });
            const data = await response.json();

            if (data.points && data.points.length > 0) {
                if (heatLayer) map.removeLayer(heatLayer);

                // This L.heatLayer command is what turns squares into blobs
                heatLayer = L.heatLayer(data.points, {
                    radius: 50, 
                    blur: 35,
                    maxZoom: 5,
                    minOpacity: 0.4,
                    gradient: {
                        0.1: "#2b6c9e", // Cold Blue
                        0.3: "#44aa88", // Mild Green
                        0.6: "#f7c35c", // Yellow
                        0.8: "#df7b2d", // Orange
                        1.0: "#d7191c"  // Hot Red 
                    }
                }).addTo(map);
            }
        } catch (error) {
            console.error("Heatmap Stream Error:", error);
        }
    }

    window.addEventListener("load", function () {
        const startLat = 25.3176;
        const startLng = 82.9739;

        map = L.map("heatmapLeaflet").setView([startLat, startLng], 12);

        L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
            attribution: '&copy; CartoDB'
        }).addTo(map);

        updateHeatmapStream(startLat, startLng);

        map.on("moveend", function () {
            const center = map.getCenter();
            updateHeatmapStream(center.lat, center.lng);
            const navCoord = document.getElementById("navCoord");
            if (navCoord) {
                navCoord.innerHTML = `<i class="fas fa-map-pin"></i> <span>${center.lat.toFixed(4)}°N, ${center.lng.toFixed(4)}°E</span>`;
            }
        });

        // Your original long-form UI Pin
        const userIcon = L.divIcon({
            html: `<div class="pin-marker"><i class="fas fa-street-view"></i></div>`,
            className: "custom-user-marker",
            iconSize: [52, 52],
            iconAnchor: [26, 46]
        });
        L.marker([startLat, startLng], { icon: userIcon }).addTo(map).bindPopup("<b>Home Location</b>");
        
        L.control.scale({ imperial: false }).addTo(map);
        setTimeout(() => map.invalidateSize(), 400);
    });
})();