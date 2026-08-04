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

export default normalizeTitle
