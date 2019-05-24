import http from 'http';

let app = require('./server').default;
const server = http.createServer(app);

server.listen(process.env.PORT || 3000, () => {
  console.log(
    `React SSR App is running: http://localhost:${process.env.PORT || 3000}`
  );
});

let currentApp = app;
if (module.hot) {
  module.hot.accept('./server', () => {
    console.log('Server reloading...');

    try {
      app = require('./server').default;
      server.removeListener('request', currentApp);
      server.on('request', app);
      currentApp = app;
    } catch (error) {
      // Do nothing
    }
  });
}
