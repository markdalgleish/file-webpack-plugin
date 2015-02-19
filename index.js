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
      return Promise
        .fromNode(asyncTemplate.bind(null, data))
        .then(createAssetFromContents);
    });

    Promise.props(assetPromises)
      .then(addAssetsToCompiler(compiler))
      .nodeify(done);
  });
};

var createAssetFromContents = function(contents) {
  return {
    source: function() {
      return contents;
    },
    size: function() {
      return contents.length;
    }
  };
};

var addAssetsToCompiler = curry(function(compiler, assets) {
  assign(compiler.assets, assets);
});

module.exports = FileWebpackPlugin;
