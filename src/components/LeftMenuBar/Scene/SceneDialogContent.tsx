import React, { useContext, useEffect, useState } from 'react'
import './SceneDialogContent.scss'
import { DguidewalksContext } from '../../../JSDC/Dguidewalks/Context'
import { Article } from '../../../JSDC/Dguidewalks/proxyParser/@types'
import Target from '../../Icons/Target'
import NavigatorArrow from '../../Icons/NavigatorArrow'

export interface ISceneDialogContentProps {
  onTarget: (title: string) => void
  onNavigate: (title: string) => void
  cardsReducer?: (data: Article[]) => Article[]
}

const SceneDialogContent: React.FC<ISceneDialogContentProps> = ({
  onTarget,
  onNavigate,
  cardsReducer = (data: Article[]) => data
}: ISceneDialogContentProps) => {
  const { dgw } = useContext(DguidewalksContext)
  const [_articles, setArticles] = useState<Article[]>([])

  const articles = cardsReducer(_articles)

  const fetchArticles = async () => {
    setArticles(await dgw.getSceneArticles())
  }

  const padNumber = (d: number) => {
    return (d < 10) ? '0' + d.toString() : d.toString();
  }

  useEffect(() => {
    fetchArticles()
  }, [])
  return (
    <div className="dui-SceneDialogContent">
      {
        articles.map((article, index) => (
          <div key={index} className="dui-SceneDialogContent-row">
            <div className="dui-SceneDialogContent-picture">
              <img src={article.imgSrc} />
              <p className="geonavigator" onClick={() => onNavigate(article.title)}><NavigatorArrow /></p>
            </div>
            <div className="dui-SceneDialogContent-content">
              <div className="content-header">
                <div className="header-title">{article.title}</div>
                <div className="header-action" onClick={() => onTarget(article.title)}><Target color={'var(--dui-secondary)'}/></div>
              </div>
              <div className="dui-SceneDialogContent-mainText">{article.content}</div>
              <div className="dui-SceneDialogContent-footer">
                <div className="count">{`${padNumber(index + 1)}/${articles.length}`}</div>
                <a className="more" target='_blank' href={article.link}>more</a>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}
SceneDialogContent.displayName = 'SceneDialogContent'
export default SceneDialogContent
