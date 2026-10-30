/**
 * 跑在 jsdom：pathname 預設是 '/'，所以 scoped key 是 'i18nextLng@/'。
 * i18n 在 import 時就 init，要測「init 讀到 localStorage」得用 isolateModules 重新載入。
 */
declare const KEY = "i18nextLng@/";
declare const load: () => typeof import("./config");
