var Promise = require('bluebird');
var mapObj = require('map-obj');
var assign = require('object-assign');

function FileWebpackPlugin(files) {
  this.files = files || {};
}

FileWebpackPlugin.prototype.apply = function(compiler) {
  var self = this;
  compiler.plugin('emit', function(compiler, done) {
    var data = {};

    var assetPromises = mapObj(self.files, function(filename, asyncTemplate) {
      var promise = Promise
        .fromNode(asyncTemplate.bind(null, data))
        .then(createAssetFromContents)

      return [filename, promise];
    });

    Promise.props(assetPromises)
      .then(function(assets) {
        assign(compiler.assets, assets);
        done();
      }, function(err) {
        done(err);
      });
  });
};

function createAssetFromContents(contents) {
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
