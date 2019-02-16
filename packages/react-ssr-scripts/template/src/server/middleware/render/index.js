import React from 'react';
import ReactDOMServer from 'react-dom/server';

import './index.css';
import HTML from './HTML';
import App from '../../../App';

const renderMiddleware = () => (req, res) => {
  const html = ReactDOMServer.renderToString(
    <HTML
      scriptLinks={[
        res.locals.assetPath('bundle.js'),
        res.locals.assetPath('vendor.js'),
      ]}
      styleLinks={[
        res.locals.assetPath('bundle.css'),
        res.locals.assetPath('vendor.css'),
      ]}
    >
      <App />
    </HTML>
  );

  res.send('<!DOCTYPE html>' + html);
};

export default renderMiddleware;
