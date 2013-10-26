var util = require('util');

module.exports.app_asset_url = function(asset_url_prefix, asset) {
  return util.format("url('%s%s')", asset_url_prefix, asset);
}
