import{__awaiter as e,__generator as r}from"../../../node_modules/tslib/tslib.es6.js";import o,{createContext as a,useState as i,useEffect as t}from"react";import n from"../index.js";import s from"../../../hooks/useGeolocation.js";var d=a({}),l=function(a){var l=a.children,c=a.Jsdc,m=a.layersHiddenFromUI,u=a.layersShowOnMapByDefault,f=a.layerNameOrder,v=void 0===f?[]:f,h=a.articleParser,p=a.config,y=i(new n({config:p,layerNameOrder:v,articleParser:h}))[0],g=s();t((function(){e(void 0,void 0,void 0,(function(){var e;return r(this,(function(r){switch(r.label){case 0:return e=c.Controller.get("Layer"),[4,y.loadGisData()];case 1:return r.sent().forEach((function(r){return e.add(r,{hidden:m.includes(r.description.name)})})),e.showByNames(u,!0),y.gisDataLoadEvent.raise(),[2]}}))}))}),[]);var w={dgw:y,geolocation:g};return o.createElement(d.Provider,{value:w},l)};l.displayName="DguidewalksProvider";export{d as DguidewalksContext,l as DguidewalksProvider};
//# sourceMappingURL=index.js.map
