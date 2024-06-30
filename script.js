// Initialize the map
var map = L.map('map').setView([54.5, -3], 5);

// Load and display tile layer on the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Define colors for different parties
const partyColors = {
    'Conservatives': '#0575C9',
    'Labour': '#DC241F',
    'Liberal Democrats': '#FAA61A',
    'Green': '#6AB023',
    'Reform': '#12B6CF',
    'Plaid Cymru': '#3F8428',
    'SNP': '#FDF38E',
    'Others': '#808080'
};

// Load constituency data and GeoJSON
d3.csv('YouGov_2024_general_election_MRP_2.csv').then(data => {
    // Fetch GeoJSON for UK constituencies
    fetch('UK_Constituencies.geojson')
    .then(response => response.json())
    .then(geoData => {
        // Merge data with GeoJSON
        geoData.features.forEach(feature => {
            let constituency = data.find(row => row.const === feature.properties.constituency);
            if (constituency) {
                feature.properties.winner = constituency.WinnerGE2024;
            }
        });

        // Define style for each constituency
        function style(feature) {
            return {
                fillColor: partyColors[feature.properties.winner] || '#808080',
                weight: 1,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.7
            };
        }

        // Define what happens on each feature (constituency)
        function onEachFeature(feature, layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature
            });
            // Add pop-up information
            layer.bindPopup(`<strong>${feature.properties.constituency}</strong><br>${feature.properties.winner}`);
        }

        function highlightFeature(e) {
            var layer = e.target;

            layer.setStyle({
                weight: 3,
                color: '#666',
                fillOpacity: 0.7
            });

            layer.bringToFront();
        }

        function resetHighlight(e) {
            geojson.resetStyle(e.target);
        }

        function zoomToFeature(e) {
            map.fitBounds(e.target.getBounds());
        }

        // Add GeoJSON layer to the map with styles and interactivity
        var geojson;
        geojson = L.geoJSON(geoData, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);
    });
});
