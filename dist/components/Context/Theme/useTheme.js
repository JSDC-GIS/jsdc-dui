import{__assign as r}from"../../../node_modules/tslib/tslib.es6.js";import t from"chroma-js";var a={"--dui-primary":"#F1C385","--dui-secondary":"rgb(42, 125, 250)","--dui-accent":"red","--dui-bg-primary":"white","--dui-bg-secondary":"rgb(42, 125, 250)","--dui-bg-accent":"#F1C385","--dui-text-primary":"#1f1f1f","--dui-text-gray":"#878787"},n=function(n){var o=r(r({},a),n),i=r(r(r({},o),function(){var r={},a=[0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95],n=function(n){var i=o[n];a.forEach((function(a){var o="".concat(n,"--opacity-").concat(a);r[o]=t(i).alpha(a/100).hex()}))};for(var i in o)n(i);return r}()),function(){var r={},a=[0,10,20,30,40,50,60,70,80,90],n=function(n){var i=o[n];a.forEach((function(a){var o="".concat(n,"--brighten-").concat(a);r[o]=t.scale([i,"white"])(a/100).hex()}))};for(var i in o)n(i);return r}());for(var c in i)document.documentElement.style.setProperty(c,i[c])};export{n as default,a as defaultStyle};
//# sourceMappingURL=useTheme.js.map
