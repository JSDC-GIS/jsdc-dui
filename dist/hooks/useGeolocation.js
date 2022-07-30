import{useState as t,useEffect as o}from"react";import n from"../JSDC/utils/Event.js";var a=function(){var a=t(new n)[0],r=t(),i=r[0],e=r[1];return o((function(){navigator.geolocation.watchPosition((function(t){var o={lat:t.coords.latitude,lng:t.coords.longitude};e(o),a.raise(o)}))}),[]),{latLng:i,changeEvent:a}};export{a as default};
//# sourceMappingURL=useGeolocation.js.map
