var Promise = require('bluebird');
var map = require('lodash.map');

function FileWebpackPlugin(options) {
  this.options = options || {};
}

FileWebpackPlugin.prototype.apply = function(compiler) {
  var self = this;
  compiler.plugin('emit', function(compiler, done) {
    var data = {};

    var promises = map(self.options, function(asyncTemplate, filename) {
      return new Promise(function(reject, resolve) {
        asyncTemplate(data, function(err, contents) {
          if (err) return reject(err);

          compiler.assets[filename] = createAsset(contents);

          resolve();
        });
      });
    });

    Promise.all(promises)
      .then(function() {
        done();
      }, function(err) {
        done(err);
      });
  });
};

function createAsset(contents) {
  return {
    source: function() {
      return contents;
    },
    size: function() {
      return contents.length;
    }
  };
}

module.exports = FileWebpackPlugin;
