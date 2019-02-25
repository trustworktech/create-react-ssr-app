---
id: adding-redux
title: Adding Redux
---

[Redux](https://redux.js.org/) is a predictable state container for JavaScript apps. It is a popular libarary for managing state in React apps. It is easy to integrate into Create React SSR App. With server side rendering, you need to maintain two instances of a redux store (one for the client and one for the server). When a request comes in, a store will get created on the server, then passed to the client.

## Installation

To add it, run:

```sh
npm install --save redux react-redux
```

Alternatively you may use `yarn`:

```sh
yarn add redux react-redux
```

## Client Setup

Then in `public/app.html` you need to add a script to load the store from the server:

```diff
<html lang="en">
  ...
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root">%HTML_CONTENT%</div>
+   <script>
+     window.PRELOADED_STATE = %PRELOADED_STATE%
+   </script>
  </body>
</html>
```

Then add a new file for he store in `src/client/store.js` with the following:

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

## Server Setup

Redux is now ready to use. To learn more about Redux, check out [its documentation](https://reacttraining.com/react-router/web/).
