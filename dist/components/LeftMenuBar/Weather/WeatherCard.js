import e from"react";import{baseUrl as t}from"../../../icon/index.js";var a=function(a){return e.createElement("div",{className:"rui-WeatherCard"},e.createElement("div",{className:"time"},a.title),e.createElement("div",{className:"description"},e.createElement("p",null,a.description),a.infoList.map((function(t,a){return e.createElement("p",{key:a},t)}))),e.createElement("div",{className:"main-info"},e.createElement("div",{className:"degree"},a.degree,"°C"),e.createElement("img",{src:"".concat(t,"/weather/value_").concat(a.imgNum,".png"),alt:"source not found"})))};export{a as default};
//# sourceMappingURL=WeatherCard.js.map