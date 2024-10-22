import type { GatsbyBrowser } from 'gatsby';
import { StrictMode } from 'react';
global.Buffer = global.Buffer || require('buffer').Buffer;
import { App } from './src/App';
import { Root } from './src/Root';

export const wrapRootElement: GatsbyBrowser['wrapRootElement'] = ({
  element,
}) => (
  <StrictMode>
    <Root>{element}</Root>
  </StrictMode>
);

export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = ({
  element,
}) => <App>{element}</App>;
