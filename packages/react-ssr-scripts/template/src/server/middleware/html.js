import fs from 'fs';
import path from 'path';

const htmlMiddleware = () => (req, res, next) => {
  const publicPath = path.join(__dirname, '/public');

  fs.readFile(`${publicPath}/index.html`, 'utf8', (err, html) => {
    if (!err) {
      req.html = html;
      next();
    } else {
      res.status(500).send('Error parsing index.html');
    }
  });
};

export default htmlMiddleware;
