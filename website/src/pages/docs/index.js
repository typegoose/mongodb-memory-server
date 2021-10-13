/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { Redirect } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';

function Docs() {
  return <Redirect to={useBaseUrl('/')} />;
}

export default Docs;
