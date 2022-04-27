import{__awaiter as e,__generator as t,__spreadArray as r}from"../../node_modules/tslib/tslib.es6.js";import{omit as o}from"lodash";import i from"./ApiProvider.js";import n from"./createLayer/createTileLayer.js";import a from"./createLayer/createGeoJSONLayer.js";import s from"../utils/Event.js";var u=function(){function u(e){this.gisDataLoadEvent=new s,this.config=e.config,this.api=new i(this.config)}return Object.defineProperty(u.prototype,"eventId",{get:function(){return this.config.eventId},enumerable:!1,configurable:!0}),Object.defineProperty(u.prototype,"baseApiUrl",{get:function(){return this.config.baseApiUrl},enumerable:!1,configurable:!0}),Object.defineProperty(u.prototype,"configProvider",{get:function(){return this.config},enumerable:!1,configurable:!0}),Object.defineProperty(u.prototype,"apiProvider",{get:function(){return this.api},enumerable:!1,configurable:!0}),u.prototype.loadGisData=function(){return e(this,void 0,void 0,(function(){var e,i;return t(this,(function(t){switch(t.label){case 0:return[4,this.apiProvider.getLayers()];case 1:return e=t.sent(),i=[],e.forEach((function(e){var t=o(e,["Basemaps","LineFeatures","PointFeatures","PolygonFeatures"]),r=e.LineFeatures,s=e.PointFeatures,u=e.PolygonFeatures,p=e.Basemaps,c=e.type,f=r.length>0&&"line"===c,l=s.length>0&&"point"===c,g=u.length>0&&"polygon"===c,h=p&&"image"===c;f&&i.push(a(r,t)),l&&i.push(a(s,t)),g&&i.push(a(u,t)),h&&i.push(n(e.name,null==p?void 0:p.url))})),[2,r([],i,!0)]}}))}))},u}();export{u as default};
//# sourceMappingURL=index.js.map
