import{useState as t}from"react";var i=function(i){var n=t(i[0]),o=n[0],c=n[1],a=t(void 0),r=a[0],e=a[1],d=function(t){if(void 0!==t){var n=i.find((function(i){return i.id===t}));n?(c(n),e(t)):console.warn("id: ".concat(t," not found"))}else e(void 0)};return{switchDatas:i,activeData:o,activeId:r,switchById:d,forceSwitchActiveId:function(t){e(t),d(t)}}};export{i as default};
//# sourceMappingURL=useSwitch.js.map
