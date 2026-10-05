/**
 * 景點 title 比對用的正規化：吸收圖層 API 的 name 與 Drupal title
 * 之間的大小寫、空白、換行、全半形差異。
 * 刻意不處理編號前綴與錯字，避免誤配到別的景點。
 */
export declare const normalizeTitle: (title: string) => string;
/**
 * 用 title 從一組資料裡找出對應的那筆，兩段式比對，順序不能反：
 * 1. 正規化後完全相同（避免「三坑」誤中「三坑老街」）
 * 2. 正規化後雙向 contains（吃掉任一邊的編號前綴）
 * 只給外部呼叫者用（例如下游用寫死的景點名稱找點）；jsdc-dui 內部一律用景點 id / feature 識別。
 */
export declare const findByTitle: <T>(items: T[], getTitle: (item: T) => string | null | undefined, title: string) => T | undefined;
export default normalizeTitle;
