import React from 'react';
import { Redirect } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';

function Guides() {
  return <Redirect to={useBaseUrl('docs/guides/quick-start-guide')} />;
}

export default Guides;
