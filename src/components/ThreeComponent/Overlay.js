import React from 'react'
import Link from '@docusaurus/Link'
import './styles.css'

export default function Overlay() {
  return (
    <div className="hero-overlay">
      <div className="hero-glow hero-glow--pink" />
      <div className="hero-glow hero-glow--cyan" />
      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge__dot" />
          Frontend Notes
        </div>
        <h1 className="hero-title">前端记录小站</h1>
        <p className="hero-sub">
          把学习日常、源码笔记和可复用技巧收成一座随时能翻的小站。
        </p>
        <div className="hero-tags">
          <span>学习记录</span>
          <span>知识分享</span>
          <span>源码笔记</span>
        </div>
        <div className="hero-actions">
          <Link className="hero-btn hero-btn--primary" to="/docs/intro">
            开始浏览
            <span aria-hidden="true">→</span>
          </Link>
          <a className="hero-btn hero-btn--ghost" href="#features">
            往下看看
          </a>
        </div>
      </div>
      <div className="hero-fade" />
      <div className="hero-scroll" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}
