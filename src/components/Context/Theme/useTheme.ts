import chroma from 'chroma-js'

export const defaultStyle = {
  '--dui-primary': '#F1C385',
  '--dui-secondary': 'rgb(42, 125, 250)',
  '--dui-accent': 'red',
  '--dui-bg-primary': 'white',
  '--dui-bg-secondary': 'rgb(42, 125, 250)',
  '--dui-bg-accent': '#F1C385',
  '--dui-text-primary': '#1f1f1f',
  '--dui-text-gray': '#878787',
}

export type StyleType = Partial<
  typeof defaultStyle & {
    [k: string]: string
  }
>

const useTheme = (style: StyleType) => {
  const styleMap: StyleType & { [k: string]: string } = {
    ...defaultStyle,
    ...style,
  }

  const extendsColorOpacity = () => {
    const result: typeof styleMap = {}
    const opacityInterval = [
      0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
      95,
    ]
    for (const styleName in styleMap) {
      const color = styleMap[styleName]
      opacityInterval.forEach((value) => {
        const newStyleName = `${styleName}--opacity-${value}`
        result[newStyleName] = chroma(color)
          .alpha(value / 100)
          .hex()
      })
    }
    return result
  }

  const extendsColorBrighten = () => {
    const result: typeof styleMap = {}
    const brightenInterval = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]
    for (const styleName in styleMap) {
      const color = styleMap[styleName]
      brightenInterval.forEach((value) => {
        const newStyleName = `${styleName}--brighten-${value}`
        result[newStyleName] = chroma
          .scale([color, 'white'])(value / 100)
          .hex()
      })
    }
    return result
  }

  const richStyleMap = {
    ...styleMap,
    ...extendsColorOpacity(),
    ...extendsColorBrighten(),
  }
  for (const name in richStyleMap) {
    document.documentElement.style.setProperty(name, richStyleMap[name])
  }
}

export default useTheme
