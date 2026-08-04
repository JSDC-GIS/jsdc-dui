# 景點 title 比對（各下游專案的必要調整）

## 問題

走讀地圖有兩套**各自人工維護**的字串，卻互相當 key 使用：

| 來源       | 欄位                   | 例子                                 |
| ---------- | ---------------------- | ------------------------------------ |
| Drupal CMS | `attributes.title`     | `"37 北埔老街\n37 beipu old street"` |
| 圖層 API   | `PointFeatures[].name` | `"37 北埔老街\n37 Beipu Old Street"` |

兩者只要差一個空白、換行、英文大小寫或全半形，比對就整條 miss。實測 n0028：37 筆裡有 1 筆因為英文大小寫（`beipu old street` vs `Beipu Old Street`）對不上。

miss 的症狀是**靜默失效**，沒有任何錯誤訊息：

- **圖層 → CMS**（點地圖 marker 開 popup）：`getDetailByTitle` throw，popup 停在空白 SceneCard。
- **CMS → 圖層**（點景點列表的定位鈕 / 導航鈕）：`forExactLayerName` 找不到 marker 就 return，畫面完全沒反應。

## dui 已經處理好的部分（不用改）

`src/JSDC/utils/normalizeTitle.ts` — 比對用的正規化純函式：

```ts
export const normalizeTitle = (title: string): string =>
  title
    .normalize('NFKC') // 全形英數/括號 → 半形
    .replace(/\\[nrt]/g, '') // 字面的 "\n"（反斜線+n，資料轉手被跳脫時常見）
    .replace(/[\s　​﻿]+/g, '') // 換行/tab/半形全形空白/zero-width 全移除
    .toLowerCase()
```

刻意**不**處理編號前綴與錯字，避免誤配到別的景點。

`ArticleProxyParser` 已改用它（`ArticleCache.setSummaries` / `resolveKey`），所以**圖層 → CMS 這個方向，下游只要升級 dui 版本就好，程式碼不用動**。

## 下游要改的部分

**CMS → 圖層**這個方向的定位邏輯（`forExactLayerName`）住在**各下游專案自己的 `App.tsx`**——dui 的 `onSceneTargetClick` / `onSceneNavigate` 預設是 `() => null`，library 不含定位邏輯。所以每個專案都要各自改一次。

### 1. 加 import

```ts
import { normalizeTitle } from 'jsdc-dui/dist/JSDC/utils/normalizeTitle'
```

### 2. 換掉 `forExactLayerName` 的比對

改之前（各專案大同小異，關鍵是最後那個 `includes`）：

```ts
for (const layer of layers) {
  const layerName = layer.feature?.properties.name
  if (!layerName) continue
  if (featureName.includes(String(layerName))) {
    // ← 未正規化，且內層變數 shadow 外層參數
    cb(layer)
    break
  }
}
```

改之後：

```ts
// Drupal 的 title 與圖層 properties.name 是兩套人工維護的字串，
// 先正規化（大小寫/空白/換行/全半形）再比，否則點列表定位鈕會靜默失效。
const target = normalizeTitle(featureName)
const candidates = layers
  .map((layer) => ({
    layer,
    name: normalizeTitle(String(layer.feature?.properties.name ?? '')),
  }))
  .filter((candidate) => candidate.name)

const hit =
  // 先求完全相同，避免「三坑」誤中「三坑老街」
  candidates.find((candidate) => candidate.name === target) ??
  // 再退到雙向 contains，吃掉 CMS title 的編號前綴（01遇見雞母嶺 vs 遇見雞母嶺）
  candidates.find(
    (candidate) =>
      target.includes(candidate.name) || candidate.name.includes(target),
  )

if (hit) cb(hit.layer)
```

比對規則是**兩段式**，順序不能反：

1. 正規化後**完全相同** —— 精準命中優先，避免短名誤中長名（「三坑」中到「三坑老街」）。
2. 正規化後**雙向 contains** —— 保留原本吃 CMS 編號前綴的能力（`01遇見雞母嶺` vs 圖層 `遇見雞母嶺`），兩個方向都試是因為前綴可能出現在任一邊。

定位鈕與導航鈕共用 `forExactLayerName`，改一處兩個都會好。

## 版本需求

`normalizeTitle` 從 **1.10.2** 起提供（`dist/JSDC/utils/normalizeTitle`）。下游 `package.json`：

```json
"jsdc-dui": "github:jsdc-gis/jsdc-dui#1.10.2"
```

升版後重裝（Yarn Berry 專案記得 `yarn install`），確認 `node_modules/jsdc-dui/dist/JSDC/utils/normalizeTitle.js` 存在再改 code。

## 驗證方式

改完後開景點介紹列表，**逐筆**點定位鈕（不要只點第一筆——會壞的常常是中間某一筆）。若要快速找出哪些筆對不上，用這段離線比對（把 `apiUrl`、`cmsPath`、`eventId` 換成該專案的）：

```js
const normalizeTitle = (t) =>
  t
    .normalize('NFKC')
    .replace(/\\[nrt]/g, '')
    .replace(/[\s　​﻿]+/g, '')
    .toLowerCase()

const cms = await (await fetch(apiUrl)).json()
const titles = cms.data
  .filter((i) => cmsPath.some((p) => i.attributes.path?.alias.includes(p)))
  .map((i) => i.attributes.title)

const layers = await (
  await fetch(
    `https://map.jsdc.com.tw/webgis/backend/dguidewalks/api/event/${eventId}/layers`,
  )
).json()
const names = layers
  .find((l) => l.name === `${eventId}-point`)
  .PointFeatures.map((f) => f.name)

const oldRule = (t) => names.find((n) => t.includes(n))
const newRule = (t) => {
  const target = normalizeTitle(t)
  const cand = names
    .map((n) => ({ n, k: normalizeTitle(n) }))
    .filter((c) => c.k)
  return (
    cand.find((c) => c.k === target)?.n ??
    cand.find((c) => target.includes(c.k) || c.k.includes(target))?.n
  )
}
console.log(
  'old miss:',
  titles.filter((t) => !oldRule(t)),
)
console.log(
  'new miss:',
  titles.filter((t) => !newRule(t)),
)
```

`new miss` 還有殘留代表 CMS 與圖層的名字差太多（不只格式差異），那要回 CMS/圖層後台把名字對齊，不該再放寬比對規則。

## 已知未處理

- **編號前綴不會被剝掉**：`01三坑老街` 與 `三坑老街` 只能靠第 2 段的 contains 命中；若兩邊的編號**不一致**（`01` vs `02`）就會 miss，這是資料錯誤，應該回後台修。
- **錯字不處理**：沒有做編輯距離模糊比對，誤配風險大於效益。
