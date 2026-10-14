var n=new WeakMap,e=function(e){n.has(e)||(n.set(e,!1),e.on("movestart",function(){return n.set(e,!0)}),e.on("moveend",function(){return n.set(e,!1)}))},t=function(e){return!0===n.get(e)},o=function(n,e){t(n)?n.once("moveend",e):e()};export{t as isMapMoving,o as runWhenMapIdle,e as trackMapMotion};
//# sourceMappingURL=mapMotion.js.map
