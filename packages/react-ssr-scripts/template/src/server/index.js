import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import manifestHelpers from 'express-manifest-helpers';
import path from 'path';
import { filePaths } from 'react-ssr-scripts';

import renderMiddleware from './middleware/render';

const app = express();

app.use(compression());

app.use('/static', express.static('public'));
if (process.env.NODE_ENV === 'development' || process.env.CI) {
  app.use(
    '/static',
    express.static(path.join(filePaths.clientBuild, '/static'))
  );
}

app.use(cors());
app.use(bodyParser.json());

const manifestPath = path.join(filePaths.clientBuild, '/static');
app.use(
  manifestHelpers({
    manifestPath: `${manifestPath}/manifest.json`,
    cache: process.env.NODE_ENV === 'production',
  })
);

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
    `[${new Date().toISOString()}]`,
    `App is running: http://localhost:${process.env.PORT || 3000}`
  );
});
