import React from 'react'
import { useTranslation } from 'react-i18next'
import './index.scss'

export interface ILanguageSwitcherProps {
  className?: string
  style?: React.CSSProperties
}

const LanguageSwitcher: React.FC<ILanguageSwitcherProps> = ({
  className = '',
  style,
}) => {
  const { i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <div className={`dui-LanguageSwitcher ${className}`} style={style}>
      <button
        className={`lang-btn ${i18n.language === 'zh-TW' ? 'active' : ''}`}
        onClick={() => changeLanguage('zh-TW')}
      >
        繁體中文
      </button>
      <button
        className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
        onClick={() => changeLanguage('en')}
      >
        English
      </button>
    </div>
  )
}

LanguageSwitcher.displayName = 'LanguageSwitcher'
export default LanguageSwitcher
