// Displaying Map Functionality
maptilersdk.config.apiKey = maptiler_api_key;

const map = new maptilersdk.Map({
    container: 'map',
    style: "streets-v2",
    center: coordinates, 
    zoom: 9, 
});

const marker = new maptilersdk.Marker()
    .setLngLat(coordinates)
    .addTo(map);