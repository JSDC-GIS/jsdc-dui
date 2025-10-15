# i18n 多國語系實作說明

## 概述
本專案已成功整合 `react-i18next` 實現多國語系功能，支援**繁體中文 (zh-TW)** 和**英文 (en)**。

## 已完成的修改

### 1. 安裝套件
- `i18next`: 核心 i18n 框架
- `react-i18next`: React 整合套件

### 2. 檔案結構
```
src/
├── i18n/
│   ├── config.ts                    # i18n 初始化設定
│   ├── index.ts                     # Export 所有 i18n 功能
│   ├── useTranslatedMenuItems.ts    # 選單項目翻譯 Hook
│   └── locales/
│       ├── zh-TW.json              # 繁體中文翻譯
│       └── en.json                 # 英文翻譯
├── components/
│   └── LanguageSwitcher/           # 語言切換器元件
│       ├── index.tsx
│       └── index.scss
```

### 3. 已翻譯的元素

#### 選單項目
- **地圖圖層** → Map Layers
- **景點介紹** → Attractions
- **氣象預測** → Weather Forecast
- **圖例說明** → Legend
- **路線介紹** → Route Introduction
- **關於圖臺** → About Platform

#### 版權文字
- **版權所有 Ⓒ 2025** → Copyright Ⓒ 2025
- **平台內容維護｜智紳數位文化事業有限公司** → Platform Maintenance | JRSHEN Digital Culture Co., Ltd.
- **Design by someDesign** → Design by someDesign

### 4. 修改的元件檔案
- `src/components/LeftMenuBar/Layer/LayerMenuItem.tsx`
- `src/components/LeftMenuBar/Scene/SceneMenuItem.tsx`
- `src/components/LeftMenuBar/Weather/WeatherMenuItem.tsx`
- `src/components/LeftMenuBar/Legend/LegendMenuItem.tsx`
- `src/components/LeftMenuBar/AboutWalk/AboutWalkMenuItem.tsx`
- `src/components/LeftMenuBar/Credit/CreditMenuItem.tsx`
- `src/components/MapViewContainer/index.tsx`
- `src/index.tsx` (初始化 i18n)

## 使用方式

### 1. 在元件中使用翻譯

```typescript
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t } = useTranslation()

  return <div>{t('menu.mapLayer')}</div>
}
```

### 2. 使用語言切換器

```typescript
import LanguageSwitcher from './components/LanguageSwitcher'

function App() {
  return (
    <div>
      <LanguageSwitcher />
      {/* 其他元件 */}
    </div>
  )
}
```

### 3. 新增翻譯內容

在 `src/i18n/locales/zh-TW.json` 和 `src/i18n/locales/en.json` 中新增翻譯鍵值：

```json
{
  "newSection": {
    "title": "新標題",
    "description": "新描述"
  }
}
```

然後在元件中使用：

```typescript
const { t } = useTranslation()
t('newSection.title')  // 輸出: "新標題" (中文) 或 "New Title" (英文)
```

### 4. 使用參數化翻譯

```typescript
// 在翻譯檔案中
{
  "greeting": "你好, {{name}}!"
}

// 在元件中
t('greeting', { name: '張三' })  // 輸出: "你好, 張三!"
```

## 預設語言
預設語言設定為 **繁體中文 (zh-TW)**，可在 `src/i18n/config.ts` 中修改：

```typescript
i18n.init({
  // ...
  lng: 'zh-TW',  // 修改此處以改變預設語言
  fallbackLng: 'zh-TW',
  // ...
})
```

## 語言切換
使用者可以透過 `LanguageSwitcher` 元件切換語言，語言偏好會儲存在 i18next 中。

## 注意事項

1. **TypeScript 警告**: 由於專案使用較舊版本的 TypeScript (4.6.3)，而 i18next 使用較新的型別特性，build 時會出現一些型別警告。這些警告不會影響功能運作。

2. **Build 成功**: 專案已成功 build，所有功能正常運作。

3. **擴充性**: 若要新增其他語言（如日文、韓文等），只需：
   - 在 `src/i18n/locales/` 新增對應的 JSON 檔案（如 `ja.json`）
   - 在 `src/i18n/config.ts` 的 resources 中註冊新語言
   - 在 `LanguageSwitcher` 元件中新增對應的按鈕

## 測試

執行以下命令測試：

```bash
# 開發模式
npm start

# 建置
npm run build
```

## 未來改進建議

1. 將更多硬編碼文字移至翻譯檔案
2. 考慮實作語言偏好的 localStorage 儲存
3. 為景點介紹、路線說明等動態內容實作多語系支援
4. 考慮升級 TypeScript 版本以消除型別警告（需評估專案相容性）
