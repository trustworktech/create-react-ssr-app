---
id: adding-react-helmet
title: Adding React Helmet
---

[React Helmet](https://github.com/nfl/react-helmet/) is a document head manager for React. It makes it easy to update meta tags on the server as well as the client. To integrate it into Create React SSR App follow the instructions below.

## Installation

To add it, run:

```sh
npm install --save react-helmet
```

Alternatively you may use `yarn`:

```sh
yarn add react-helmet
```

## Client Setup

Then in `public/app.html` you need to add placeholders for the helmet attributes:

```diff
+ <html lang="en" %HELMET_HTML_ATTRIBUTES%>
    <head>
      ...
      <title>React SSR App</title>
+     %HELMET_META_ATTRIBUTES%
    </head>
+   <body %HELMET_BODY_ATTRIBUTES%>
      ...
    </body>
  </html>
```

## Server Setup

Then update `src/server/middleware/render.js` to add the helmet attributes:

```diff
+ import { Helmet } from "react-helmet";

  const renderMiddleware = () => (req, res) => {
    let html = req.html;
    const htmlContent = ReactDOMServer.renderToString(<App />);
+   const helmet = Helmet.renderStatic();
    const htmlReplacements = {
      HTML_CONTENT: htmlContent,
+     HELMET_HTML_ATTRIBUTES: helmet.htmlAttributes.toString(),
+     HELMET_META_ATTRIBUTES: `
+       ${helmet.title.toString()}
+       ${helmet.meta.toString()}
+       ${helmet.link.toString()}
+     `,
+     HELMET_BODY_ATTRIBUTES: helmet.bodyAttributes.toString(),
    };

    ...

    res.send(html);
  };

  export default renderMiddleware;
```

React Helmet is now ready to use. To learn more about React Helmet, check out [its documentation](https://github.com/nfl/react-helmet/).
