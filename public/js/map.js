mapboxgl.accessToken = map_token;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: [74.2403, 21.3701], // starting position [lng, lat]
    zoom: 9 // starting zoom
});