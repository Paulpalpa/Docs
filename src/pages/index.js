import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import ThreeComponent from '@site/src/components/ThreeComponent';


import styles from './index.module.css';

// function HomepageHeader() {
//   const {siteConfig} = useDocusaurusContext();
//   return (
//     <header className={styles.heroBanner}>
//       <div className="container">
//         <h1 className="hero__title">{`前端记录小站`}</h1>
//         <div className={styles.buttons}>
//           <Link
//             className="button button--secondary button--lg"
//             to="/docs/intro">
//            开始浏览 ⏱️
//           </Link>
//         </div>
//       </div>
//     </header>
//   );
// }

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <ThreeComponent />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
