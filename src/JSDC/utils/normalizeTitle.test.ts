import { normalizeTitle } from './normalizeTitle'

describe('normalizeTitle', () => {
  const expectSame = (a: string, b: string) =>
    expect(normalizeTitle(a)).toBe(normalizeTitle(b))

  it('忽略英文大小寫', () => {
    expectSame('Daxi Old Street', 'daxi old street')
  })

  it('忽略前後空白', () => {
    expectSame('  三坑老街  ', '三坑老街')
  })

  it('忽略中間空白', () => {
    expectSame('三坑 老街', '三坑老街')
  })

  it('忽略全形空白與 zero-width 字元', () => {
    expectSame('三坑　老街', '三坑老街')
    expectSame('三坑​老街', '三坑老街')
    expectSame('﻿三坑老街', '三坑老街')
  })

  it('全形英數與括號正規化成半形', () => {
    expectSame('大溪老街（１）', '大溪老街(1)')
  })

  it('NFD 組合字與 NFC 視為相同', () => {
    // 'Cafe' + U+0301 combining acute vs. 'Caf' + U+00E9
    expectSame('Cafe\u0301', 'Caf\u00e9')
  })

  it('忽略真換行字元', () => {
    expectSame('三坑\n老街', '三坑老街')
    expectSame('三坑\r\n老街', '三坑老街')
    expectSame('三坑\t老街', '三坑老街')
  })

  it('忽略字面的跳脫序列 \\n', () => {
    expectSame('三坑\\n老街', '三坑老街')
    expectSame('三坑\\r\\n老街', '三坑老街')
    expectSame('三坑\\t老街', '三坑老街')
  })

  it('不同景點不會被誤判成相同', () => {
    expect(normalizeTitle('三坑老街')).not.toBe(normalizeTitle('大溪老街'))
    // 編號前綴刻意不處理
    expect(normalizeTitle('01 三坑老街')).not.toBe(normalizeTitle('三坑老街'))
  })
})
