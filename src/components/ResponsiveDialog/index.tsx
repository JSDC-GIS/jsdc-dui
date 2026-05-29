import classNames from 'classnames'
import React, { useState } from 'react'
import './index.scss'

export interface IResponsiveDialogProps {
  Icon?: React.ReactNode
  title?: string
  open: boolean
  children: React.ReactNode
  kanbanImgSrc?: string
  onClose: () => void
  disabledFixedPosition?: boolean
  keepAlive?: boolean
  shareUrl?: string
}

const ResponsiveDialog: React.FC<IResponsiveDialogProps> = ({
  Icon,
  title,
  open,
  children,
  kanbanImgSrc,
  disabledFixedPosition = false,
  keepAlive = false,
  onClose = () => null,
  shareUrl,
}: IResponsiveDialogProps) => {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    if (!shareUrl) return
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ url: shareUrl })
        return
      }
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      if ((err as DOMException)?.name === 'AbortError') return
      console.warn('[ResponsiveDialog] share failed', err)
    }
  }
  const displayStyle = keepAlive ? (open ? 'flex' : 'none') : 'flex'

  if (!keepAlive && !open) return null
  return (
    <div
      style={{ display: displayStyle }}
      className={classNames('dui-ResponsiveDialog', {
        'dui-ResponsiveDialog-disableFixed': disabledFixedPosition,
      })}
    >
      {kanbanImgSrc && (
        <div className="dui-ResponsiveDialog-kanban">
          <img src={kanbanImgSrc} alt={title} />
        </div>
      )}
      <div className="header">
        <div className="title">
          {Icon && <div className="icon">{Icon}</div>}
          <div className="text">{title}</div>
        </div>
        <div className="action">
          {shareUrl && (
            <div
              className="share-btn"
              onClick={handleShare}
              title="複製此地點連結"
            >
              {copied ? (
                <p>✓</p>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
              )}
            </div>
          )}
          <div className="close-btn" onClick={() => onClose()}>
            <p>✕</p>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}
ResponsiveDialog.displayName = 'ResponsiveDialog'
export default ResponsiveDialog
