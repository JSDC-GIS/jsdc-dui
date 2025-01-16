import React from 'react'
import icon from '../../icon'
import './index.scss'

export interface ISceneCardProps {
  title: string
  subtitle: string
  imgSrc: string
  mainTextContent: string
  credit: string
}

const SceneCard: React.FC<Partial<ISceneCardProps>> = ({
  title = '...',
  subtitle = '...',
  imgSrc = icon.others.processing,
  mainTextContent = '...',
  credit = '　:　',
}) => {
  return (
    <div className="dui-SceneCard">
      <div className="dui-SceneCard-Kanban">
        <img src={imgSrc} />
      </div>
      <div className="dui-SceneCard-artical">
        <div className="header">
          <p className="title">{title}</p>
          <p className="subtitle">{subtitle}</p>
        </div>
        <div className="content">{mainTextContent}</div>
        <div className="SceneCard-credit">
          <span>{credit}</span>
        </div>
      </div>
    </div>
  )
}
SceneCard.displayName = 'SceneCard'
export default SceneCard
