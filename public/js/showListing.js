// Displaying Map Functionality
console.log(coordinatesArr);

maptilersdk.config.apiKey = maptiler_api_key;

const map = new maptilersdk.Map({
  container: "map",
  style: "streets-v2",
  center: coordinatesArr,
  zoom: 9,
});

const marker = new maptilersdk.Marker().setLngLat(coordinatesArr).addTo(map);
