---
id: adding-redux
title: Adding Redux
---

[Redux](https://redux.js.org/) is a predictable state container for JavaScript apps. It is a popular libarary for managing state in React apps. It is easy to integrate into Create React SSR App. With server side rendering, you need to maintain two instances of a redux store (one for the client and one for the server). When a request comes in, a store will get created on the server, then passed to the client.

## Installation

To add it, run:

```sh
npm install --save redux react-redux serialize-javascript
```

Alternatively you may use `yarn`:

```sh
yarn add redux react-redux serialize-javascript
```

## Client Setup

Then in `public/app.html` you need to add a script to load the store from the server:

```diff
  <html lang="en">
    ...
    <body>
      <noscript>You need to enable JavaScript to run this app.</noscript>
+     <script>
+       window.PRELOADED_STATE = __PRELOADED_STATE__
+     </script>
      <div id="root">__HTML_CONTENT__</div>
    </body>
  </html>
```

Then add a new file for the client store in `src/client/store.js` with the following:

```sh
import { createStore } from 'redux';

## Shared reducer between client and server
import reducer from '../reducer';

const configureStore = () => {
  const preloadedState = window.PRELOADED_STATE;

  const store = createStore(
    reducer,
    preloadedState,
  );

  return store;
};

export default configureStore;
```

Then update `src/client/index.js` to configure the client store:

```diff
+ import { Provider as ReduxProvider } from 'react-redux';

  import App from '../App';
+ import configureStore from './store';
  ...

+ const store = configureStore();

  ReactDOM.hydrate(
+   <ReduxProvider store={store}>
+     <App />
+   </ReduxProvider>,
    document.getElementById('root')
  );
```

## Server Setup

For the server store we recommend using middlware. First add a new file in `src/server/middleware/store.js` with the following:

```sh
import { createStore } from 'redux';

## Shared reducer between client and server
import reducer from '../../reducer';

const configureStore = () => {
  const store = createStore(reducer);

  return store;
};

const storeMiddleware = () => (req, res, next) => {
  const store = configureStore();
  req.store = store;
  next();
};

export default storeMiddleware;
```

Then update `src/server/index.js` to include the store middleware:

```diff
  import htmlMiddleware from './middleware/html';
+ import storeMiddleware from './middleware/store';

  ...
  app.use(htmlMiddleware());
+ app.use(storeMiddleware()); // must come before render middleware
  app.use(renderMiddleware());
```

Finally update `src/server/middleware/render.js` to send the store back to the client on each request:

```diff
+ import { Provider as ReduxProvider } from 'react-redux';
+ import serialize from 'serialize-javascript';

  const renderMiddleware = () => (req, res) => {
    let html = req.html;
+   const store = req.store;
+   const htmlContent = ReactDOMServer.renderToString(
+     <ReduxProvider store={store}>
+       <App />
+     </ReduxProvider>
+   );
    const htmlReplacements = {
      HTML_CONTENT: htmlContent,
+     PRELOADED_STATE: serialize(store.getState(), { isJSON: true }),
    };

    ...

    res.send(html);
  };

  export default renderMiddleware;
```

Redux is now ready to use. To learn more about Redux, check out [its documentation](https://reacttraining.com/react-router/web/).
