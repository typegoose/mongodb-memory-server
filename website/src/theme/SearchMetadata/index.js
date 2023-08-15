import React from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function SearchMetadata({ locale, tag }) {
  const { siteConfig } = useDocusaurusContext();
  const deployInfo = siteConfig.customFields?.deployInfo ?? {};
  const searchName = deployInfo?.searchName ?? 'current';

  tag = tag.replace('current', searchName); // replace "docs-default-current" with something like "docs-default-YourVersion"

  return (
    <Head>
      {/*
        Docusaurus metadata, used by third-party search plugin
        See https://github.com/cmfcmf/docusaurus-search-local/issues/99
        */}
      {locale && <meta name="docusaurus_locale" content={locale} />}
      {<meta name="docusaurus_version" content={searchName} />}
      {tag && <meta name="docusaurus_tag" content={tag} />}

      {/* Algolia DocSearch metadata */}
      {locale && <meta name="docsearch:language" content={locale} />}
      {<meta name="docsearch:version" content={searchName} />}
      {tag && <meta name="docsearch:docusaurus_tag" content={tag} />}
    </Head>
  );
}
