



export const defaultStyle = {
  '--dui-primary': 'rgb(0, 102, 255)',
  '--dui-secondary': 'rgb(42, 125, 250)',
  '--dui-accent': 'red',
  '--dui-bg-primary': 'white',
  '--dui-bg-secondary': 'rgb(42, 125, 250)',
  '--dui-bg-accent': '#F1C385',
  '--dui-text-primary': '#1f1f1f',
  '--dui-text-gray': '#878787'
}

export type StyleType = Partial<typeof defaultStyle & {
  [k: string]: string
}>

const useTheme = (style: StyleType) => {
  const styleMap: StyleType& { [k: string]: string } = { ...defaultStyle, ...style }
  for (const name in styleMap) {
    document.documentElement.style.setProperty(name, styleMap[name])
  }
}

export default useTheme
