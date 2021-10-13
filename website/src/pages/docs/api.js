/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { Redirect } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';

function Api() {
  return <Redirect to={useBaseUrl('docs/api/index-api')} />;
}

export default Api;
