import{__assign as e}from"../../../node_modules/tslib/tslib.es6.js";import r from"../../Layer/JSDCLayer.js";import{geoJSON as t}from"leaflet";import{omit as o}from"lodash";var a=function(a,m){var i={type:"FeatureCollection",features:a.map((function(e){return{geometry:e.geometry,type:"Feature",properties:o(e,["geometry"])}}))},n=t(i),s=new r({id:m.id,description:e(e({},m),{name:m.name})});return s.setInstance(n),s};export{a as default};
//# sourceMappingURL=createGeoJSONLayer.js.map