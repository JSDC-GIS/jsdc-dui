import { Layer } from 'leaflet'
import SceneCard from './SceneCard'
import Table, { ILeafletPopupTableProps } from './Table'
import { renderToString } from 'react-dom/server';
import Dguidewalks from '../../JSDC/Dguidewalks';
import { get } from 'lodash';

export type BindPopupWithComponentOptions<P> = {
  Component: (props: P) => JSX.Element,
  props: P,
  onLayerClick?: () => void
}

export function bindPopupWithComponent<P> (layer: Layer, stringRenderer: typeof renderToString, { Component, props, onLayerClick }: BindPopupWithComponentOptions<P>) {
  layer.bindPopup(stringRenderer(Component(props)))
  onLayerClick && layer.on('click', async () => {
    onLayerClick()
  })
}

export type BindPopupWithSceneCardOptions = {
  dgw: Dguidewalks
  title: string
}

export const bindPopupWithSceneCard = (layer: Layer, stringRenderer: typeof renderToString, { dgw, title }: BindPopupWithSceneCardOptions) => {
  // @ts-ignore
  const initialContent = stringRenderer(SceneCard({}))
  layer.bindPopup(initialContent)
  layer.on('click', async () => {
  const sceneData = await dgw.getSceneDetailArticleByTitle(title, get(layer, 'feature.properties.url') as string | undefined)
    const props = {
      title: sceneData.title,
      subtitle: sceneData.subtitle,
      imgSrc: sceneData.imgSrc,
      mainTextContent: sceneData.content,
      credit: sceneData.ref
    }
    // @ts-ignore
    bindPopupWithComponent(layer, stringRenderer,{ Component: SceneCard, props  })
  })
}

export const bindPopupWithTable = (layer: Layer, stringRenderer: typeof renderToString, options: ILeafletPopupTableProps) => {
  // @ts-ignore
  layer.bindPopup(stringRenderer(Table(options)))
}

const LeafletPopup= {
  SceneCard,
  Table
}

export default LeafletPopup
