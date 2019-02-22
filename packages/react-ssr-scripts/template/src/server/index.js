import path from 'path';
import express from 'express';

import htmlMiddleware from './middleware/html';
import renderMiddleware from './middleware/render';

const publicPath = path.join(__dirname, '/public');
const app = express();

app.use(express.static(publicPath));
app.use(htmlMiddleware());
app.use(renderMiddleware());

app.use((err, req, res, next) => {
  return res.status(404).json({
    status: 'error',
    message: err.message,
    stack:
      process.env.NODE_ENV === 'development' &&
      (err.stack || '')
        .split('\n')
        .map(line => line.trim())
        .map(line => line.split(path.sep).join('/'))
        .map(line =>
          line.replace(
            process
              .cwd()
              .split(path.sep)
              .join('/'),
            '.'
          )
        ),
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `React SSR App is running: http://localhost:${process.env.PORT || 3000}`
  );
});
