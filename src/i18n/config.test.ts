/**
 * 跑在 jsdom：pathname 預設是 '/'，所以 scoped key 是 'i18nextLng@/'。
 * i18n 在 import 時就 init，要測「init 讀到 localStorage」得用 isolateModules 重新載入。
 */
const KEY = 'i18nextLng@/'

const load = () => {
  let mod: typeof import('./config')
  jest.isolateModules(() => {
    mod = require('./config')
  })
  return mod!
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('scopedStorageKey', () => {
  it('依頁面所在目錄加後綴，讓同 host 不同專案的偏好各自獨立', () => {
    const { scopedStorageKey } = load()
    window.history.pushState({}, '', '/webgis/dguidedwalks/n0032/index.html')
    expect(scopedStorageKey('i18nextLng')).toBe(
      'i18nextLng@/webgis/dguidedwalks/n0032/',
    )
    window.history.pushState({}, '', '/')
  })
})

describe('i18n 初始化', () => {
  it('沒有已存偏好時用 zh-TW', () => {
    const { default: i18n } = load()
    expect(i18n.language).toBe('zh-TW')
  })

  it('有已存偏好（scoped key）時沿用', () => {
    window.localStorage.setItem(KEY, 'en')
    const { default: i18n } = load()
    expect(i18n.language).toBe('en')
  })

  it('切換語言會寫回 scoped key（雙語站台的持久化）', () => {
    const { default: i18n } = load()
    i18n.changeLanguage('en')
    expect(window.localStorage.getItem(KEY)).toBe('en')
    expect(window.localStorage.getItem('i18nextLng')).toBeNull()
  })
})

describe('applyFixedLanguage', () => {
  it('無視 localStorage 的既有偏好，切到指定語言', () => {
    window.localStorage.setItem(KEY, 'en')
    const { default: i18n, applyFixedLanguage } = load()
    expect(i18n.language).toBe('en')
    applyFixedLanguage('zh-TW')
    expect(i18n.language).toBe('zh-TW')
  })

  it('不寫回 localStorage，不污染其他專案或原本的偏好', () => {
    window.localStorage.setItem(KEY, 'en')
    const { default: i18n, applyFixedLanguage } = load()
    applyFixedLanguage('zh-TW')
    expect(window.localStorage.getItem(KEY)).toBe('en')
    // 之後即使再 changeLanguage 也不寫回
    i18n.changeLanguage('en')
    expect(window.localStorage.getItem(KEY)).toBe('en')
    i18n.changeLanguage('zh-TW')
    expect(window.localStorage.getItem(KEY)).toBe('en')
  })
})
