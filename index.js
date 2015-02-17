function FileWebpackPlugin(options) {
  this.options = options || {};
}

FileWebpackPlugin.prototype.apply = function(compiler) {
  var self = this;
  compiler.plugin('emit', function(compiler, callback) {
    Object.keys(self.options).forEach(function(filename) {
      console.log(filename);
    });

    callback();
  });
};

module.exports = FileWebpackPlugin;
