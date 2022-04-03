import{__awaiter as e,__generator as t,__assign as n}from"../../../node_modules/tslib/tslib.es6.js";import{uniqueId as r}from"lodash";import i,{useRef as o,useState as a,useEffect as c}from"react";import l from"./WeatherCard.js";import{getTwoDays as s}from"./src/api.js";import u from"./src/Weather.js";var m=function(){function e(e,t){this.id=r(),this.county=e,this.town=t}return Object.defineProperty(e.prototype,"fullName",{get:function(){return"".concat(this.county," ").concat(this.town)},enumerable:!1,configurable:!0}),e}(),f=function(r){var f=r.locations,d=r.token,p=r.onSelectLocation,v=void 0===p?function(){return null}:p,h=o(null),g=a(!0),N=g[0],E=g[1],w=a(!1),b=w[0],y=w[1],j=a(f.map((function(e){return new m(e.county,e.town)})))[0],k=a(j[0]),C=k[0],W=k[1],x=a([]),L=x[0],q=x[1],D=a({}),O=D[0],P=D[1],S=a(),_=S[0],z=S[1];return c((function(){e(void 0,void 0,void 0,(function(){var e,r,i,o,a,c;return t(this,(function(l){switch(l.label){case 0:e=[],r={},i=function(i){var o,a,c,l,m;return t(this,(function(t){switch(t.label){case 0:return[4,s(i.county,i.town,d)];case 1:return o=t.sent(),a=new u(i.id,o),e.push(a),c=a.wx.getElements(),l=a.temp.getElements(),m=a.ci.getElements(),r[i.id]=c.map((function(e,t){var r=n({},e);return r.temp=l[t].description,r.ci=m[t].value,r})),[2]}}))},o=0,a=j,l.label=1;case 1:return o<a.length?(c=a[o],[5,i(c)]):[3,4];case 2:l.sent(),l.label=3;case 3:return o++,[3,1];case 4:return P(r),z(e),q(r[C.id]),E(!1),[2]}}))}))}),[]),i.createElement("div",{className:"rui-WeatherDialogContent"},i.createElement("div",{className:"select",ref:h},i.createElement("span",{className:"selected",onClick:function(){return y(!b)}},C.fullName,i.createElement("div",{className:"pointer"},"▼")),i.createElement("div",{className:"option ".concat(b||"hide")},j.map((function(e){return i.createElement("div",{key:e.fullName,className:"item",onClick:function(){return function(e){W(e),q(O[e.id]);var t=null==_?void 0:_.find((function(t){return t.name===e.id}));y(!1),t&&v([t.location.lat,t.location.lon])}(e)}},e.fullName)})))),N&&i.createElement("img",{className:"loading",src:require("./processing.gif"),alt:"source not found"}),i.createElement("div",{className:"weather-card-container"},L.map((function(e,t){return i.createElement(l,{key:t,title:e.time,img:e.img,degree:e.temp,description:e.description,infoList:[e.ci],imgNum:e.value})}))))};export{f as default};
//# sourceMappingURL=WeatherDialogContent.js.map