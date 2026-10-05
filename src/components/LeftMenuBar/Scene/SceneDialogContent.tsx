import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './SceneDialogContent.scss'
import { DguidewalksContext } from '../../../JSDC/Dguidewalks/Context'
import { Article } from '../../../JSDC/Dguidewalks/proxyParser/@types'
import { SceneFeature } from '../../../JSDC/Dguidewalks/ApiProvider'
import Target from '../../Icons/Target'
import NavigatorArrow from '../../Icons/NavigatorArrow'

export interface ISceneDialogContentProps {
  onTarget: (feature: SceneFeature) => void
  onNavigate: (feature: SceneFeature) => void
  cardsReducer?: (data: Article[]) => Article[]
}

const SceneDialogContent: React.FC<ISceneDialogContentProps> = ({
  onTarget,
  onNavigate,
  cardsReducer = (data: Article[]) => data,
}: ISceneDialogContentProps) => {
  const { dgw } = useContext(DguidewalksContext)
  const { i18n } = useTranslation()
  const [_articles, setArticles] = useState<Article[]>([])

  const articles = cardsReducer(_articles)

  const fetchArticles = async () => {
    setArticles(await dgw.getSceneArticles(i18n.language))
  }

  const padNumber = (d: number) => {
    return d < 10 ? '0' + d.toString() : d.toString()
  }

  useEffect(() => {
    fetchArticles()
  }, [i18n.language])
  return (
    <div className="dui-SceneDialogContent">
      {articles.map((article, index) => {
        // 沒有座標的景點（geometry 為 null）不在地圖上，定位、導航無處可去，
        // 所以不顯示這兩個鈕；舊 Drupal 來源的文章沒有 feature，同樣不顯示。
        const located = article.feature?.geometry ? article.feature : undefined
        return (
          <div key={article.id ?? index} className="dui-SceneDialogContent-row">
            <div className="dui-SceneDialogContent-picture">
              <img src={article.imgSrc} />
              {located && (
                <p className="geonavigator" onClick={() => onNavigate(located)}>
                  <NavigatorArrow />
                </p>
              )}
            </div>
            <div className="dui-SceneDialogContent-content">
              <div className="content-header">
                <div className="header-title">{article.title}</div>
                {located && (
                  <div
                    className="header-action"
                    onClick={() => onTarget(located)}
                  >
                    <Target color={'var(--dui-secondary)'} />
                  </div>
                )}
              </div>
              <div className="dui-SceneDialogContent-mainText">
                {article.content}
              </div>
              <div className="dui-SceneDialogContent-footer">
                <div className="count">{`${padNumber(index + 1)}/${articles.length}`}</div>
                <a className="more" target="_blank" href={article.link}>
                  more
                </a>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
SceneDialogContent.displayName = 'SceneDialogContent'
export default SceneDialogContent
