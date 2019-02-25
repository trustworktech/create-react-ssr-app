---
id: adding-a-router
title: Adding a Router
---

Create React SSR App doesn't prescribe a specific routing solution, but [React Router](https://reacttraining.com/react-router/web/) is the most popular one.

## Installation

To add it, run:

```sh
npm install --save react-router-dom
```

Alternatively you may use `yarn`:

```sh
yarn add react-router-dom
```

## Client Setup

Then in `src/client/index.js`, add the following lines:

```diff
+ import { BrowserRouter } from 'react-router-dom';

  ...

  ReactDOM.hydrate(
+   <BrowserRouter>
+     <App />
+   </BrowserRouter>,
    document.getElementById('root')
  );
```

## Server Setup

Last in `src/server/middleware/render.js`, add the following lines:

```diff
+ import { StaticRouter } from 'react-router-dom';

  const renderMiddleware = () => (req, res) => {
    let html = req.html;
+   const routerContext = {};
+   const htmlContent = ReactDOMServer.renderToString(
+     <StaticRouter
+       location={req.url}
+       context={routerContext}
+     >
+       <App />
+     </StaticRouter>
+   );
    const htmlReplacements = {
      HTML_CONTENT: htmlContent,
    };

    ...
+   if (routerContext.url) {
+     res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
+     res.header('Pragma', 'no-cache');
+     res.header('Expires', 0);
+     res.redirect(302, routerContext.url);
+   } else {
      res.send(html);
+   }
  };
```

React Router is now ready to use. To learn more about React Router, check out [its documentation](https://reacttraining.com/react-router/web/).
