import { Layer } from 'leaflet'
import SceneCard from './SceneCard'
import Table, { ILeafletPopupTableProps } from './Table'
import { renderToString } from 'react-dom/server'

export type BindPopupWithComponentOptions<P> = {
  Component: (props: P) => JSX.Element | null
  props: P
  onLayerClick?: () => void
}

export function bindPopupWithComponent<P>(
  layer: Layer,
  stringRenderer: typeof renderToString,
  { Component, props, onLayerClick }: BindPopupWithComponentOptions<P>,
) {
  const element = Component(props)
  element && layer.bindPopup(stringRenderer(element))
  onLayerClick &&
    layer.on('click', async () => {
      onLayerClick()
    })
}

export const bindPopupWithTable = (
  layer: Layer,
  stringRenderer: typeof renderToString,
  options: ILeafletPopupTableProps,
) => {
  // @ts-ignore
  layer.bindPopup(stringRenderer(Table(options)))
}

const LeafletPopup = {
  SceneCard,
  Table,
}

export default LeafletPopup
