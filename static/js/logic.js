var myMap = L.map("map", {
    center: [45.5570, -3.1632],
    zoom: 2.5
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(myMap);

function markerSize(population) {
    return population / 40;
}
function getColor(m) {
    return m >= 8 ? '#FF0000' :
        m >= 7 ? '#FF3600' :
            m >= 6.1 ? '#FF8700' :
                m >= 5.5 ? '#FFC100' :
                    m >= 2.5 ? '#00F7FF' :
                        'white';
}

(async function () {
    const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
    const response = await d3.json(url);
    console.log(response);
    const feat = response.features;
    console.log(response.features[0].geometry)
    feat.forEach(data => {
        let location = data.geometry
        let props = data.properties
        var magns = props.mag
        let color = "";
        if (props.mag >= 8) {
            color = "#FF0000";
        }
        else if (props.mag >= 7) {
            color = "#FF3600";
        }
        else if (props.mag >= 6.1) {
            color = "#FF8700";
        }
        else if (props.mag >= 5.5) {
            color = "#FFC100";
        }
        else if (props.mag >= 2.5) {
            color = "#00F7FF";
        }
        else {
            color = "white";
        }
        if (location) {
            let coord = [location.coordinates[1], location.coordinates[0]]
            return L.circle(coord, {
                radius: markerSize(props.mag * 1000000),
                color: "white",
                fillColor: color,
                fillOpacity: 0.75,
                weight: 1

            }).bindPopup("<h1>" + props.title + "</h1> <hr> <h3>Magnitude: " + props.mag + "</h3>").addTo(myMap);
        }
    })
        const legend = L.control({ position: "bottomright" });
        legend.onAdd = function() {
            const div = L.DomUtil.create("div", "info legend");
            labels = ["Magnitude"];
            mags = ["0-2.4","2.5-5.4","5.5-6","6.1-6.9","7-7.9",">=8"]
            colors = [1,4,5.7,6.5,7.5,8.9]

            for (var i = 0; i < mags.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor(colors[i]) + '"></i> ' +
                    (mags[i] ? mags[i] + '<br>' : '+');
            }
    
            div.innerHTML += "<ul>" + labels.join("") + "</ul>";
            return div;
        };
    
        // Adding legend to the map
        legend.addTo(myMap);
})()


