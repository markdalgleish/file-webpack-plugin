var Promise = require('bluebird');
var mapValues = require('lodash.mapvalues');
var assign = require('lodash.assign');
var curry = require('lodash.curry');

function FileWebpackPlugin(files) {
  this.files = files || {};
}

FileWebpackPlugin.prototype.apply = function(compiler) {
  var self = this;
  compiler.plugin('emit', function(compiler, done) {
    var data = {};

    var assetPromises = mapValues(self.files, function(asyncTemplate, filename) {
      var promise = Promise
        .fromNode(asyncTemplate.bind(null, data))
        .then(createAssetFromContents)

      return promise;
    });

    Promise.props(assetPromises)
      .then(addAssetsToCompiler(compiler))
      .nodeify(done);
  });
};

var addAssetsToCompiler = curry(function(compiler, assets) {
  assign(compiler.assets, assets);
});

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
