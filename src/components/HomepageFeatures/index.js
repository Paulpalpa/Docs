import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const Entries = [
  {
    index: '01',
    title: '从这里开始',
    description: '站点是怎么搭起来的，以及这些笔记打算怎么往后长。',
    to: '/docs/intro',
    accent: 'gold',
  },
  {
    index: '02',
    title: 'AI Coding',
    description: '工作流、Prompt、Context、Harness 和 Agent，换工具之后还能用的判断。',
    to: '/docs/Base_Record/AI_Coding/overview',
    accent: 'violet',
  },
  {
    index: '03',
    title: '基础知识',
    description: 'Git、工程化、设计模式、图形和 Web API，按主题收在一起。',
    to: '/docs/Base_Record/Git基础操作',
    accent: 'cyan',
  },
  {
    index: '04',
    title: '一些实践',
    description: 'Vite、Three、WebGPU 和部署，把亲手试过的东西留下来。',
    to: '/docs/Practice_Record/Vite',
    accent: 'pink',
  },
];

export default function HomepageFeatures() {
  return (
    <section id="features" className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <p className={styles.eyebrow}>目录</p>
          <h2>四条可以接着往下翻的线</h2>
          <p className={styles.lead}>
            学习记录和动手实践分开收，想查的时候不用从侧边栏里一层层点。
          </p>
        </div>
        <div className={styles.grid}>
          {Entries.map((entry) => (
            <Link
              key={entry.to}
              className={`${styles.card} ${styles[entry.accent]}`}
              to={entry.to}>
              <span className={styles.index}>{entry.index}</span>
              <h3>{entry.title}</h3>
              <p>{entry.description}</p>
              <span className={styles.more}>进入笔记</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
