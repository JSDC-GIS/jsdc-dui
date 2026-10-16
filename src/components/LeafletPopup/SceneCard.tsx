import React from 'react'
import icon from '../../icon'
import './index.scss'

export interface ISceneCardProps {
  title: string
  subtitle: string
  imgSrc: string
  mainTextContent: string
  /**
   * 已過濾的內文 HTML（`toSceneContentHtml` 的結果）。有值就取代 `mainTextContent`；
   * 不要傳未過濾的字串進來。
   */
  mainHtmlContent: string
  credit: string
}

const SceneCard: React.FC<Partial<ISceneCardProps>> = ({
  title = '...',
  subtitle = '...',
  imgSrc = icon.others.processing,
  mainTextContent = '...',
  mainHtmlContent,
  credit = '　:　',
}) => {
  return (
    <div className="dui-SceneCard">
      <div className="dui-SceneCard-Kanban">
        {imgSrc ? (
          <img src={imgSrc} />
        ) : (
          <img className="no-image" src={icon.others.noImage} />
        )}
      </div>
      <div className="dui-SceneCard-artical">
        <div className="header">
          <p className="title">{title}</p>
          <p className="subtitle">{subtitle}</p>
        </div>
        {mainHtmlContent ? (
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: mainHtmlContent }}
          />
        ) : (
          <div className="content">{mainTextContent}</div>
        )}
        <div className="SceneCard-credit">
          <span>{credit}</span>
        </div>
      </div>
    </div>
  )
}
SceneCard.displayName = 'SceneCard'
export default SceneCard
