---
id: title-and-meta-tags
title: Title and Meta Tags
sidebar_label: Title & Meta Tags
---

## Changing the title tag

You can find the source HTML file in the `public` folder of the generated project. You may edit the `<title>` tag in it to change the title from “React SSR App” to anything else.

Note that normally you wouldn’t edit files in the `public` folder very often. For example, [adding a stylesheet](adding-a-stylesheet.md) is done without touching the HTML.

If you need to dynamically update the page title based on the content, you can use the browser [`document.title`](https://developer.mozilla.org/en-US/docs/Web/API/Document/title) API. For more complex scenarios when you want to change the title from React components, you can use [React Helmet](https://github.com/nfl/react-helmet), a third party library. For more information on adding React Helmet to your project follow advice in [this section](adding-react-helmet.md).

## Sending Data from the Server to the Client

Similarly to how to pass the initial html content from the server to the client, you can leave some placeholders in the HTML that inject content, for example:

```js
<!doctype html>
<html lang="en">
  <head>
    <script>
      window.SERVER_DATA = __SERVER_DATA__;
    </script>
```

Then, on the server, you can replace `__SERVER_DATA__` with a JSON of real data right before sending the response. The client code can then read `window.SERVER_DATA` to use it. **Make sure to [sanitize the JSON before sending it to the client](https://medium.com/node-security/the-most-common-xss-vulnerability-in-react-js-applications-2bdffbcc1fa0) as it makes your app vulnerable to XSS attacks.**

This is useful if using Redux to pass the store created on the server back to the client as the initial state. For more information on adding Redux and passing the store back to the client follow advice in [this section](adding-redux.md).
