import { Layer } from 'leaflet'
import SceneCard from './SceneCard'
import Table, { ILeafletPopupTableProps } from './Table'
import * as ReactDOMServer from 'react-dom/server';
import Dguidewalks from '../../JSDC/Dguidewalks';

export type BindPopupWithSceneCardOptions = {
  dgw: Dguidewalks
  title: string,
  actionLabel?: string,
  onActionClick: () => void
}

export const bindPopupWithSceneCard = (layer: Layer, { dgw, title, actionLabel, onActionClick }: BindPopupWithSceneCardOptions) => {
  const initialContent = ReactDOMServer.renderToString(SceneCard({ actionLabel }))
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
    const content = ReactDOMServer.renderToString(SceneCard({ ...props, actionLabel }))
    layer.bindPopup(content)

    const button = document.getElementById('打卡集章')
    button?.addEventListener('click', onActionClick)
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
