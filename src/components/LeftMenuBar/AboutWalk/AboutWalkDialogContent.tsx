import React from 'react'
import './AboutWalkDialogContent.scss'

export interface IAboutWalkDialogContentProps {
  imgSrc: string
  title: string
  subtitle: string
  content: string
}

const AboutWalkDialogContent = ({
  imgSrc,
  title,
  subtitle,
  content
}: IAboutWalkDialogContentProps) => {
  
  return (
    <div className="dui-AboutWalkDialogContent">
      <div className="dui-AboutWalkDialogContent-img">
        <img src={imgSrc} alt={title} />
      </div>
      <div className="dui-AboutWalkDialogContent-title">
        <span>{title}</span>
        <span>{subtitle}</span>
      </div>
      <div className="dui-AboutWalkDialogContent-content">{content}</div>
    </div>
  )
}

export default AboutWalkDialogContent
