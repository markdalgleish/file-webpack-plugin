function FileWebpackPlugin(options) {
  this.options = options || {};
}

FileWebpackPlugin.prototype.apply = function(compiler) {
  var self = this;
  compiler.plugin('emit', function(compiler, callback) {
    Object.keys(self.options).forEach(function(filename) {
      var helloWorld = 'Hello World!';
      compiler.assets[filename] = {
        source: function() {
          return helloWorld;
        },
        size: function() {
          return helloWorld.length;
        }
      };
    });

    callback();
  });
};

module.exports = FileWebpackPlugin;
