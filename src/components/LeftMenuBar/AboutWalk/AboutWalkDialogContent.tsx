import React from 'react'
import './AboutWalkDialogContent.scss'

export interface IAboutWalkDialogContentProps {
  /** 沒有圖（undefined 或空字串）時不渲染圖片區塊。 */
  imgSrc?: string
  title: string
  subtitle: string
  content: string
}

const AboutWalkDialogContent: React.FC<IAboutWalkDialogContentProps> = ({
  imgSrc,
  title,
  subtitle,
  content,
}) => {
  return (
    <div className="dui-AboutWalkDialogContent">
      {imgSrc && (
        <div className="dui-AboutWalkDialogContent-img">
          <img src={imgSrc} alt={title} />
        </div>
      )}
      <div className="dui-AboutWalkDialogContent-title">
        <span>{title}</span>
        <span>{subtitle}</span>
      </div>
      <div className="dui-AboutWalkDialogContent-content">{content}</div>
    </div>
  )
}
AboutWalkDialogContent.displayName = 'AboutWalkDialogContent'
export default AboutWalkDialogContent
