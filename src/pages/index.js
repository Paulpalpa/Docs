import React from 'react';
// import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import ThreeComponent from '@site/src/components/ThreeComponent';

export default function Home() {
  return (
    <Layout
      title={`Paul的前端小站`}>
      <ThreeComponent />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
