module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['@verumtech/react-app-uni'],
  };
};
