import { plainTextToHtml, toSceneContentHtml } from './sceneBody'

const toDom = (html: string) => {
  const div = document.createElement('div')
  div.innerHTML = html
  return div
}

describe('plainTextToHtml', () => {
  it('空行分段，段內換行變 <br>，\\r\\n 視同 \\n', () => {
    expect(plainTextToHtml('第一段\r\n第二行\r\n\r\n第二段\n \n')).toBe(
      '<p>第一段<br>第二行</p><p>第二段</p>',
    )
  })

  it('跳脫 HTML 特殊字元', () => {
    expect(plainTextToHtml('a < b & "c"')).toBe(
      '<p>a &lt; b &amp; &quot;c&quot;</p>',
    )
  })
})

describe('toSceneContentHtml', () => {
  it('空值、只有空白是空字串', () => {
    expect(toSceneContentHtml(null)).toBe('')
    expect(toSceneContentHtml(undefined)).toBe('')
    expect(toSceneContentHtml(' \n ')).toBe('')
  })

  it('沒有標籤就當純文字（n0028 等約 330 個景點的 body）', () => {
    expect(toSceneContentHtml('中文\n English')).toBe('<p>中文<br>English</p>')
    // 文字裡的 < 不是標籤
    expect(toSceneContentHtml('1 < 2')).toBe('<p>1 &lt; 2</p>')
  })

  it('保留段落、清單、表格、style、class', () => {
    const html =
      '<h4>標題</h4><p style="text-align:center" class="note">段落</p><ol><li>一</li></ol><table><tbody><tr><td width="50">格</td></tr></tbody></table>'
    expect(toSceneContentHtml(html)).toBe(html)
  })

  it('拿掉 script、事件屬性、javascript: 連結', () => {
    const dom = toDom(
      toSceneContentHtml(
        '<p onclick="alert(1)">文</p><script>alert(1)</script><a href="javascript:alert(1)">x</a><img src=x onerror="alert(1)">',
      ),
    )
    expect(dom.querySelector('script')).toBeNull()
    expect(dom.querySelector('[onclick]')).toBeNull()
    expect(dom.querySelector('[onerror]')).toBeNull()
    expect(dom.querySelector('a')?.getAttribute('href')).toBeNull()
  })

  it('連結開新分頁；相對網址不改寫', () => {
    const dom = toDom(
      toSceneContentHtml(
        '<p><a href="https://example.test/a" sid="1">外部</a><a href="/dguidedwalks.tw/x/">站內</a></p>',
      ),
    )
    const [external, relative] = Array.from(dom.querySelectorAll('a'))
    expect(external.getAttribute('target')).toBe('_blank')
    expect(external.getAttribute('rel')).toBe('noopener noreferrer')
    expect(external.hasAttribute('sid')).toBe(false)
    expect(relative.getAttribute('href')).toBe('/dguidedwalks.tw/x/')
  })

  it('iframe 只留 Google 地圖，並補 title', () => {
    const dom = toDom(
      toSceneContentHtml(
        '<p>街景</p><iframe src="https://www.google.com/maps/embed?pb=1" width="600"></iframe><iframe src="https://evil.test/"></iframe>',
      ),
    )
    const iframes = dom.querySelectorAll('iframe')
    expect(iframes).toHaveLength(1)
    expect(iframes[0].getAttribute('src')).toBe(
      'https://www.google.com/maps/embed?pb=1',
    )
    expect(iframes[0].getAttribute('title')).toBe('Google 地圖')
  })

  it('iframe 原本有 title 就沿用', () => {
    const dom = toDom(
      toSceneContentHtml(
        '<iframe title="八卦池街景" src="https://www.google.com/maps/embed?pb=1"></iframe>',
      ),
    )
    expect(dom.querySelector('iframe')?.getAttribute('title')).toBe(
      '八卦池街景',
    )
  })
})
