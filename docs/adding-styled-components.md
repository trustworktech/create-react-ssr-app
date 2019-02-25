---
id: adding-styled-components
title: Adding Styled Components
---

We recommend [Styled Components](https://www.styled-components.com/) as the preferred way to style your react apps. Styled components is a css-in-js solution which improves the developer experience for styling apps as well as many other benefits outlined [here](https://www.styled-components.com/docs/basics#motivation).

## Installation

Integrating styled components is simple:

```sh
npm install --save styled-components
```

Alternatively you may use `yarn`:

```sh
yarn add styled-components
```

Create React SSR App comes rolled with the Styled Components [babel plugin](https://www.styled-components.com/docs/tooling#babel-plugin) by default which adds support for server-side rendering, minification of styles, and a nicer debugging experience.

## Client Setup

Then in `public/app.html` you need to add a placeholder for the styles:

```diff
  <html lang="en">
    <head>
      ...
      <title>React SSR App</title>
+     %STYLE_TAGS%
    </head>
    <body>
      ...
    </body>
  </html>
```

## Server Setup

Then in `src/server/middleware/render.js`, add the following lines:

```diff
+ import { ServerStyleSheet } from 'styled-components';

  const renderMiddleware = () => (req, res) => {
    let html = req.html;
+   const sheet = new ServerStyleSheet();
+   const htmlContent = ReactDOMServer.renderToString(
+     sheet.collectStyles(<App />)
+   );
    const htmlReplacements = {
      HTML_CONTENT: htmlContent,
+     STYLE_TAGS: sheet.getStyleTags(),
    };

    ...

    res.send(html);
  };
```

Styled Components is now ready to use. To learn more about Styled Components, check out [its documentation](https://www.styled-components.com/).
