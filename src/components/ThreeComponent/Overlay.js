 import React from "react"
 import Link from '@docusaurus/Link';
 import './styles.css'

 export default function Overlay() {
    return (
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '500px' }}>
        <div style={{ position: 'absolute', top: '250px', left: '50%', transform: 'translate3d(-50%,-50%,0)' }} className="title">
          <h1 style={{ margin: 0, padding: 0, fontSize: '8em', fontWeight: 500, letterSpacing: '-0.05em' }}>前端记录小站</h1>
        </div>
        <div className='buttons'>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
           开始浏览 ⏱️
          </Link>
        </div>
      </div>
    )
  }