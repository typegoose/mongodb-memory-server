import React from 'react';
import clsx from 'clsx';
import NavbarNavLink from '@theme/NavbarItem/NavbarNavLink';
import BrowserOnly from '@docusaurus/BrowserOnly';

// Base Copy from "./NavbarVersionsSelector.js"

/**
 * try to parse the version from the current location
 * @returns "false" if not found", otherwise the baseurl of the version
 */
function versionFromUrl() {
  const caps = /^\/mongodb-memory-server\/versions\/(\d+\.x|beta)/.exec(window.location.pathname);

  if (caps) {
    return `${caps[1]}`;
  }

  return false;
}

/**
 * Get the label to use for the current version
 * @returns "false" if no label is used, otherwise a string containing the label's text
 */
function getLabel() {
  const caps = versionFromUrl();

  if (!caps) {
    return false;
  }

  // add notice that "beta" is not always the same or higher than the current version
  if (caps === 'beta') {
    return 'Beta Version may not always be up-to-date';
  }

  return false;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function NavbarBetaNoticeDesktop({ position, className, ...props }) {
  const label = getLabel();

  if (label) {
    return (
      <div id="test" className={clsx('navbar__item', {})}>
        <NavbarNavLink
          role="button"
          className={clsx('navbar__link', className)}
          {...props}
          label={label}
          onClick={props.to ? undefined : (e) => e.preventDefault()}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          }}
        >
          {/*The following label seemingly does nothing*/}
          {label}
        </NavbarNavLink>
      </div>
    );
  }

  return null; // dont add a label if no label is present
}

function NavbarBetaNoticeMobile({
  className,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  position, // Need to destructure position from props so that it doesn't get passed on.
  ...props
}) {
  const label = getLabel();

  if (label) {
    return (
      <li className={clsx('menu__list-item', {})}>
        <NavbarNavLink
          role="button"
          className={clsx('menu__link', className)}
          {...props}
          label={label}
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          {/*The following label seemingly does nothing*/}
          {label}
        </NavbarNavLink>
      </li>
    );
  }

  return null; // dont add a label if no label is present
}

export default function NavbarBetaNotice({ mobile = false, ...props }) {
  const Comp = mobile ? NavbarBetaNoticeMobile : NavbarBetaNoticeDesktop;

  return <BrowserOnly>{() => <Comp {...props} />}</BrowserOnly>;
}
