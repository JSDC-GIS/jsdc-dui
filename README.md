# JSDC DUI

## Start Local Development

```bash
npm i
npm start
```

## Publish Package

之前把 package 推到 npm package registry, 現在不用這麼麻煩，
記得 `git push` 之前先跑 `npm run build` 把 build 好的東西一起堆到 github 就行

## Using This Package

基本上這個 packege 只會在 [jsdc-dgw-frontend-main](https://github.com/JSDC-GIS/jsdc-dgw-frontend-main)裡面用到，直接參考 [How to create a new Event (add a submodule)](https://github.com/JSDC-GIS/jsdc-dgw-frontend-main?tab=readme-ov-file#create-a-new-event-add-a-submodule)

如果想要 install package:

```bash
npm install github:jsdc-gis/jsdc-dui

# 指定版本 範例是tag 1.7.2
npm install github:jsdc-gis/jsdc-dui#1.7.2

# 指定分支
npm install github:jsdc-gis/jsdc-dui#main
```

uninstall package:

```bash
npm uninstall jsdc-dui
```
