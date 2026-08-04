/**
 * 景點 title 比對用的正規化：吸收圖層 API 的 name 與 Drupal title
 * 之間的大小寫、空白、換行、全半形差異。
 * 刻意不處理編號前綴與錯字，避免誤配到別的景點。
 */
export declare const normalizeTitle: (title: string) => string;
export default normalizeTitle;
