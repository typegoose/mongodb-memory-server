import OriginalComponentTypes from '@theme-original/NavbarItem/ComponentTypes';
import NavbarVersionsSelector from '../../components/NavbarVersionsSelector';
import NavbarBetaNotice from '../../components/NavbarBetaNotice';

const ComponentTypes = {
  ...OriginalComponentTypes,
  'custom-versions-selector': NavbarVersionsSelector,
  'custom-beta-notice': NavbarBetaNotice,
};
export default ComponentTypes;
