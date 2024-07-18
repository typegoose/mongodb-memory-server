/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: 'Easy to Use',
    description: (
      <>
        mongodb-memory-server was build with "easy-to-use" in mind and is in most common systems
        zero-configuration. (except setting a custom mongodb version)
      </>
    ),
  },
  {
    title: 'Supports all MongoDB supports systems',
    description: (
      <>
        mongodb-memory-server supporst all systems there are mongodb binaries are for, including
        some unofficial environments where some other binary works.
      </>
    ),
  },
  {
    title: 'Supports both Single-Instance and Replica Sets',
    description: (
      <>
        mongodb-memory-server can be quickly used with single mongodb instances or spin up a entire
        replicaset.
      </>
    ),
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);

  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted
              )}
              to={useBaseUrl('docs/guides/quick-start-guide')}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
