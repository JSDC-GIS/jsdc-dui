import e from"../../Layer/JSDCLayer.js";import{TileLayer as a}from"leaflet";import{uniqueId as r}from"lodash";var t=function(t,o){var n=new a(o),m=new e({id:"".concat(t,"_").concat(r("basemap")),description:{name:t,type:"image"}});return m.setInstance(n),m};export{t as default};
//# sourceMappingURL=createTileLayer.js.map
