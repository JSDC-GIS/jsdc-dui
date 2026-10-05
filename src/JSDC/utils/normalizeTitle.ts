/**
 * 景點 title 比對用的正規化：吸收圖層 API 的 name 與 Drupal title
 * 之間的大小寫、空白、換行、全半形差異。
 * 刻意不處理編號前綴與錯字，避免誤配到別的景點。
 */
export const normalizeTitle = (title: string): string =>
  title
    .normalize('NFKC') // 全形英數/括號 → 半形，相容字元統一
    .replace(/\\[nrt]/g, '') // 字面的 "\n"（反斜線+n，資料轉手被跳脫時常見）
    .replace(/[\s　​﻿]+/g, '') // 換行/tab/半形全形空白/zero-width 全移除
    .toLowerCase()

/**
 * 用 title 從一組資料裡找出對應的那筆，兩段式比對，順序不能反：
 * 1. 正規化後完全相同（避免「三坑」誤中「三坑老街」）
 * 2. 正規化後雙向 contains（吃掉任一邊的編號前綴）
 * 只給外部呼叫者用（例如下游用寫死的景點名稱找點）；jsdc-dui 內部一律用景點 id / feature 識別。
 */
export const findByTitle = <T>(
  items: T[],
  getTitle: (item: T) => string | null | undefined,
  title: string,
): T | undefined => {
  const target = normalizeTitle(title)
  if (!target) return undefined
  const candidates = items
    .map((item) => ({
      item,
      name: normalizeTitle(String(getTitle(item) ?? '')),
    }))
    .filter((candidate) => candidate.name)

  const hit =
    candidates.find((candidate) => candidate.name === target) ??
    candidates.find(
      (candidate) =>
        target.includes(candidate.name) || candidate.name.includes(target),
    )
  return hit?.item
}

export default normalizeTitle
