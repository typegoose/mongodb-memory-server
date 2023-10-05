import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

// this is a workaround, because without this non-absolute links will be seen as routable links by react
// see https://github.com/facebook/docusaurus/discussions/9376

export default function NavbarLinkNoReact({ href, label }) {
  const normalizedHref = useBaseUrl(href, { forcePrependBaseUrl: true });

  return (
    <a href={normalizedHref} class="navbar__item navbar__link">
      {label}
    </a>
  );
}
