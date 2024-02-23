mapboxgl.accessToken = map_token;


const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listingitem.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

// console.log("Coordinates: ",coordinates)

const marker1 = new mapboxgl.Marker({color: "red"})
        .setLngLat(listingitem.geometry.coordinates)
        .setPopup (new mapboxgl.Popup({offset: 25}).setHTML(`<h4>${listingitem.location}</h4><p>This is the exact location</p>`))
        .addTo(map);


