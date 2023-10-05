import OriginalComponentTypes from '@theme-original/NavbarItem/ComponentTypes';
import NavbarVersionsSelector from '../../components/NavbarVersionsSelector';
import NavbarBetaNotice from '../../components/NavbarBetaNotice';
import NavbarLinkNoReact from '../../components/NavbarExternalLink';

const ComponentTypes = {
  ...OriginalComponentTypes,
  'custom-versions-selector': NavbarVersionsSelector,
  'custom-beta-notice': NavbarBetaNotice,
  'custom-link': NavbarLinkNoReact,
};
export default ComponentTypes;
