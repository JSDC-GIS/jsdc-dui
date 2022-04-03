import{useState as r,useEffect as n}from"react";var t=function(t){var e=r([]),o=e[0],a=e[1];return n((function(){var r=t.Controller.get("Layer"),n=r.onUpdateEvent.addEventListener((function(){return a(r.layerInfos)}));return function(){n&&n()}}),[]),{layerInfos:o}};export{t as default};
//# sourceMappingURL=useLayerInfos.js.map
