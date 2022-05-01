import { Layer } from 'leaflet'
import SceneCard from './SceneCard'
import Table, { ILeafletPopupTableProps } from './Table'
import * as ReactDOMServer from 'react-dom/server';
import Dguidewalks from '../../JSDC/Dguidewalks';

export type BindPopupWithComponentOptions<P> = {
  Component: (props: P) => JSX.Element,
  props: P,
  onLayerClick?: () => void
}

export function bindPopupWithComponent<P> (layer: Layer, { Component, props, onLayerClick }: BindPopupWithComponentOptions<P>) {
  layer.bindPopup(ReactDOMServer.renderToString(Component(props)))
  onLayerClick && layer.on('click', async () => {
    onLayerClick()
  })
}

export type BindPopupWithSceneCardOptions = {
  dgw: Dguidewalks
  title: string
}

export const bindPopupWithSceneCard = (layer: Layer, { dgw, title }: BindPopupWithSceneCardOptions) => {
  const initialContent = ReactDOMServer.renderToString(SceneCard({}))
  layer.bindPopup(initialContent)
  layer.on('click', async () => {
  const sceneData = await dgw.getSceneDetailArticleByTitle(title)
    const props = {
      title: sceneData.title,
      subtitle: sceneData.subtitle,
      imgSrc: sceneData.imgSrc,
      mainTextContent: sceneData.content,
      credit: sceneData.ref
    }
    bindPopupWithComponent(layer, { Component: SceneCard, props  })
  })
}

export const bindPopupWithTable = (layer: Layer, options: ILeafletPopupTableProps) => {
  layer.bindPopup(ReactDOMServer.renderToString(Table(options)))
}

const LeafletPopup= {
  SceneCard,
  Table
}

export default LeafletPopup
