import React from 'react';

const HTML = ({ scriptLinks, styleLinks, children }) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <link rel="shortcut icon" href={`${process.env.PUBLIC_URL}favicon.ico`} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <meta name="theme-color" content="#000000" />
      <link rel="manifest" href={`${process.env.PUBLIC_URL}manifest.json`} />
      <title>React SSR App</title>
      {(scriptLinks || []).map(src => {
        return <script key={src} defer src={src} />;
      })}
      {(styleLinks || []).map(href => {
        return <link key={href} rel="stylesheet" href={href} />;
      })}
    </head>
    <body>
      <noscript>You need to enable JavaScript to run this app.</noscript>
      <div id="root">{children}</div>
    </body>
  </html>
);

export default HTML;
