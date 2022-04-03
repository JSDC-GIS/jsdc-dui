



export const defaultStyle = {
  '--rui-primary': 'rgb(0, 102, 255)',
  '--rui-secondary': 'rgb(42, 125, 250)',
  '--rui-accent': 'red',
  '--rui-bg-primary': 'white',
  '--rui-bg-secondary': 'rgb(42, 125, 250)',
  '--rui-bg-accent': '#F1C385',
  '--rui-text-primary': '#1f1f1f',
  '--rui-text-gray': '#878787'
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
