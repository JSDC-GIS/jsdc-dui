import a from"../../Layer/JSDCLayer.js";import{TileLayer as e}from"leaflet";import{uniqueId as o}from"lodash";var r=function(r,t){var m=new e(t,{maxZoom:20}),n=new a({id:"".concat(r,"_").concat(o("basemap")),description:{name:r,type:"image"}});return n.setInstance(m),n};export{r as default};
//# sourceMappingURL=createTileLayer.js.map
