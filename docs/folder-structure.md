---
id: folder-structure
title: Folder Structure
---

After creation, your project should look like this:

```
my-app/
  README.md
  node_modules/
  package.json
  .gitignore
  public/
    app.html
    favicon.ico
    manifest.json
  src/
    client/
      index.css
      index.js
    server/
      middleware/
        html.js
        render.js
      index.js
    App.css
    App.js
    App.test.js
    index.js
    logo.svg
```

For the project to build, **these files must exist with exact filenames**:

- `public/app.html` is the page template;
- `src/client/index.js` is the JavaScript client entry point.
- `src/index.js` is the JavaScript server entry point.

You can delete or rename the other files.

You may create subdirectories inside `src`. For faster rebuilds, only files inside `src` are processed by Webpack. You need to **put any JS and CSS files inside `src`**, otherwise Webpack won’t see them.

Only files inside `public` can be used from `public/app.html`. Read instructions below for using assets from JavaScript and HTML.

You can, however, create more top-level directories. They will not be included in the production build so you can use them for things like documentation.

If you have Git installed and your project is not part of a larger repository, then a new repository will be initialized resulting in an additional top-level `.git` directory.
